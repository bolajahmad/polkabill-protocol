// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";

import "./interfaces/IChainRegistry.sol";

contract ChainRegistry is IChainRegistry, Ownable {
    mapping(uint256 => Adapter) adapters;

    bytes32 private immutable adapterCodeHash;

    constructor(bytes32 _hash) Ownable(msg.sender) {
        adapterCodeHash = _hash;
    }

    /**
     * This registers a new chain.
     * There must be a dedicated BillingAdapter existing on chainID
     * Enforces that the codehash equals the saved codeHash.
     *
     * Chain must not be registered prior.
     *
     * The Adapter is setup, but with no tokens (will be inactive)
     *
     * @param _cid The chain ID to add
     * @param _adapter The deployed BillingAdapter on the chain
     */
    function registerChain(uint256 _cid, address _adapter) external onlyOwner {
        if (adapters[_cid].adapter != address(0)) {
            revert ChainExists();
        }
        if (keccak256(_adapter.code) != adapterCodeHash) {
            revert InvalidAdapterCode();
        }

        adapters[_cid] = Adapter({
            adapter: _adapter,
            active: false,
            tokens: new address[](0)
        });

        emit ChainRegistered(_cid, _adapter);
    }

    /**
     * Blocks future payment from succeeding
     *
     * @param _cid The chain ID
     * @param _active The new status to set
     */
    function setChainStatus(uint256 _cid, bool _active) external {
        if (adapters[_cid].adapter == address(0)) {
            revert UnregisteredChain();
        }

        adapters[_cid].active = _active;

        emit ChainStatusUpdated(_cid, _active);
    }

    /**
     * Updates support for a token on a chain's adapter
     * 
     * If token does not exist, 
     *  If _support == true (add it to the chain)
     * If token does exist already,
     *  If _support == true (leave it on chain)
     *  If _support == false (remove it from chain)
     * 
     * @param _cid The chain ID to add token to
     * @param _cid The address of the token to add
     * @param _support Boolean to express real intention
     */
    function setTokenSupport(
        uint256 _cid,
        address _token,
        bool _support
    ) external {
        Adapter storage adapter = adapters[_cid];
        if (adapters[_cid].adapter == address(0)) {
            revert UnregisteredChain();
        }

        // check that token does not exist already
        // Only register Token, if it doesn't exist already
        (bool registered, uint256 index) = tokenRegisteredToChain(adapter, _token);
        if (registered) {
            if (!_support) {
                address[] storage tokens = adapters[_cid].tokens;
                tokens[index] = tokens[tokens.length - 1];
                tokens.pop();

                adapters[_cid].tokens = tokens;

                emit TokenSupportUpdated(_cid, _token, _support);
            }
        } else {
            if (_support) {
                adapters[_cid].tokens.push(_token);
                emit TokenSupportUpdated(_cid, _token, _support);
            }
        }
    }

    function isChainSupported(uint256 _cid) external view returns (bool) {
        Adapter memory adapter = adapters[_cid];
        if (adapter.adapter == address(0) || !adapter.active || adapter.tokens.length == 0) {
            return false;
        } else {
            return true;
        }
    }

    function getBillingAdapter(uint256 _cid) external view returns (address) {
        return adapters[_cid].adapter;
    }

    function isTokenSupported(uint256 _cid, address _token) external view returns (bool) {
        (bool registered,) = tokenRegisteredToChain(adapters[_cid], _token);
        return registered;
    }

    function approvedAdapterCodeHash() external view returns (bytes32) {
        return adapterCodeHash;
    }

    function tokenRegisteredToChain(
        Adapter memory adapterStruct,
        address token
    ) internal pure returns (bool, uint256) {
        for (uint i = 0; i < adapterStruct.tokens.length; i++) {
            if (adapterStruct.tokens[i] == token) {
                return (true, i);
            }
        }
        return (false, 0);
    }
}
