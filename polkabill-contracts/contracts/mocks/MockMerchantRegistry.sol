// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Merchant} from "../interfaces/IMerchantRegistry.sol";

contract MockMerchantRegistry {
    mapping(address => Merchant) public merchants;

    function createMerchant(
        address _owner,
        uint256 _grace,
        uint256 _window,
        bytes calldata _meta
    ) external returns (address mId) {
        merchants[_owner] = Merchant({
            grace: _grace,
            window: _window,
            active: true,
            metadata: _meta
        });

        return _owner;
    }

    function getMerchant(address _mid) external view returns (Merchant memory) {
        return merchants[_mid];
    }
}
