// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.17;

/**
 * The Plan registry represents the source of truth for Subscription plans
 * This contract takes care of information related to the Subscrptions
 */

struct Plan {
    uint256 merchantId; // The ID of the merchant that owns the plan
    uint256 price;  // The price of the plan to charge
    uint256 interval;   // The duration of the plan
    uint32[] chainId; // The allowed chains where payments execute
    address[] token;  // The allowed tokens per chain
    uint256 grace;  // The grace period of the plan (always overrides unless == 0)
    bool active;
    bytes metadata;
}

event PlanCreated(uint256 indexed planId, uint256 indexed merchantId);
event PlanUpdated(uint256 indexed planId, bool active);

interface IPlanRegistry {
    function createPlan(uint256 mId, uint256 price, uint256 interval, uint32 chainId, address token, uint256 grace, bytes calldata metadata) external returns (uint256 planId);

    function updatePlan(uint256 planId, uint256 price, uint256 interval, uint256 grace) external;

    function setPlanStatus(uint256 planId, bool active) external;

    function getPlan(uint256 planId) external view returns (Plan memory);

    function nextPlanId() external view returns (uint256 planId);
}