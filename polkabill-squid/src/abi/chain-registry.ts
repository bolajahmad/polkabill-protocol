import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ChainRegistered: event("0x7f74812a5c28f04eea9007878d0e63eb304afe494a442babbe1b2875fbc1cfd6", "ChainRegistered(uint256,address)", {"chainId": indexed(p.uint256), "billingAdapter": indexed(p.address)}),
    ChainStatusUpdated: event("0x27ac1f8582df24c5a440380c6f532a5e3c80caf348beb3f6484f310f2c6bbd0b", "ChainStatusUpdated(uint256,bool)", {"chainId": indexed(p.uint256), "active": p.bool}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    TokenSupportUpdated: event("0x2cd0e2d9f28ea02c722dd6cf4d460b6c53daa27d12f26415f19c752e0b177905", "TokenSupportUpdated(uint256,address,bool)", {"chainId": indexed(p.uint256), "token": indexed(p.address), "supported": p.bool}),
}

export const functions = {
    approvedAdapterCodeHash: viewFun("0x2ba3da2f", "approvedAdapterCodeHash()", {}, p.bytes32),
    getBillingAdapter: viewFun("0x82ef7cf5", "getBillingAdapter(uint256)", {"_cid": p.uint256}, p.address),
    isChainSupported: viewFun("0x5221c1f0", "isChainSupported(uint256)", {"_cid": p.uint256}, p.bool),
    isTokenSupported: viewFun("0x75979f79", "isTokenSupported(uint256,address)", {"_cid": p.uint256, "_token": p.address}, p.bool),
    isValidAdapter: viewFun("0x20ef882c", "isValidAdapter(uint256,address)", {"_cid": p.uint256, "_adapter": p.address}, p.bool),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    registerChain: fun("0x7e25b5f8", "registerChain(uint256,address)", {"_cid": p.uint256, "_adapter": p.address}, ),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    setChainStatus: fun("0xfc46b8b0", "setChainStatus(uint256,bool)", {"_cid": p.uint256, "_active": p.bool}, ),
    setTokenSupport: fun("0x7a9a0025", "setTokenSupport(uint256,address,bool)", {"_cid": p.uint256, "_token": p.address, "_support": p.bool}, ),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    updateController: fun("0x06cb5b66", "updateController(address)", {"_newController": p.address}, ),
}

export class Contract extends ContractBase {

    approvedAdapterCodeHash() {
        return this.eth_call(functions.approvedAdapterCodeHash, {})
    }

    getBillingAdapter(_cid: GetBillingAdapterParams["_cid"]) {
        return this.eth_call(functions.getBillingAdapter, {_cid})
    }

    isChainSupported(_cid: IsChainSupportedParams["_cid"]) {
        return this.eth_call(functions.isChainSupported, {_cid})
    }

    isTokenSupported(_cid: IsTokenSupportedParams["_cid"], _token: IsTokenSupportedParams["_token"]) {
        return this.eth_call(functions.isTokenSupported, {_cid, _token})
    }

    isValidAdapter(_cid: IsValidAdapterParams["_cid"], _adapter: IsValidAdapterParams["_adapter"]) {
        return this.eth_call(functions.isValidAdapter, {_cid, _adapter})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }
}

/// Event types
export type ChainRegisteredEventArgs = EParams<typeof events.ChainRegistered>
export type ChainStatusUpdatedEventArgs = EParams<typeof events.ChainStatusUpdated>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type TokenSupportUpdatedEventArgs = EParams<typeof events.TokenSupportUpdated>

/// Function types
export type ApprovedAdapterCodeHashParams = FunctionArguments<typeof functions.approvedAdapterCodeHash>
export type ApprovedAdapterCodeHashReturn = FunctionReturn<typeof functions.approvedAdapterCodeHash>

export type GetBillingAdapterParams = FunctionArguments<typeof functions.getBillingAdapter>
export type GetBillingAdapterReturn = FunctionReturn<typeof functions.getBillingAdapter>

export type IsChainSupportedParams = FunctionArguments<typeof functions.isChainSupported>
export type IsChainSupportedReturn = FunctionReturn<typeof functions.isChainSupported>

export type IsTokenSupportedParams = FunctionArguments<typeof functions.isTokenSupported>
export type IsTokenSupportedReturn = FunctionReturn<typeof functions.isTokenSupported>

export type IsValidAdapterParams = FunctionArguments<typeof functions.isValidAdapter>
export type IsValidAdapterReturn = FunctionReturn<typeof functions.isValidAdapter>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type RegisterChainParams = FunctionArguments<typeof functions.registerChain>
export type RegisterChainReturn = FunctionReturn<typeof functions.registerChain>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SetChainStatusParams = FunctionArguments<typeof functions.setChainStatus>
export type SetChainStatusReturn = FunctionReturn<typeof functions.setChainStatus>

export type SetTokenSupportParams = FunctionArguments<typeof functions.setTokenSupport>
export type SetTokenSupportReturn = FunctionReturn<typeof functions.setTokenSupport>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UpdateControllerParams = FunctionArguments<typeof functions.updateController>
export type UpdateControllerReturn = FunctionReturn<typeof functions.updateController>

