// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

struct Adapter {
    address adapter;
    bool active;
}

event ChainRegistered(uint256 indexed chainId, address indexed billingAdapter);
event ChainStatusUpdated(uint256 indexed chainId, bool active);
event TokenSupportUpdated(uint256 indexed chainId, address indexed token, bool supported);

error ChainExists();
error UnregisteredChain();
error InvalidAdapterCode();

interface IChainRegistry {
    function registerChain(uint256 chainId, address adapter) external;

    function setChainStatus(uint256 chainId, bool active) external;

    function setTokenSupport(uint256 chainId, address token, bool supported) external;

    function isChainSupported(uint256 chainId) external view returns (bool);

    function getBillingAdapter(uint256 chainId) external view returns (address);

    function isValidAdapter(uint256 chainId, address adapter) external view returns (bool);

    function isTokenSupported(uint256 chainId, address token) external view returns (bool);

    function approvedAdapterCodeHash() external view returns (bytes32);
}