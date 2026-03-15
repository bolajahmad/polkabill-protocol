// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {HyperApp} from "@hyperbridge/core/contracts/apps/HyperApp.sol";
import {IncomingPostRequest} from "@hyperbridge/core/contracts/interfaces/IApp.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {StateMachine} from "@hyperbridge/core/contracts/libraries/StateMachine.sol";
import {DispatchPost, IDispatcher} from "@hyperbridge/core/contracts/interfaces/IDispatcher.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {PostRequest} from "@hyperbridge/core/contracts/libraries/Message.sol";

import {IChainRegistry} from "./interfaces/IChainRegistry.sol";
import {ISubscriptionManager} from "./interfaces/ISubscriptionManager.sol";
import {IMerchantRegistry} from "./interfaces/IMerchantRegistry.sol";

contract SubscriptionsController is HyperApp, Ownable, ReentrancyGuard {
    address private immutable _host;
    IERC20 public immutable feeToken;
    IChainRegistry public immutable chainRegistry;
    IMerchantRegistry public immutable merchantRegistry;
    ISubscriptionManager public immutable subManager;

    mapping(bytes32 => bool) public processedCharge;
    mapping(bytes32 => bool) public tokenSyncs;
    mapping(bytes32 => bool) public merchantSyncs;

    event ChargeConfirmed(uint256 indexed chainId, uint256 indexed subscriptionId, uint256 billingCycle);
    event TokenUpdateRelayed(uint256 indexed chainId, address indexed adapter, bool native);
    event ChargeRequestRelayed(uint256 indexed chainId, address indexed adapter, bytes body);
    event MerchantProfileUpdated(uint256 indexed chainId, address indexed adapter, bytes body);

    constructor(address _h, address _fee, address _chain, address _sub, address _merchant) Ownable(msg.sender) {
        _host = _h;
        chainRegistry = IChainRegistry(_chain);
        feeToken = IERC20(_fee);
        subManager = ISubscriptionManager(_sub);
        merchantRegistry = IMerchantRegistry(_merchant);
        IERC20(feeToken).approve(_host, type(uint256).max);
    }

    function host() public view override returns (address) {
        return _host;
    }

    function onAccept(IncomingPostRequest calldata _incoming) external override onlyHost nonReentrant {
        // The source must be in the ChainRegistry
        // Decode bytes from data
        (uint8 _type, bytes memory _params) = abi.decode(_incoming.request.body, (uint8, bytes));

        require(_type == 1, "INVALID_REQUEST_TYPE");
        (uint256 _subid, uint256 _cycle, uint256 _chainid) = abi.decode(_params, (uint256, uint256, uint256));
        if (keccak256(_incoming.request.source) != keccak256(StateMachine.evm(_chainid))) {
            revert("INVALID_CHAIN_ID");
        }
        address adapter = address(bytes20(_incoming.request.from));
        require(
            chainRegistry.isValidAdapter(_chainid, adapter),
            "UNREGISTERED_ADAPTER"
        );
        bytes32 chargeId = keccak256(abi.encode(_subid, _cycle));
        require(!processedCharge[chargeId], "CHARGE_ALREADY_PROCESSED");

        processedCharge[chargeId] = true;
        subManager.confirmCharge(_subid, _cycle);
        emit ChargeConfirmed(_chainid, _subid, _cycle);
    }

    function onPostRequestTimeout(PostRequest memory request) external override onlyHost nonReentrant {
        (uint8 _type, bytes memory _params) = abi.decode(request.body, (uint8, bytes));

        if (_type != 0) {
            // Just resend the message
            (uint256 _cid, address _token, bool _add) = abi.decode(_params, (uint256, address, bool));
            bytes32 syncId = keccak256(abi.encode(_cid, _token, _add));
            if (!tokenSyncs[syncId]) {
                return;
            }
        } 
    }

    function relayTokenUpdate(uint256 _chain, address _adapter, bool _native, bytes memory _body) external {
        require(msg.sender == address(chainRegistry), "Unauthorized call!");
        bytes memory dest = _native ? StateMachine.polkadot(_chain) : StateMachine.evm(_chain);
        DispatchPost memory post = DispatchPost({
            body: abi.encode(0, _body),
            dest: dest,
            timeout: uint64(0),
            to: abi.encodePacked(_adapter),
            fee: 0,
            payer: address(this)
        });

        IDispatcher(_host).dispatch(post);
        bytes32 syncId = keccak256(_body);
        tokenSyncs[syncId] = true;
        emit TokenUpdateRelayed(_chain, _adapter, _native);
    }

    function relayChargeRequest(uint256 _chain, address _adapter, bytes memory _body, bool _native) external {
        require(msg.sender == address(subManager), "Unauthorized call!");
        bytes memory dest = _native ? StateMachine.polkadot(_chain) : StateMachine.evm(_chain);
        DispatchPost memory post = DispatchPost({
            body: abi.encode(1, _body),
            dest: dest,
            timeout: uint64(0),
            to: abi.encodePacked(_adapter),
            fee: 0,
            payer: address(this)
        });

        IDispatcher(_host).dispatch(post);
        emit ChargeRequestRelayed(_chain, _adapter, _body);
    }

    function relayMerchantProfileUpdate(uint256 _chain, address _adapter, bytes memory _body) external {
        require(msg.sender == address(merchantRegistry), "Unauthorized call!");
        bytes memory dest = StateMachine.evm(_chain);
        DispatchPost memory post = DispatchPost({
            body: abi.encode(2, _body),
            dest: dest,
            timeout: uint64(0),
            to: abi.encodePacked(_adapter),
            fee: 0,
            payer: address(this)
        });

        IDispatcher(_host).dispatch(post);
        bytes32 syncId = keccak256(_body);
        merchantSyncs[syncId] = true;
        emit MerchantProfileUpdated(_chain, _adapter, _body);
    }
}