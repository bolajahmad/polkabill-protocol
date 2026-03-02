// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";

import "./interfaces/IChainRegistry.sol";

interface ISubscriptionsController {
    function relayTokenUpdate(
        uint256 _chain,
        address _adapter,
        bool _native,
        bytes memory _body
    ) external;
}

contract ChainRegistry is IChainRegistry, Ownable {
    mapping(uint256 => Adapter) adapters;
    mapping(uint256 => mapping(address => bool)) private tokenSupport;

    ISubscriptionsController private subsController;

    constructor(address _controller) Ownable(msg.sender) {
        subsController = ISubscriptionsController(_controller);
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
        // if (adapters[_cid].adapter != address(0)) {
        //     revert ChainExists();
        // }
        require(adapters[_cid].adapter == address(0), "CHAIN_EXISTS");

        adapters[_cid] = Adapter({adapter: _adapter, active: false});

        emit ChainRegistered(_cid, _adapter);
    }

    /**
     * Blocks future payment from succeeding
     *
     * @param _cid The chain ID
     * @param _active The new status to set
     */
    function setChainStatus(uint256 _cid, bool _active) external onlyOwner {
        if (adapters[_cid].adapter == address(0)) {
            revert UnregisteredChain();
        }

        adapters[_cid].active = _active;

        emit ChainStatusUpdated(_cid, _active);
    }

    function updateController(address _newController) external onlyOwner {
        subsController = ISubscriptionsController(_newController);
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
    ) external onlyOwner {
        if (adapters[_cid].adapter == address(0) || !adapters[_cid].active) {
            revert UnregisteredChain();
        }

        // check that token does not exist already
        // Only register Token, if it doesn't exist already
        tokenSupport[_cid][_token] = false;
        emit TokenSupportUpdated(_cid, _token, _support);
        bytes memory body = abi.encode(_cid, _token, _support);

        ISubscriptionsController(subsController).relayTokenUpdate(
            _cid,
            adapters[_cid].adapter,
            false,
            body
        );
    }

    function isChainSupported(uint256 _cid) external view returns (bool) {
        Adapter memory adapter = adapters[_cid];
        return adapter.adapter != address(0) && adapter.active;
    }

    function getBillingAdapter(uint256 _cid) external view returns (address) {
        return adapters[_cid].adapter;
    }

    function isValidAdapter(
        uint256 _cid,
        address _adapter
    ) external view returns (bool) {
        return adapters[_cid].adapter == _adapter && adapters[_cid].active;
    }

    function isTokenSupported(
        uint256 _cid,
        address _token
    ) external view returns (bool) {
        bool registered = tokenRegisteredToChain(_cid, _token);
        return registered;
    }

    function tokenRegisteredToChain(
        uint256 cid,
        address token
    ) internal view returns (bool) {
        return tokenSupport[cid][token];
    }
}
