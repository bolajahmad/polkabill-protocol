// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./interfaces/ISubscriptionManager.sol";
import {Plan, IPlanRegistry} from "./interfaces/IPlanRegistry.sol";
import {Merchant, IMerchantRegistry} from "./interfaces/IMerchantRegistry.sol";

contract SubscriptionManager is ISubscriptionManager {
    IMerchantRegistry private merchantReg;
    IPlanRegistry private planReg;
    uint256 private nextSubId;
    mapping(uint256 => Subscription) private subscriptions;

    constructor(address _merchant, address _planReg) {
        merchantReg = IMerchantRegistry(_merchant);
        planReg = IPlanRegistry(_planReg);
        nextSubId = 1;
    }

    /**
     * Subscribes a User to a plan ID.
     * Checks that allowance has been approved
     * Merchant must be active
     *
     * @param _pId The plan ID to subscribe to
     */
    function subscribe(
        uint256 _pId,
        uint256 _start
    ) external returns (uint256 _nextSubId) {
        // Check that the plan exists
        Plan memory plan = planReg.getPlan(_pId);
        if (!plan.active) {
            revert PlanNotActive();
        }

        // Merchant must exist too
        Merchant memory merchant = merchantReg.getMerchant(plan.merchantId);
        if (!merchant.active) {
            revert MerchantNotActive();
        }

        _nextSubId = nextSubId;
        // compose the Subscription
        subscriptions[_nextSubId] = Subscription({
            planId: _pId,
            subscriber: msg.sender,
            startTime: _start,
            nextChargeAt: _start + plan.interval,
            billingCycle: 1,
            status: Status.ACTIVE
        });
        nextSubId += 1;

        emit Subscribed(_nextSubId, msg.sender, _pId);
    }

    /**
     * Two approaches exist to this
     *
     * It is enough to check that the billing cycle is less that the current billing cycle.
     * When a payment is completed, that is when the billing cycle increases
     *
     * @param _subId The Id of the sub
     * @param _cycle The billing cycle to check
     *
     * @return _paid Whether the payment has happened
     */
    function confirmPayment(
        uint256 _subId,
        uint256 _cycle
    ) external view returns (bool _paid) {
        Subscription memory sub = subscriptions[_subId];
        if (
            sub.planId == 0 ||
            sub.status == Status.NULL ||
            sub.billingCycle == 0
        ) {
            revert SubscriptionMissing();
        }

        _paid = sub.billingCycle > _cycle;
    }

    /**
     * Charge is allowed if the Subscription exists,
     * If the subscription is within the window (+ grace)
     *
     * @param _subId The subscription ID
     */
    function isChargeAllowed(uint256 _subId) external view returns (bool) {
        Subscription memory sub = subscriptions[_subId];
        Plan memory plan = planReg.getPlan(sub.planId);
        Merchant memory merchant = merchantReg.getMerchant(plan.merchantId);

        uint256 grace = plan.grace > 0 ? plan.grace : merchant.grace;
        if (
            block.timestamp >= sub.nextChargeAt - merchant.window &&
            block.timestamp <= sub.nextChargeAt + grace
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Charge is allowed if the Subscription exists,
     * If the subscription is within the window (+ grace)
     *
     * @param _subId The subscription ID
     */
    function isChargeAllowedMut(uint256 _subId) external returns (bool) {
        Subscription memory sub = subscriptions[_subId];
        if (
            sub.planId == 0 ||
            sub.status == Status.NULL ||
            sub.subscriber == address(0)
        ) {
            revert SubscriptionMissing();
        }

        if (sub.status == Status.CANCELLED) {
            revert SubscriptionCancelled();
        }

        Plan memory plan = planReg.getPlan(sub.planId);
        if (!plan.active) {
            revert PlanNotActive();
        }
        Merchant memory merchant = merchantReg.getMerchant(plan.merchantId);
        if (!merchant.active) {
            revert MerchantNotActive();
        }

        uint256 grace = plan.grace > 0 ? plan.grace : merchant.grace;

        if (block.timestamp > sub.nextChargeAt + grace) {
            sub.status = Status.CANCELLED;
        } else if (block.timestamp >= sub.nextChargeAt) {
            sub.status = Status.DUE;
        }
        subscriptions[_subId] = sub;

        emit SubscriptionUpdated(_subId, sub.status, msg.sender);

        uint256 window = sub.nextChargeAt > merchant.window
            ? sub.nextChargeAt - merchant.window
            : 0;

        if (
            block.timestamp >= window &&
            block.timestamp <= sub.nextChargeAt + grace
        ) {
            return true;
        } else {
            return false;
        }
    }

    function markSubscriptionPaid(uint256 _subId) external {
        // Ensure Subscription exists
        Subscription memory sub = subscriptions[_subId];
        if (sub.billingCycle == 0 || sub.planId == 0) {
            revert SubscriptionCancelled();
        }
        if (sub.status == Status.CANCELLED) {
            revert SubscriptionCancelled();
        }

        Plan memory plan = planReg.getPlan(sub.planId);

        // Move the billing cycle forward
        sub.billingCycle += 1;
        sub.nextChargeAt += plan.interval;
        sub.status = Status.ACTIVE;

        subscriptions[_subId] = sub;
        emit SubscriptionPaid(_subId, sub.billingCycle, sub.nextChargeAt);
    }

    /**
     * A `User` can cancel subscription.
     * msg.sender must equal sub.subscriber
     *
     * @param _subId Subscription ID
     */
    function cancel(uint256 _subId) external {
        Subscription storage sub = subscriptions[_subId];
        if (msg.sender == sub.subscriber) {
            delete subscriptions[_subId];
        } else {
            revert NotSubscriber();
        }

        emit SubscriptionUpdated(_subId, Status.CANCELLED, msg.sender);
    }

    function getSubscription(
        uint256 _subId
    ) external view returns (Subscription memory) {
        Subscription memory sub = subscriptions[_subId];
        if (
            sub.planId == 0 ||
            sub.status == Status.NULL ||
            sub.billingCycle == 0
        ) {
            revert SubscriptionMissing();
        }

        return sub;
    }
}
