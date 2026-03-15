// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

/**
 * The Plan registry represents the source of truth for Subscription plans
 * This contract takes care of information related to the Subscrptions
 */

struct Plan {
    address merchantId; // The ID of the merchant that owns the plan
    uint256 price;  // The price of the plan to charge
    uint256 interval;   // The duration of the plan
    uint256 grace;  // The grace period of the plan (always overrides unless == 0)
    bool active;
    bytes32 metadata;
}

event PlanCreated(uint256 indexed planId, address indexed merchantId, uint256 price, bytes metadata);
event PlanUpdated(uint256 indexed planId, uint256 price, uint256 grace, bool active);

error InvalidPlanParameter();

interface IPlanRegistry {
    function createPlan(uint256 price, uint256 interval, uint256 grace, bytes calldata metadata) external returns (uint256 planId);

    function updatePlan(uint256 planId, uint256 price, uint256 grace) external;

    function setPlanStatus(uint256 planId, bool active) external;

    function getPlan(uint256 planId) external view returns (Plan memory);

    function nextPlanId() external view returns (uint256 planId);
}