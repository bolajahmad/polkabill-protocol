import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ChargeConfirmed: event("0x730ba1c6e9396a2128096f6029e773993afc67769f0cf2390c8d0e80b03eba3f", "ChargeConfirmed(uint256,uint256,uint256,uint256)", {"chainId": indexed(p.uint256), "subId": indexed(p.uint256), "cycle": p.uint256, "nonce": p.uint256}),
    ChargeRequested: event("0x0d2d06d1d38de9fc3bebc7cd6e8e79bb254178f26f9b9797ed27851163c10799", "ChargeRequested(uint256,uint256,uint256,bytes)", {"chainId": indexed(p.uint256), "subId": indexed(p.uint256), "cycle": p.uint256, "data": p.bytes}),
    EIP712DomainChanged: event("0x0a6387c9ea3628b88a633bb4f3b151770f70085117a15f9bf3787cda53f13d31", "EIP712DomainChanged()", {}),
    MerchantUpdateRequested: event("0x6c869ab36d2081c3640b4d85906803ee68e6fe5347fcefef5018e063be558c39", "MerchantUpdateRequested(uint256,address,address,address,uint256)", {"chainId": indexed(p.uint256), "adapter": indexed(p.address), "merchant": p.address, "payout": p.address, "nonce": p.uint256}),
    TokenUpdateRequested: event("0xafc8ad95533e5dac5ecf0a63c857687ac853a25bb48be3ae83467a3dfabdcf3e", "TokenUpdateRequested(uint256,address,address,bool,uint256)", {"chainId": indexed(p.uint256), "adapter": indexed(p.address), "token": p.address, "allowed": p.bool, "nonce": p.uint256}),
}

export const functions = {
    confirmChargeWithSig: fun("0x0fb9e350", "confirmChargeWithSig((uint256,uint256,uint256),bytes)", {"cc": p.struct({"subId": p.uint256, "cycle": p.uint256, "nonce": p.uint256}), "sig": p.bytes}, ),
    eip712Domain: viewFun("0x84b0196e", "eip712Domain()", {}, {"fields": p.bytes1, "name": p.string, "version": p.string, "chainId": p.uint256, "verifyingContract": p.address, "salt": p.bytes32, "extensions": p.array(p.uint256)}),
    globalNonce: viewFun("0x37e23222", "globalNonce()", {}, p.uint256),
    processedCharge: viewFun("0x4567907a", "processedCharge(bytes32)", {"_0": p.bytes32}, p.uint8),
    relayChargeRequest: fun("0x64e52788", "relayChargeRequest(uint256,address,bytes,bool)", {"chainId": p.uint256, "adapter": p.address, "body": p.bytes, "native": p.bool}, ),
    relayMerchantProfileUpdate: fun("0x3d453da4", "relayMerchantProfileUpdate(uint256,address,bytes)", {"chainId": p.uint256, "adapter": p.address, "_body": p.bytes}, ),
    relayTokenUpdate: fun("0x3a358484", "relayTokenUpdate(uint256,address,bool,bytes)", {"chainId": p.uint256, "adapter": p.address, "_native": p.bool, "_body": p.bytes}, ),
    signer: viewFun("0x238ac933", "signer()", {}, p.address),
    subManager: viewFun("0x6632ba93", "subManager()", {}, p.address),
}

export class Contract extends ContractBase {

    eip712Domain() {
        return this.eth_call(functions.eip712Domain, {})
    }

    globalNonce() {
        return this.eth_call(functions.globalNonce, {})
    }

    processedCharge(_0: ProcessedChargeParams["_0"]) {
        return this.eth_call(functions.processedCharge, {_0})
    }

    signer() {
        return this.eth_call(functions.signer, {})
    }

    subManager() {
        return this.eth_call(functions.subManager, {})
    }
}

/// Event types
export type ChargeConfirmedEventArgs = EParams<typeof events.ChargeConfirmed>
export type ChargeRequestedEventArgs = EParams<typeof events.ChargeRequested>
export type EIP712DomainChangedEventArgs = EParams<typeof events.EIP712DomainChanged>
export type MerchantUpdateRequestedEventArgs = EParams<typeof events.MerchantUpdateRequested>
export type TokenUpdateRequestedEventArgs = EParams<typeof events.TokenUpdateRequested>

/// Function types
export type ConfirmChargeWithSigParams = FunctionArguments<typeof functions.confirmChargeWithSig>
export type ConfirmChargeWithSigReturn = FunctionReturn<typeof functions.confirmChargeWithSig>

export type Eip712DomainParams = FunctionArguments<typeof functions.eip712Domain>
export type Eip712DomainReturn = FunctionReturn<typeof functions.eip712Domain>

export type GlobalNonceParams = FunctionArguments<typeof functions.globalNonce>
export type GlobalNonceReturn = FunctionReturn<typeof functions.globalNonce>

export type ProcessedChargeParams = FunctionArguments<typeof functions.processedCharge>
export type ProcessedChargeReturn = FunctionReturn<typeof functions.processedCharge>

export type RelayChargeRequestParams = FunctionArguments<typeof functions.relayChargeRequest>
export type RelayChargeRequestReturn = FunctionReturn<typeof functions.relayChargeRequest>

export type RelayMerchantProfileUpdateParams = FunctionArguments<typeof functions.relayMerchantProfileUpdate>
export type RelayMerchantProfileUpdateReturn = FunctionReturn<typeof functions.relayMerchantProfileUpdate>

export type RelayTokenUpdateParams = FunctionArguments<typeof functions.relayTokenUpdate>
export type RelayTokenUpdateReturn = FunctionReturn<typeof functions.relayTokenUpdate>

export type SignerParams = FunctionArguments<typeof functions.signer>
export type SignerReturn = FunctionReturn<typeof functions.signer>

export type SubManagerParams = FunctionArguments<typeof functions.subManager>
export type SubManagerReturn = FunctionReturn<typeof functions.subManager>

