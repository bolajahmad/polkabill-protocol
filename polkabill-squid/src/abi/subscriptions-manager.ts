import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    Subscribed: event("0xad24110dc4e3726555debcc81d3781cc9bc21a42b15c56fd9c90177a1a100717", "Subscribed(uint256,address,uint256)", {"subId": indexed(p.uint256), "subscriber": p.address, "planId": p.uint256}),
    SubscriptionPaid: event("0x2572c0255fd289aaf50c1075c785c9e1ca32a8f64089d6f4731ee19a10ce50b8", "SubscriptionPaid(uint256,uint256,uint256)", {"subscriptionId": indexed(p.uint256), "billingCycle": p.uint256, "_nextCharge": p.uint256}),
    SubscriptionUpdated: event("0x972d8f8ae817151e972c612542839791c113920309941c3028b87da58d6bb9b5", "SubscriptionUpdated(uint256,uint8,address)", {"subscriptionId": indexed(p.uint256), "status": p.uint8, "by": p.address}),
}

export const functions = {
    cancel: fun("0x40e58ee5", "cancel(uint256)", {"_subId": p.uint256}, ),
    confirmCharge: fun("0xd7666ac1", "confirmCharge(uint256,uint256)", {"_subId": p.uint256, "_cycle": p.uint256}, ),
    confirmPayment: viewFun("0x38358149", "confirmPayment(uint256,uint256)", {"_subId": p.uint256, "_cycle": p.uint256}, p.bool),
    getSubscription: viewFun("0xdc311dd3", "getSubscription(uint256)", {"_subId": p.uint256}, p.struct({"planId": p.uint256, "subscriber": p.address, "startTime": p.uint256, "nextChargeAt": p.uint256, "billingCycle": p.uint256, "status": p.uint8})),
    isChargeAllowed: viewFun("0x7710049c", "isChargeAllowed(uint256)", {"_subId": p.uint256}, p.bool),
    isChargeAllowedMut: fun("0x20d6a217", "isChargeAllowedMut(uint256)", {"_subId": p.uint256}, p.bool),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    subscribe: fun("0x0f574ba7", "subscribe(uint256)", {"_pId": p.uint256}, p.uint256),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
    updateController: fun("0x06cb5b66", "updateController(address)", {"_controller": p.address}, ),
    updateMerchantRegistry: fun("0x85625ac3", "updateMerchantRegistry(address)", {"_merchant": p.address}, ),
    updatePlanRegistry: fun("0x6ca88864", "updatePlanRegistry(address)", {"_plan": p.address}, ),
}

export class Contract extends ContractBase {

    confirmPayment(_subId: ConfirmPaymentParams["_subId"], _cycle: ConfirmPaymentParams["_cycle"]) {
        return this.eth_call(functions.confirmPayment, {_subId, _cycle})
    }

    getSubscription(_subId: GetSubscriptionParams["_subId"]) {
        return this.eth_call(functions.getSubscription, {_subId})
    }

    isChargeAllowed(_subId: IsChargeAllowedParams["_subId"]) {
        return this.eth_call(functions.isChargeAllowed, {_subId})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }
}

/// Event types
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type SubscribedEventArgs = EParams<typeof events.Subscribed>
export type SubscriptionPaidEventArgs = EParams<typeof events.SubscriptionPaid>
export type SubscriptionUpdatedEventArgs = EParams<typeof events.SubscriptionUpdated>

/// Function types
export type CancelParams = FunctionArguments<typeof functions.cancel>
export type CancelReturn = FunctionReturn<typeof functions.cancel>

export type ConfirmChargeParams = FunctionArguments<typeof functions.confirmCharge>
export type ConfirmChargeReturn = FunctionReturn<typeof functions.confirmCharge>

export type ConfirmPaymentParams = FunctionArguments<typeof functions.confirmPayment>
export type ConfirmPaymentReturn = FunctionReturn<typeof functions.confirmPayment>

export type GetSubscriptionParams = FunctionArguments<typeof functions.getSubscription>
export type GetSubscriptionReturn = FunctionReturn<typeof functions.getSubscription>

export type IsChargeAllowedParams = FunctionArguments<typeof functions.isChargeAllowed>
export type IsChargeAllowedReturn = FunctionReturn<typeof functions.isChargeAllowed>

export type IsChargeAllowedMutParams = FunctionArguments<typeof functions.isChargeAllowedMut>
export type IsChargeAllowedMutReturn = FunctionReturn<typeof functions.isChargeAllowedMut>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SubscribeParams = FunctionArguments<typeof functions.subscribe>
export type SubscribeReturn = FunctionReturn<typeof functions.subscribe>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

export type UpdateControllerParams = FunctionArguments<typeof functions.updateController>
export type UpdateControllerReturn = FunctionReturn<typeof functions.updateController>

export type UpdateMerchantRegistryParams = FunctionArguments<typeof functions.updateMerchantRegistry>
export type UpdateMerchantRegistryReturn = FunctionReturn<typeof functions.updateMerchantRegistry>

export type UpdatePlanRegistryParams = FunctionArguments<typeof functions.updatePlanRegistry>
export type UpdatePlanRegistryReturn = FunctionReturn<typeof functions.updatePlanRegistry>

