// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ECDSA} from '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import {EIP712} from '@openzeppelin/contracts/utils/cryptography/EIP712.sol';
import {ReentrancyGuard} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import {ECDSA} from '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import {EIP712} from '@openzeppelin/contracts/utils/cryptography/EIP712.sol';

interface ISubscriptionManager {
    function confirmCharge(uint256 subId, uint256 cycle) external;
}

contract SubscriptionsController is EIP712, ReentrancyGuard {
    string private constant NAME = 'SubscriptionsController';
    string private constant VERSION = '1';

    bytes32 private constant CONFIRM_TYPEHASH =
        keccak256('Confirm(uint256 subId,uint256 cycle,uint256 nonce)');

    ISubscriptionManager public immutable subManager;
    address public signer;
    uint256 public globalNonce;

    // chargeId => processed
    mapping(bytes32 => bool) public processedCharge;

    event ChargeRequested(
        uint256 indexed chainId,
        uint256 indexed subId,
        uint256 cycle,
        bytes data
    );
    event ChargeConfirmed(uint256 indexed chainId, uint256 indexed subId, uint256 cycle);
    event TokenUpdateRequested(
        uint256 indexed chainId,
        address indexed adapter,
        address token,
        bool allowed,
        uint256 nonce
    );
    event MerchantUpdateRequested(
        uint256 indexed chainId,
        address indexed adapter,
        address merchant,
        address payout,
        uint256 nonce
    );

    constructor(address _subManager) EIP712(NAME, VERSION) {
        subManager = ISubscriptionManager(_subManager);
        signer = msg.sender;
    }

    struct ConfirmCharge {
        uint256 subId;
        uint256 cycle;
        uint256 nonce;
    }

    // Relayer entrypoint
    function confirmChargeWithSig(
        ConfirmCharge calldata cc,
        bytes calldata sig
    ) external nonReentrant {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    CONFIRM_TYPEHASH,
                    cc.subId,
                    cc.cycle,
                    cc.nonce
                )
            )
        );

        address recovered = ECDSA.recover(digest, sig);
        require(recovered == signer, "INVALID_SIG");

        bytes32 chargeId = keccak256(abi.encodePacked(cc.subId, cc.cycle));
        require(!processedCharge[chargeId], 'CHARGE_ALREADY_PROCESSED');
        processedCharge[chargeId] = true;

        subManager.confirmCharge(cc.subId, cc.cycle);
    }

    // Emit charge requested logic
    function relayChargeRequest(
        uint256 chainId,
        address adapter,
        bytes calldata body,
        bool native
    ) external {
        (uint256 subId, uint256 amount, address subscriber, address token, uint256 cycle, address payout) = abi.decode(body, (uint256, uint256, address, address, uint256, address));
        require(msg.sender == address(subManager), 'ONLY_SUB_MANAGER');
        emit ChargeRequested(chainId, subId, cycle, body);
    }

    function requestTokenUpdate(
        uint256 chainId,
        address adapter,
        bool _native,
        bytes memory _body
    ) external {
        uint256 nonce = ++globalNonce;

        (address token, bool allowed) = abi.decode(_body, (address, bool));
        emit TokenUpdateRequested(chainId, adapter, token, allowed, nonce);
    }

    function relayMerchantProfileUpdate(
        uint256 chainId,
        address adapter,
        bytes calldata _body
    ) external {
        (address merchant,,,, address payout) = abi.decode(_body, (address, uint256, address[], bool, address));
        uint256 nonce = ++globalNonce;
        emit MerchantUpdateRequested(chainId, adapter, merchant, payout, nonce);
    }
}
