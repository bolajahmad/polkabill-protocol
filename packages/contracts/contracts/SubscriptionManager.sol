// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import './interfaces/ISubscriptionManager.sol';
import {Plan, IPlanRegistry} from './interfaces/IPlanRegistry.sol';
import {Merchant, IMerchantRegistry} from './interfaces/IMerchantRegistry.sol';
import {IChainRegistry, UnregisteredChain} from './interfaces/IChainRegistry.sol';
import {Ownable} from '@openzeppelin/contracts/access/Ownable2Step.sol';

interface ISubscriptionsController {
    function relayChargeRequest(
        uint256 _chain,
        address _adapter,
        bytes memory _body,
        bool _native
    ) external;
}

contract SubscriptionManager is ISubscriptionManager, Ownable {
    IMerchantRegistry private merchantReg;
    IPlanRegistry private planReg;
    ISubscriptionsController private controller;
    IChainRegistry private chainReg;

    uint256 public nextSubId;
    mapping(uint256 => Subscription) private subscriptions;
    mapping(address => mapping(address => uint256)) private userSubsByMerchant;

    modifier onlyController() {
        require(msg.sender == address(controller), 'NOT_CONTROLLER');
        _;
    }

    constructor(address _chain) Ownable(msg.sender) {
        chainReg = IChainRegistry(_chain);
        nextSubId = 1;
    }

    /**
     * Subscribes a User to a plan ID.
     * Checks that allowance has been approved
     * Merchant must be active
     *
     * Must ensure User is not registered to the same merchant' plan
     *
     * @param _pId The plan ID to subscribe to
     */
    function subscribe(uint256 _pId) external returns (uint256 _nextSubId) {
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

        uint256 existing = userSubsByMerchant[msg.sender][plan.merchantId];
        if (existing != 0) {
            Subscription storage oldSub = subscriptions[existing];
            if (oldSub.status == Status.ACTIVE || oldSub.status == Status.DUE) {
                oldSub.pendingPlan = _pId;
                emit PlanChangeScheduled(existing, _pId, oldSub.planId, oldSub.nextChargeAt);

                _nextSubId = existing;
            }
        } else {
            _nextSubId = nextSubId;
            // compose the Subscription
            subscriptions[_nextSubId] = Subscription({
                planId: _pId,
                pendingPlan: 0,
                subscriber: msg.sender,
                startTime: block.timestamp,
                nextChargeAt: block.timestamp + plan.interval,
                billingCycle: 1,
                status: Status.ACTIVE
            });
            userSubsByMerchant[msg.sender][plan.merchantId] = _nextSubId;
            nextSubId += 1;

            emit Subscribed(_nextSubId, msg.sender, _pId);
        }
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
    function confirmPayment(uint256 _subId, uint256 _cycle) external view returns (bool _paid) {
        Subscription memory sub = subscriptions[_subId];
        if (sub.planId == 0 || sub.status == Status.NULL || sub.billingCycle == 0) {
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
    function isChargeAllowed(uint256 _subId) public view returns (bool) {
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
    function isChargeAllowedMut(uint256 _subId) internal returns (bool) {
        Subscription storage sub = subscriptions[_subId];
        if (sub.planId == 0 || sub.status == Status.NULL || sub.subscriber == address(0)) {
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

        emit SubscriptionUpdated(_subId, sub.status, msg.sender);

        uint256 window = sub.nextChargeAt > merchant.window
            ? sub.nextChargeAt - merchant.window
            : 0;

        if (block.timestamp >= window && block.timestamp <= sub.nextChargeAt + grace) {
            return true;
        } else {
            return false;
        }
    }

    function requestCharge(uint256 _subId, uint256 _cid, address _token) external {
        // Ensure the Chain ID is supported
        if (!chainReg.isChainSupported(_cid)) {
            revert UnregisteredChain();
        }
        address adapter = chainReg.getBillingAdapter(_cid);
        require(adapter != address(0), 'NO_ADAPTER_FOR_CHAIN');

        if (!chainReg.isTokenSupported(_cid, _token)) {
            revert UnregisteredChain();
        }
        Subscription storage sub = subscriptions[_subId];

        require(isChargeAllowedMut(_subId), 'CHARGE_NOT_ALLOWED');
        require(sub.status != Status.CANCELLED, 'CANCELLED');

        Plan memory plan = planReg.getPlan(sub.pendingPlan > 0 ? sub.pendingPlan : sub.planId);
        address payout = merchantReg.getPayoutAddress(plan.merchantId, _cid);

        // Compile the crosschain message
        bytes memory body = abi.encode(
            _subId,
            plan.price,
            sub.subscriber,
            _token,
            sub.billingCycle,
            payout
        );
        // Ensure merchant is registered on the chain
        controller.relayChargeRequest(_cid, adapter, body, false);
    }

    function confirmCharge(uint256 _subId, uint256 _cycle) external onlyController {
        // Ensure Subscription exists
        Subscription storage sub = subscriptions[_subId];
        if (sub.billingCycle == 0 || sub.planId == 0) {
            revert SubscriptionCancelled();
        }
        if (sub.status == Status.CANCELLED) {
            revert SubscriptionCancelled();
        }
        require(sub.billingCycle == _cycle, 'INVALID_BILLING_CYCLE');

        Plan memory plan = planReg.getPlan(sub.planId);

        // Move the billing cycle forward
        sub.billingCycle += 1;
        sub.nextChargeAt += plan.interval;
        sub.status = Status.ACTIVE;

        emit SubscriptionPaid(_subId, sub.billingCycle, sub.nextChargeAt);

        if (sub.pendingPlan != 0) {
            uint256 oldPlan = sub.planId;

            sub.planId = sub.pendingPlan;
            sub.pendingPlan = 0;
            emit PlanChanged(_subId, oldPlan, sub.planId);
        }
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
            Plan memory plan = planReg.getPlan(sub.planId);

            sub.status = Status.CANCELLED;
            sub.pendingPlan = 0;

            delete userSubsByMerchant[msg.sender][plan.merchantId];
            emit SubscriptionUpdated(_subId, Status.CANCELLED, msg.sender);
        } else {
            revert NotSubscriber();
        }
    }

    function getSubscription(uint256 _subId) external view returns (Subscription memory) {
        Subscription memory sub = subscriptions[_subId];
        if (sub.planId == 0 || sub.status == Status.NULL || sub.billingCycle == 0) {
            revert SubscriptionMissing();
        }

        return sub;
    }

    function updateController(address _controller) external onlyOwner {
        controller = ISubscriptionsController(_controller);
    }

    /**
     *
     * @param _merchant Ideally, no reasons to ever update this
     */
    function updateMerchantRegistry(address _merchant) external onlyOwner {
        merchantReg = IMerchantRegistry(_merchant);
    }

    /**
     *
     * @param _plan Ideally, no reasons to ever update this
     */
    function updatePlanRegistry(address _plan) external onlyOwner {
        planReg = IPlanRegistry(_plan);
    }
}
