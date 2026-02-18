// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

/**
 * @title IMerchantRegistry - Interface for managing Merchants' creations, their Identity specifically
 * This contract is the true source of each Merchant's profile
 * 
 * It does not store the Plans for merchants/subscriptions nor does it handle payments
 */

struct Merchant {
    address owner;  // Merchant's admin wallet address
    uint256 grace;  // Default grace period, if the plan doesn't have one (in seconds)
    uint256 window; // Default billing window before due date (, in secomds)
    bool active;    // If false, block new subscriptions
    bytes metadata; // IPFS hash of data
}

struct Payout {
    address payoutAddr; // Where merchant receives funds
    uint32 chainId; // The chain where this payment happens
    bool enabled;   // Whether this `Payout` option is enabled
}

// Emitted when a new merchant is created
event MerchantCreated(uint256 indexed mId, address indexed owner);
event MerchntUpdated(uint256 indexed mId, bool status);
event PayoutAddressSet(uint256 indexed mId, uint32 indexed chainId, address payoutAddr);

interface IMerchantRegistry {
    function createMerchant(address owner, uint256 grace, uint256 window, bytes calldata metadata) external returns (uint256 mId);

    function updateMerchantConfig(uint256 mId, uint256 grace, uint256 window, bytes calldata metadata) external;

    function setMerchantStatus(uint256 mId, bool active) external;

    function setPayoutAddress(uint256 mId, uint32 chainId, address payoutAddress) external;

    function getMerchant(uint256 mId) external view returns (Merchant memory);

    function getPayoutAddress(uint256 mId, uint32 chainId) external returns (address);
}