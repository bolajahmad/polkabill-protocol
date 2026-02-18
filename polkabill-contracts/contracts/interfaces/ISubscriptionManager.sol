// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

enum Status {
    NULL,
    ACTIVE,
    DUE,
    CANCELLED
}

struct Subscription {
    uint256 planId;
    address subscriber;
    uint256 startTime; 
    uint256 nextChargeAt;
    uint256 billingCycle;
    Status status;
}

event Subscribed(uint256 indexed subId, address subscriber, uint256 planId);
event SubscriptionUpdated(uint256 indexed subscriptionId, Status status);
// event PaymentConfirmed(uint256 indexed subscriptionId, uint256 billingCycle);

error InsufficientAllowance();
error SubscriptionMissing();
error PlanNotActive();
error MerchantNotActive();
error NotSubscriber();

interface ISubscriptionManager {
    function subscribe(uint256 planId, uint256 start, address subscriber) external returns (uint256 subscriptionId);

    function confirmPayment(uint256 subscriptionId, uint256 billingCycle) external view returns (bool);

    function isChargeAllowed(uint256 subscriptionId) external view returns (bool);

    function isChargeAllowedMut(uint256 subscriptionId) external returns (bool);

    function cancel(uint256 subscriptionId) external;

    function getSubscription(uint256 subscriptionId) external view returns (Subscription memory);
}