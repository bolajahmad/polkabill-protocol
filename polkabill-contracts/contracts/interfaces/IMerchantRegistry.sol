// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

/**
 * @title IMerchantRegistry - Interface for managing Merchants' creations, their Identity specifically
 * This contract is the true source of each Merchant's profile
 * 
 * It does not store the Plans for merchants/subscriptions nor does it handle payments
 */

struct Merchant {
    uint256 grace;  // Default grace period, if the plan doesn't have one (in seconds)
    uint256 window; // Default billing window before due date (, in secomds)
    bool active;    // If false, block new subscriptions
    bytes metadata; // IPFS hash of data
}

// Emitted when a new merchant is created
event MerchantCreated(address indexed mId, bytes indexed metadata);
event MerchantStatusUpdated(address indexed mId, bool status);
event MerchantUpdated(address indexed mid, uint256 _grace, uint256 window, bytes metadata);
event PayoutAddressSet(address indexed mId, uint256 indexed chainId, address payoutAddr, address old);
event TokensAdded(address indexed mid, uint256 indexed cid, address[] tokens, bool isAdding);

error MerchantNotUnique();
error MissingMerchant();
error Unauthorized();
error UnsupportedToken();

interface IMerchantRegistry {
    function createMerchant(address owner, uint256 grace, uint256 window, bytes calldata metadata) external returns (address mId);

    function updateMerchantConfig(address mId, uint256 grace, uint256 window, bytes calldata metadata) external;

    function setMerchantStatus(address mId, bool active) external;

    function setPayoutAddress(address mId, uint256 chainId, address payoutAddress) external;

    function getMerchant(address mId) external view returns (Merchant memory);

    function getPayoutAddress(address mId, uint256 chainId) external returns (address);

    function isApprovedToken(address mid, uint256 cid, address token) external view returns (bool);
}