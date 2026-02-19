// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./interfaces/IMerchantRegistry.sol";
import {ISubscriptionManager} from "./interfaces/ISubscriptionManager.sol";

abstract contract MerchantRegistry is IMerchantRegistry {
    mapping(address => Merchant) private merchants;

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
     * @param _mid The merchant address
     */
    function setPayoutAddress(address _mid) external {
        
    }

    function setSubscriptionManager(address _mgr) external {
        subManager = ISubscriptionManager(_mgr);
    }
}
