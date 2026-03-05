import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    PlanCreated: event("0x3790d2272c31cdfa0b95d812fb5a44dc21f1d3eaf0cce707acb5c92fed34e4c0", "PlanCreated(uint256,address,uint256,bytes)", {"planId": indexed(p.uint256), "merchantId": indexed(p.address), "price": p.uint256, "metadata": p.bytes}),
    PlanUpdated: event("0x7b0ef22373aefc96be3b02eb3e299426f268fcba0993f2e87879f13c733ce8a4", "PlanUpdated(uint256,uint256,uint256,bool)", {"planId": indexed(p.uint256), "price": p.uint256, "grace": p.uint256, "active": p.bool}),
}

export const functions = {
    createPlan: fun("0x63d83e25", "createPlan(uint256,uint256,uint256,bytes)", {"_price": p.uint256, "_interval": p.uint256, "_grace": p.uint256, "_metadata": p.bytes}, p.uint256),
    getPlan: viewFun("0x26cd5274", "getPlan(uint256)", {"_pid": p.uint256}, p.struct({"merchantId": p.address, "price": p.uint256, "interval": p.uint256, "grace": p.uint256, "active": p.bool, "metadata": p.bytes32})),
    merchantReg: viewFun("0x86a70147", "merchantReg()", {}, p.address),
    nextPlanId: viewFun("0x5f8d26b2", "nextPlanId()", {}, p.uint256),
    setPlanStatus: fun("0xfd649f9e", "setPlanStatus(uint256,bool)", {"_pid": p.uint256, "_active": p.bool}, ),
    updatePlan: fun("0x568970d2", "updatePlan(uint256,uint256,uint256)", {"_pid": p.uint256, "_price": p.uint256, "_grace": p.uint256}, ),
}

export class Contract extends ContractBase {

    getPlan(_pid: GetPlanParams["_pid"]) {
        return this.eth_call(functions.getPlan, {_pid})
    }

    merchantReg() {
        return this.eth_call(functions.merchantReg, {})
    }

    nextPlanId() {
        return this.eth_call(functions.nextPlanId, {})
    }
}

/// Event types
export type PlanCreatedEventArgs = EParams<typeof events.PlanCreated>
export type PlanUpdatedEventArgs = EParams<typeof events.PlanUpdated>

/// Function types
export type CreatePlanParams = FunctionArguments<typeof functions.createPlan>
export type CreatePlanReturn = FunctionReturn<typeof functions.createPlan>

export type GetPlanParams = FunctionArguments<typeof functions.getPlan>
export type GetPlanReturn = FunctionReturn<typeof functions.getPlan>

export type MerchantRegParams = FunctionArguments<typeof functions.merchantReg>
export type MerchantRegReturn = FunctionReturn<typeof functions.merchantReg>

export type NextPlanIdParams = FunctionArguments<typeof functions.nextPlanId>
export type NextPlanIdReturn = FunctionReturn<typeof functions.nextPlanId>

export type SetPlanStatusParams = FunctionArguments<typeof functions.setPlanStatus>
export type SetPlanStatusReturn = FunctionReturn<typeof functions.setPlanStatus>

export type UpdatePlanParams = FunctionArguments<typeof functions.updatePlan>
export type UpdatePlanReturn = FunctionReturn<typeof functions.updatePlan>

