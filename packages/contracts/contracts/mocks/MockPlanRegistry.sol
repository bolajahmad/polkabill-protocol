// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Plan} from "../interfaces/IPlanRegistry.sol";

contract MockPlanRegistry {
    mapping(uint256 => Plan) public plans;
    uint256 public nextPlanId;

    constructor() {
        nextPlanId = 1;
    }

    function createPlan(uint256 _price, uint256 _interval, uint256 _grace, bytes calldata _metadata) external returns (uint256 _pid) {
        _pid = nextPlanId;
        plans[_pid] = Plan({
            merchantId: msg.sender,
            price: _price,
            interval: _interval,
            grace: _grace,
            metadata: keccak256(_metadata),
            active: true
        });
        nextPlanId++;
    }

    function getPlan(uint256 id) external view returns (Plan memory) {
        return plans[id];
    }
}