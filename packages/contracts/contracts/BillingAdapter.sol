// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {HyperApp} from "@hyperbridge/core/contracts/apps/HyperApp.sol";
import {IncomingPostRequest} from "@hyperbridge/core/contracts/interfaces/IApp.sol";
import {StateMachine} from "@hyperbridge/core/contracts/libraries/StateMachine.sol";
import {PostRequest} from "@hyperbridge/core/contracts/libraries/Message.sol";
import {IDispatcher, DispatchPost} from "@hyperbridge/core/contracts/interfaces/IDispatcher.sol";

import "./interfaces/IBillingAdapter.sol";

contract BillingAdapter is
    HyperApp,
    IBillingAdapter,
    OwnableUpgradeable,
    ReentrancyGuard
{
    address private _host;
    mapping(address => bool) private tokens;
    uint256 private fee = 5 * 10 ** 17; // 0.5 fee for each charge, can be updated by owner
    bytes private hubControl;
    bool private initialized;

    mapping(bytes32 => bool) public charges;

    IERC20 public feeToken;

    modifier onlyAfterInitialize() {
        require(initialized, "Not initialized");
        _;
    }

    /**
     *
     * @param _h The HyperApp contract for the chain
     * @param _hub The keccak hash of the hub controller
     */
    function initialize(
        address _h,
        bytes memory _hub,
        address _fee
    ) public initializer {
        require(!initialized, "Already initialized");
        __Ownable_init(msg.sender);
        _host = _h;
        hubControl = _hub;
        feeToken = IERC20(_fee);
        feeToken.approve(_host, type(uint256).max);
        initialized = true;
    }

    function host() public view override returns (address) {
        return _host;
    }

    function onAccept(
        IncomingPostRequest calldata _incoming
    ) external override onlyHost nonReentrant onlyAfterInitialize {
        if (keccak256(_incoming.request.from) != keccak256(hubControl)) {
            revert UnregisteredSource();
        }
        if (keccak256(_incoming.request.source) != keccak256(_sourceChain())) {
            revert UnregisteredSource();
        }

        // Decode bytes from data
        (uint8 _type, bytes memory params) = abi.decode(
            _incoming.request.body,
            (uint8, bytes)
        );
        if (RequestType(_type) == RequestType.TOKEN_UPDATED) {
            // Update Token Route
            (address _token, bool _add) = abi.decode(params, (address, bool));
            _updateToken(_token, _add);
        } else if (RequestType(_type) == RequestType.CHARGE) {
            (
                uint256 _subid,
                uint256 _amount,
                address _subscriber,
                address _token,
                uint256 _cycle,
                address _payout
            ) = abi.decode(
                    params,
                    (uint256, uint256, address, address, uint256, address)
                );
            _charge(_subid, _amount, _subscriber, _token, _cycle, _payout);
        } else {
            revert InvalidRequestType();
        }
    }

    function onPostRequestTimeout(
        PostRequest memory request
    ) external override onlyAfterInitialize {
        (uint8 _type, bytes memory _params) = abi.decode(
            request.body,
            (uint8, bytes)
        );

        if (RequestType(_type) == RequestType.CHARGE) {
            // Just resend the message
            (uint256 _subid, uint256 _cycle, ) = abi.decode(
                _params,
                (uint256, uint256, uint256)
            );
            bytes32 chargeId = keccak256(abi.encode(_subid, _cycle));
            if (!charges[chargeId]) return;

            // Just resend the message
            IDispatcher(_host).dispatch(
                DispatchPost({
                    body: request.body,
                    dest: request.dest,
                    timeout: uint64(0),
                    to: abi.encodePacked(hubControl),
                    fee: 0,
                    payer: address(this)
                })
            );
            return;
        }
    }

    function withdrawFees(address token, address to) external onlyOwner {
        // Withdraw all tokens to the owner
        uint256 balance = IERC20(token).balanceOf(address(this));
        SafeERC20.safeTransfer(IERC20(token), to, balance);
    }

    function updateFee(uint256 _fee) external onlyOwner {
        uint256 oldFee = fee;
        fee = _fee;
        emit FeeUpdated(_fee, oldFee);
    }

    function _sourceChain() internal pure returns (bytes memory) {
        // 1000 is the polkadot assetHub chain ID
        return StateMachine.polkadot(1000);
    }

    function _updateToken(address _token, bool _add) internal {
        if (_add) {
            tokens[_token] = true;
        } else {
            delete tokens[_token];
        }

        emit TokenUpdated(_token, _add);
    }

    function _charge(
        uint256 _subid,
        uint256 _amount,
        address _subscriber,
        address _token,
        uint256 _cycle,
        address _payout
    ) internal {
        // Ensure token is supported
        if (!tokens[_token] || _payout == address(0)) {
            revert InvalidRequestType();
        }
        if (fee >= _amount) {
            revert InvalidRequestType();
        }
        // Ensure the charge is not executed before (idempotency)
        bytes32 chargeId = keccak256(abi.encode(_subid, _cycle));
        if (charges[chargeId]) {
            revert InvalidRequestType();
        }
        // Initiate transfer action from subscriber
        SafeERC20.safeTransferFrom(
            IERC20(_token),
            _subscriber,
            _payout,
            _amount - fee
        );
        SafeERC20.safeTransferFrom(
            IERC20(_token),
            _subscriber,
            address(this),
            fee
        );

        charges[chargeId] = true;
        _notifyChargeSuccess(_subid, _cycle);
        emit ChargeExecuted(_subid, _cycle);
    }

    function _notifyChargeSuccess(uint256 _subid, uint256 _cycle) internal {
        bytes memory params = abi.encode(_subid, _cycle, block.chainid);
        bytes memory body = abi.encode(1, params);

        DispatchPost memory post = DispatchPost({
            body: body,
            dest: _sourceChain(),
            timeout: uint64(0),
            to: abi.encodePacked(hubControl),
            fee: 0,
            payer: address(this)
        });
        bytes32 commitmentid = IDispatcher(_host).dispatch(post);
        emit ChargeDispatchSent(_subid, _cycle, commitmentid);
    }
}
