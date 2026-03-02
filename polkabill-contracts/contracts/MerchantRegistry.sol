// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "./interfaces/IMerchantRegistry.sol";
import {ISubscriptionManager} from "./interfaces/ISubscriptionManager.sol";
import {IChainRegistry, UnregisteredChain} from "./interfaces/IChainRegistry.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable2Step.sol";

interface ISubscriptionsController {
    function relayMerchantProfileUpdate(
        uint256 _chain,
        address _adapter,
        bytes memory _body
    ) external;
}

contract MerchantRegistry is IMerchantRegistry, Ownable {
    IChainRegistry private immutable chainReg;
    mapping(address => Merchant) private merchants;
    mapping(bytes32 => address) private payoutAddresses;
    // Encodes the (mid, cid, token) => bool
    mapping(bytes32 => bool) private tokenAllowed;

    ISubscriptionsController public subsController;
    ISubscriptionManager public subManager;

    modifier onlyUniqueMerchants() {
        if (merchants[msg.sender].active && merchants[msg.sender].window > 0) {
            revert MerchantNotUnique();
        }
        _;
    }
    modifier onlySubscriptionManager() {
        if (msg.sender != address(subManager)) {
            revert Unauthorized();
        }
        _;
    }

    constructor(
        address _chain,
        address _mgr,
        address _controller
    ) Ownable(msg.sender) {
        chainReg = IChainRegistry(_chain);
        subManager = ISubscriptionManager(_mgr);
        subsController = ISubscriptionsController(_controller);
    }

    function createMerchant(
        uint256 _grace,
        uint256 _window,
        bytes calldata _meta
    ) external onlyUniqueMerchants() returns (address mId) {
        merchants[msg.sender] = Merchant({
            grace: _grace,
            window: _window,
            active: true,
            metadata: _meta
        });

        emit MerchantCreated(msg.sender, _meta);
        mId = msg.sender;
        emit MerchantUpdated(msg.sender, _grace, _window, _meta);
    }

    function updateMerchantConfig(
        address _mid,
        uint256 _grace,
        uint256 _window,
        bytes calldata _metadata
    ) external {
        if (msg.sender != _mid) {
            revert Unauthorized();
        }
        Merchant memory merchant = merchants[_mid];

        // Merchant must exist with the ID
        if (!merchant.active || merchant.window == 0) {
            revert MissingMerchant();
        }

        merchants[_mid] = Merchant({
            grace: _grace,
            window: _window == 0 || _window == merchant.window
                ? merchant.window
                : _window,
            active: merchant.active,
            metadata: _metadata
        });

        emit MerchantUpdated(
            _mid,
            _grace,
            _window == 0 || _window == merchant.window
                ? merchant.window
                : _window,
            _metadata
        );
    }

    function setMerchantStatus(address _mid, bool active) external {
        if (msg.sender != _mid) {
            revert Unauthorized();
        }
        Merchant storage merchant = merchants[_mid];

        // Merchant must exist with the ID
        if (merchant.window == 0) {
            revert MissingMerchant();
        }

        merchant.active = active;

        emit MerchantStatusUpdated(_mid, active);
    }

    /**
     * Updates the Merchant's payout address
     * Ideally, will send a cross-chain message to notify BillingAdapter
     *
     * This will update the payout address, if it exists
     * Subsequent charges will deal with the new _payout
     *
     * There may be a couple minutes delay (due to cross-chain messaging)
     * Charges happen on the BillingAdapter, so a cross-chain message is needed to notify
     *
     * @param _mid The merchant address
     * @param _cid The chain ID where payout is configured
     * @param _payout The address to pay to
     */
    function setPayoutAddress(
        address _mid,
        uint256 _cid,
        address _payout
    ) external {
        if (msg.sender != _mid) {
            revert Unauthorized();
        }
        // Ensure Merchant exists and is the caller of this
        Merchant memory merchant = merchants[_mid];
        if (!merchant.active || merchant.window == 0) {
            revert MissingMerchant();
        }

        // Ensure the chain is registered
        bool supported = chainReg.isChainSupported(_cid);
        if (!supported) {
            revert UnregisteredChain();
        }

        bytes32 route = keccak256(abi.encode(_mid, _cid));
        address oldAddr = payoutAddresses[route];
        payoutAddresses[route] = _payout;

        emit PayoutAddressSet(_mid, _cid, _payout, oldAddr);

        // Dispatch cross chain message
        bytes memory body = abi.encode(
            _mid,
            _cid,
            new address[](0),
            true,
            _payout
        );
        address adapter = chainReg.getBillingAdapter(_cid);
        ISubscriptionsController(subsController).relayMerchantProfileUpdate(
            _cid,
            adapter,
            body
        );
    }

    function updateAllowedToken(
        address _mid,
        uint256 _cid,
        address[] memory _tokens,
        bool _adding
    ) external {
        if (msg.sender != _mid) {
            revert Unauthorized();
        }
        Merchant storage merchant = merchants[_mid];
        if (!merchant.active || merchant.window == 0) {
            revert MissingMerchant();
        }

        require(_tokens.length > 0, "No tokens submitted!");
        for (uint i = 0; i < _tokens.length; i++) {
            // Ensure token is not already approved
            // Revert if token contains zeroAddress
            // Ensure token is supported on chain registry
            bool chainsupported = chainReg.isChainSupported(_cid);
            if (_tokens[i] == address(0) || !chainsupported) {
                revert UnsupportedChain();
            }
            bool supported = chainReg.isTokenSupported(_cid, _tokens[i]);
            if (_tokens[i] == address(0) || !supported) {
                revert UnsupportedToken();
            }

            bytes32 route = keccak256(abi.encode(_mid, _cid, _tokens[i]));
            tokenAllowed[route] = _adding ? true : false;
        }
        bytes32 payoutroute = keccak256(abi.encode(_mid, _cid));
        bytes memory body = abi.encode(
            _mid,
            _cid,
            _tokens,
            _adding,
            payoutAddresses[payoutroute]
        );
        address adapter = chainReg.getBillingAdapter(_cid);
        ISubscriptionsController(subsController).relayMerchantProfileUpdate(
            _cid,
            adapter,
            body
        );
        emit TokensAdded(_mid, _cid, _tokens, _adding);
    }

    function updateController(address _controller) external onlyOwner {
        subsController = ISubscriptionsController(_controller);
    }

    function getMerchant(address _mid) external view returns (Merchant memory) {
        return merchants[_mid];
    }

    function getPayoutAddress(
        address _mid,
        uint256 _cid
    ) external view returns (address) {
        bytes32 route = keccak256(abi.encode(_mid, _cid));

        return payoutAddresses[route];
    }

    function isApprovedToken(
        address _mid,
        uint256 _cid,
        address _token
    ) external view returns (bool) {
        Merchant memory merchant = merchants[_mid];
        if (!merchant.active || merchant.window == 0) {
            revert MissingMerchant();
        }

        // Compose the route
        bytes32 route = keccak256(abi.encode(_mid, _cid, _token));
        return tokenAllowed[route];
    }

    function setSubscriptionManager(address _mgr) external onlyOwner {
        subManager = ISubscriptionManager(_mgr);
    }
}
