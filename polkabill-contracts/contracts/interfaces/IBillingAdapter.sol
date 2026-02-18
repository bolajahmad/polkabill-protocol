// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

event Charged(uint256 indexed subscriptionId, uint256 billingCycle, uint256 planId);

interface IBillingAdapter {
    function charge(uint256 subscriptionId, uint256 billingCycle, address subscriber, address token, uint256 amount, address merchantPayout) external;

    function withdrawFees(address token, address to) external;
}