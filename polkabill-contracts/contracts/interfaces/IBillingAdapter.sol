// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

enum Status {
    NULL,
    ACTIVE,
    INACTIVE
}

enum RequestType {
    TOKEN_UPDATED,
    CHARGE
}

event ChargeExecuted(uint256 indexed subscriptionId, uint256 billingCycle);
event MerchantUpdated(address indexed mId, address indexed payout, bool active);
event PlanUpdated(address indexed mId, uint256 indexed pId, uint256 _price, bool status);
event FeeUpdated(uint256 fee, uint256 oldFee);

error UnregisteredSource();
error InvalidRequestType();

interface IBillingAdapter {
    function withdrawFees(address token, address to) external;

    function updateFee(uint256 fee) external;
}