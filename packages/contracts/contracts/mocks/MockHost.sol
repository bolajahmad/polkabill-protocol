// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Minimal mock Hyperbridge host that returns a zero bytes32 for any call
contract MockHost {
    fallback() external payable {
        assembly {
            mstore(0, 0)
            return(0, 32)
        }
    }
}
