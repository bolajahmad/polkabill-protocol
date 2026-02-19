// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./interfaces/IPlanRegistry.sol";
import {IMerchantRegistry, Merchant, MissingMerchant, Unauthorized} from "./interfaces/IMerchantRegistry.sol";

contract PlanRegistry is IPlanRegistry {
    uint256 public nextPlanId;
    mapping(uint256 => Plan) private plans;
    IMerchantRegistry public merchantReg;

    constructor(address _merchant) {
        nextPlanId = 1;
        merchantReg = IMerchantRegistry(_merchant);
    }

    /**
     * Creates a new plan for a Merchant. Only a registered Merchant can call.
     *
     * Merchant must exist
     * 
     * @param _price The price of the Plan
     * @param _interval How long the plan lasts before new subscription
     * @param _grace A grace period after Plan due date
     * @param _metadata Off-chain details about the Plan
     */
    function createPlan(uint256 _price, uint256 _interval, uint256 _grace, bytes calldata _metadata) external returns (uint256 _pid) {
        // Ensure msg.sender is a registered (and active merchant)
        Merchant memory merchant = merchantReg.getMerchant(msg.sender);
        if (merchant.window == 0 || !merchant.active) {
            revert MissingMerchant();
        }

        if (_price == 0 || _interval <= merchant.window) {
            revert InvalidPlanParameter();
        }

        _pid = nextPlanId;
        plans[_pid] = Plan({
            merchantId: msg.sender,
            price: _price,
            interval: _interval,
            grace: _grace,
            active: true,
            metadata: _metadata
        });

        nextPlanId += 1;
        emit PlanCreated(_pid, msg.sender, _price);
    }

    function updatePlan(uint256 _pid, uint256 _price, uint256 _grace) external {
        Plan storage plan = plans[_pid];
        if (msg.sender != plan.merchantId) {
            revert Unauthorized();
        }

        plan.price = _price == 0 ? plan.price : _price;
        plan.grace = _grace;
        plans[_pid] = plan;

        emit PlanUpdated(_pid, _price, _grace, plan.active);
    }

    function setPlanStatus(uint256 _pid, bool _active) external {
        Plan storage plan = plans[_pid];
        if (msg.sender != plan.merchantId) {
            revert Unauthorized();
        }

        plan.active = _active;
        plans[_pid] = plan;

        emit PlanUpdated(_pid, plan.price, plan.grace, _active);
    }

    function getPlan(uint256 _pid) external view returns (Plan memory) {
        return plans[_pid];
    }
}