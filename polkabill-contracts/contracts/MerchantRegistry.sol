// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./interfaces/IMerchantRegistry.sol";
import {ISubscriptionManager} from "./interfaces/ISubscriptionManager.sol";
import {IChainRegistry, UnregisteredChain} from "./interfaces/IChainRegistry.sol";

contract MerchantRegistry is IMerchantRegistry {
    IChainRegistry private immutable chainReg;
    mapping(address => Merchant) private merchants;
    mapping(bytes32 => address) private payoutAddresses;

    ISubscriptionManager public subManager;

    modifier onlyUniqueMerchants(address _mid) {
        if (merchants[_mid].active && merchants[_mid].window > 0) {
            revert MerchantNotUnique();
        }
        _;
    }
    modifier onlySubscriptionManager() {
        if (msg.sender != address(subManager)) {
            revert Unauthorized();
        }
        _;
    }

    constructor(address _chain) {
        chainReg = IChainRegistry(_chain);
    }

    function createMerchant(
        address _owner,
        uint256 _grace,
        uint256 _window,
        bytes calldata _meta
    )
        external
        onlyUniqueMerchants(_owner)
        onlySubscriptionManager
        returns (address mId)
    {
        merchants[_owner] = Merchant({
            grace: _grace,
            window: _window,
            active: true,
            metadata: _meta
        });

        emit MerchantCreated(_owner, _meta);
        mId = _owner;
    }

    function updateMerchantConfig(address _mid, uint256 _grace, uint256 _window, bytes calldata _metadata) external {
        if (msg.sender != _mid) {
            revert Unauthorized();
        }
        Merchant memory merchant = merchants[_mid];

        // Merchant must exist with the ID
        if (!merchant.active || merchant.window == 0) {
            revert MissingMerchant();
        }

        merchants[_mid] = Merchant({
            grace: _grace,
            window: _window == 0 || _window == merchant.window ? merchant.window : _window,
            active: merchant.active,
            metadata: _metadata
        });

        emit MerchantUpdated(_mid, _grace, _window == 0 || _window == merchant.window ? merchant.window : _window, _metadata);
    }

    function setMerchantStatus(address _mid, bool active) external {
        if (msg.sender != _mid) {
            revert Unauthorized();
        }
        Merchant storage merchant = merchants[_mid];
        
        // Merchant must exist with the ID
        if (merchant.window == 0) {
            revert MissingMerchant();
        }

        merchant.active = active;

        emit MerchantStatusUpdated(_mid, active);
    }

    /**
     * Updates the Merchant's payout address
     * Ideally, will send a cross-chain message to notify BillingAdapter
     * 
     * This will update the payout address, if it exists
     * Subsequent charges will deal with the new _payout
     * 
     * There may be a couple minutes delay (due to cross-chain messaging)
     * Charges happen on the BillingAdapter, so a cross-chain message is needed to notify
     * 
     * @param _mid The merchant address
     * @param _cid The chain ID where payout is configured
     * @param _payout The address to pay to
     */
    function setPayoutAddress(address _mid, uint256 _cid, address _payout) external {
        if (msg.sender != _mid) {
            revert Unauthorized();
        }
        // Ensure Merchant exists and is the caller of this
        Merchant memory merchant = merchants[_mid];
        if (!merchant.active || merchant.window == 0) {
            revert MissingMerchant();
        }

        // Ensure the chain is registered
        bool supported = chainReg.isChainSupported(_cid);
        if (!supported) {
            revert UnregisteredChain();
        }

        bytes32 route = keccak256(abi.encode(_mid, _cid));
        address oldAddr = payoutAddresses[route];
        payoutAddresses[route] = _payout;

        emit PayoutAddressSet(_mid, _cid, _payout, oldAddr);
    }

    function getMerchant(address _mid) external view returns (Merchant memory) {
        return merchants[_mid];
    }

    function getPayoutAddress(address _mid, uint256 _cid) external view returns (address) {
        bytes32 route = keccak256(abi.encode(_mid, _cid));

        return payoutAddresses[route];
    }

    function setSubscriptionManager(address _mgr) external {
        subManager = ISubscriptionManager(_mgr);
    }
}
