// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

enum Status {
    NULL,
    ACTIVE,
    INACTIVE
}

enum RequestType {
    TOKEN_UPDATED,
    CHARGE,
    MERCHANT_UPDATED
}

event ChargeExecuted(uint256 indexed subscriptionId, uint256 billingCycle);
event ChargeDispatchSent(uint256 indexed subscriptionId, uint256 billingCycle, bytes32 indexed commitmentId);
event TokenUpdated(address indexed token, bool active);
event MerchantProfileUpdated(address indexed mId, uint256 indexed pId, uint256 _price, bool status);
event FeeUpdated(uint256 fee, uint256 oldFee);

error UnregisteredSource();
error InvalidRequestType();

interface IBillingAdapter {
    function withdrawFees(address token, address to) external;

    function updateFee(uint256 fee) external;
}