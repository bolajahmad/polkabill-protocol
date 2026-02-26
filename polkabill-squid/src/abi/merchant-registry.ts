import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    MerchantCreated: event("0x27e4621d653f2188d51dcb21fc1d6c5b08a4127e53877d3c0a81b28ceb1ab15e", "MerchantCreated(address,bytes)", {"mId": indexed(p.address), "metadata": indexed(p.bytes)}),
    MerchantStatusUpdated: event("0x30a45c7f8d59b99f6da52c65ba25fd31c955b18e3955a95a10a3293cda42b701", "MerchantStatusUpdated(address,bool)", {"mId": indexed(p.address), "status": p.bool}),
    MerchantUpdated: event("0x1e0721ce5ad511fbe5fe9cf8f47e973c0d9aceafd914099246cd7378efe18da1", "MerchantUpdated(address,uint256,uint256,bytes)", {"mid": indexed(p.address), "_grace": p.uint256, "window": p.uint256, "metadata": p.bytes}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    PayoutAddressSet: event("0x054d84519acf7f691e1596de791426eff0674b07596b12c82234891d2c202698", "PayoutAddressSet(address,uint256,address,address)", {"mId": indexed(p.address), "chainId": indexed(p.uint256), "payoutAddr": p.address, "old": p.address}),
    TokensAdded: event("0xd5bf566134b25c6d34dd9ce13808f7fa809bbce13c96cb712ce0b0bfc7782eec", "TokensAdded(address,uint256,address[],bool)", {"mid": indexed(p.address), "cid": indexed(p.uint256), "tokens": p.array(p.address), "isAdding": p.bool}),
}

export const functions = {
    createMerchant: fun("0xc524f9f6", "createMerchant(address,uint256,uint256,bytes)", {"_owner": p.address, "_grace": p.uint256, "_window": p.uint256, "_meta": p.bytes}, p.address),
    getMerchant: viewFun("0xb2734eaf", "getMerchant(address)", {"_mid": p.address}, p.struct({"grace": p.uint256, "window": p.uint256, "active": p.bool, "metadata": p.bytes})),
    getPayoutAddress: viewFun("0x27b0d9dc", "getPayoutAddress(address,uint256)", {"_mid": p.address, "_cid": p.uint256}, p.address),
    isApprovedToken: viewFun("0xb3384074", "isApprovedToken(address,uint256,address)", {"_mid": p.address, "_cid": p.uint256, "_token": p.address}, p.bool),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    setMerchantStatus: fun("0x57ccb6a0", "setMerchantStatus(address,bool)", {"_mid": p.address, "active": p.bool}, ),
    setPayoutAddress: fun("0x47d9abdf", "setPayoutAddress(address,uint256,address)", {"_mid": p.address, "_cid": p.uint256, "_payout": p.address}, ),
    setSubscriptionManager: fun("0xc05b3585", "setSubscriptionManager(address)", {"_mgr": p.address}, ),
    subManager: viewFun("0x6632ba93", "subManager()", {}, p.address),
    subsController: viewFun("0x3830ae88", "subsController()", {}, p.address),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    updateAllowedToken: fun("0xddcbbc52", "updateAllowedToken(address,uint256,address[],bool)", {"_mid": p.address, "_cid": p.uint256, "_tokens": p.array(p.address), "_adding": p.bool}, ),
    updateController: fun("0x06cb5b66", "updateController(address)", {"_controller": p.address}, ),
    updateMerchantConfig: fun("0x876598d6", "updateMerchantConfig(address,uint256,uint256,bytes)", {"_mid": p.address, "_grace": p.uint256, "_window": p.uint256, "_metadata": p.bytes}, ),
}

export class Contract extends ContractBase {

    getMerchant(_mid: GetMerchantParams["_mid"]) {
        return this.eth_call(functions.getMerchant, {_mid})
    }

    getPayoutAddress(_mid: GetPayoutAddressParams["_mid"], _cid: GetPayoutAddressParams["_cid"]) {
        return this.eth_call(functions.getPayoutAddress, {_mid, _cid})
    }

    isApprovedToken(_mid: IsApprovedTokenParams["_mid"], _cid: IsApprovedTokenParams["_cid"], _token: IsApprovedTokenParams["_token"]) {
        return this.eth_call(functions.isApprovedToken, {_mid, _cid, _token})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    subManager() {
        return this.eth_call(functions.subManager, {})
    }

    subsController() {
        return this.eth_call(functions.subsController, {})
    }
}

/// Event types
export type MerchantCreatedEventArgs = EParams<typeof events.MerchantCreated>
export type MerchantStatusUpdatedEventArgs = EParams<typeof events.MerchantStatusUpdated>
export type MerchantUpdatedEventArgs = EParams<typeof events.MerchantUpdated>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type PayoutAddressSetEventArgs = EParams<typeof events.PayoutAddressSet>
export type TokensAddedEventArgs = EParams<typeof events.TokensAdded>

/// Function types
export type CreateMerchantParams = FunctionArguments<typeof functions.createMerchant>
export type CreateMerchantReturn = FunctionReturn<typeof functions.createMerchant>

export type GetMerchantParams = FunctionArguments<typeof functions.getMerchant>
export type GetMerchantReturn = FunctionReturn<typeof functions.getMerchant>

export type GetPayoutAddressParams = FunctionArguments<typeof functions.getPayoutAddress>
export type GetPayoutAddressReturn = FunctionReturn<typeof functions.getPayoutAddress>

export type IsApprovedTokenParams = FunctionArguments<typeof functions.isApprovedToken>
export type IsApprovedTokenReturn = FunctionReturn<typeof functions.isApprovedToken>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SetMerchantStatusParams = FunctionArguments<typeof functions.setMerchantStatus>
export type SetMerchantStatusReturn = FunctionReturn<typeof functions.setMerchantStatus>

export type SetPayoutAddressParams = FunctionArguments<typeof functions.setPayoutAddress>
export type SetPayoutAddressReturn = FunctionReturn<typeof functions.setPayoutAddress>

export type SetSubscriptionManagerParams = FunctionArguments<typeof functions.setSubscriptionManager>
export type SetSubscriptionManagerReturn = FunctionReturn<typeof functions.setSubscriptionManager>

export type SubManagerParams = FunctionArguments<typeof functions.subManager>
export type SubManagerReturn = FunctionReturn<typeof functions.subManager>

export type SubsControllerParams = FunctionArguments<typeof functions.subsController>
export type SubsControllerReturn = FunctionReturn<typeof functions.subsController>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UpdateAllowedTokenParams = FunctionArguments<typeof functions.updateAllowedToken>
export type UpdateAllowedTokenReturn = FunctionReturn<typeof functions.updateAllowedToken>

export type UpdateControllerParams = FunctionArguments<typeof functions.updateController>
export type UpdateControllerReturn = FunctionReturn<typeof functions.updateController>

export type UpdateMerchantConfigParams = FunctionArguments<typeof functions.updateMerchantConfig>
export type UpdateMerchantConfigReturn = FunctionReturn<typeof functions.updateMerchantConfig>

