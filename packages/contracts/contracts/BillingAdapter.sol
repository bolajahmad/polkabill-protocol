// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ECDSA} from '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import {EIP712} from '@openzeppelin/contracts/utils/cryptography/EIP712.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable2Step.sol';
import {ReentrancyGuard} from '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import {SafeERC20} from '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import {IERC20} from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract BillingAdapter is EIP712, ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    string private constant NAME = 'BillingAdapter';
    string private constant VERSION = '1';

    bytes32 private constant CHARGE_TYPEHASH =
        keccak256(
            'Charge(uint256 subId,uint256 cycle,uint256 amount,address subscriber,address token,address merchant,uint256 nonce)'
        );
    bytes32 private constant TOKEN_TYPEHASH =
        keccak256('TokenUpdate(address token,bool allowed,uint256 nonce)');
    bytes32 private constant MERCHANT_TYPEHASH =
        keccak256('MerchantUpdate(address merchant,address payout,uint256 nonce)');

    uint256 public fee = 5 * 10 ** 17; // 0.5 by default
    address public signer; // trusted signer (admin/backend)

    mapping(bytes32 => bool) public executedCharge;
    mapping(bytes32 => bool) public executedRelay;
    mapping(uint256 => bool) public usedNonce;
    // token allowlist
    mapping(address => bool) public supportedToken;
    mapping(address => address) public merchantPayout;

    event ChargeExecuted(uint256 indexed subId, uint256 indexed cycle);
    event TokenUpdated(address token, bool allowed);
    event MerchantUpdated(address merchant, address payout);
    event FeeUpdated(uint256 newFee);

    struct Charge {
        uint256 subId;
        uint256 cycle;
        uint256 amount;
        address subscriber;
        address token;
        address merchant;
        uint256 nonce;
    }

    constructor() EIP712(NAME, VERSION) Ownable(msg.sender) {
        signer = msg.sender;
    }

    // Relayer entrypoint
    function executeChargeWithSig(Charge calldata c, bytes calldata sig) external nonReentrant {
        bytes32 digest = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    CHARGE_TYPEHASH,
                    c.subId,
                    c.cycle,
                    c.amount,
                    c.subscriber,
                    c.token,
                    c.merchant,
                    c.nonce
                )
            )
        );

        address recovered = ECDSA.recover(digest, sig);
        require(recovered == signer, 'INVALID_SIG');

        bytes32 chargeId = keccak256(abi.encode(c.subId, c.cycle));
        require(!executedCharge[chargeId], 'ALREADY_EXECUTED');

        require(supportedToken[c.token], 'TOKEN_NOT_SUPPORTED');

        address payout = merchantPayout[c.merchant];
        require(payout != address(0), 'INVALID_MERCHANT');

        executedCharge[chargeId] = true;

        IERC20(c.token).safeTransferFrom(c.subscriber, address(this), c.amount);

        IERC20(c.token).safeTransfer(payout, c.amount - fee);

        emit ChargeExecuted(c.subId, c.cycle);
    }

    // Admin logic
    function setTokenWithSig(
        address token,
        bool allowed,
        uint256 nonce,
        bytes calldata sig
    ) external {
        bytes32 digest = _hashTypedDataV4(
            keccak256(abi.encode(TOKEN_TYPEHASH, token, allowed, nonce))
        );

        address recovered = ECDSA.recover(digest, sig);
        require(recovered == signer, 'INVALID_SIG');

        bytes32 relayId = keccak256(abi.encode(token, allowed, nonce));
        require(executedRelay[relayId] == false, 'ALREADY_EXECUTED');
        require(!usedNonce[nonce], "NONCE_USED");
        executedRelay[relayId] = true;
        supportedToken[token] = allowed;
        usedNonce[nonce] = true;
        emit TokenUpdated(token, allowed);
    }

    function setMerchantWithSig(
        address merchant,
        address payout,
        uint256 nonce,
        bytes calldata sig
    ) external {
        bytes32 digest = _hashTypedDataV4(
            keccak256(abi.encode(MERCHANT_TYPEHASH, merchant, payout, nonce))
        );

        address recovered = ECDSA.recover(digest, sig);
        require(recovered == signer, 'INVALID_SIG');

        bytes32 relayId = keccak256(abi.encode(merchant, payout, nonce));
        require(executedRelay[relayId] == false, 'ALREADY_EXECUTED');
        require(!usedNonce[nonce], "NONCE_USED");
        executedRelay[relayId] = true;
        usedNonce[nonce] = true;
        merchantPayout[merchant] = payout;

        emit MerchantUpdated(merchant, payout);
    }

    function setFee(uint256 _fee) external onlyOwner {
        fee = _fee;
        emit FeeUpdated(_fee);
    }

    function withdrawFees(address _token, address _to) external onlyOwner {
        uint256 balance = IERC20(_token).balanceOf(address(this));
        IERC20(_token).safeTransfer(_to, balance);
    }
}
