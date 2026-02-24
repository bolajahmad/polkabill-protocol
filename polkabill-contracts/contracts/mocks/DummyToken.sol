// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockMnee
 * @notice Mock real MNEE token for testing purposes
 */
contract DummyERC20 is ERC20, Ownable {
    uint256 private constant TOTAL_SUPPLY = 1_000_000 * 10 ** 18;
    uint8 private _decimals;

    constructor(string memory name, string memory symbol, uint8 decimals_) ERC20(name, symbol) Ownable(msg.sender) {
        _decimals = decimals_;
        _mint(msg.sender, TOTAL_SUPPLY);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}