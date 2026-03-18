import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    ChargeConfirmed: event("0x2db06b3c04b68c96e2a63ff2345138426c37fb1b427aa36341c02a09fde075f6", "ChargeConfirmed(uint256,uint256,uint256)", {"chainId": indexed(p.uint256), "subscriptionId": indexed(p.uint256), "billingCycle": p.uint256}),
    ChargeRequestRelayed: event("0xc3fd80598b4c318a763ec64cc9128dc82492afe845edf1f07b606099f3e61b7b", "ChargeRequestRelayed(uint256,address,bytes)", {"chainId": indexed(p.uint256), "adapter": indexed(p.address), "body": p.bytes}),
    DispatchFailed: event("0x11754adff210f7c167749ca2dbc4874b7e7b01a11e351b03fa176d44060f2226", "DispatchFailed(uint256,address,uint8)", {"chainId": indexed(p.uint256), "adapter": indexed(p.address), "messageType": p.uint8}),
    DispatchTimeout: event("0x2d7b5720cfc3c36d767445ee31544f6772e9758037291b49611328cffe850719", "DispatchTimeout(uint8)", {"messageType": p.uint8}),
    MerchantProfileUpdated: event("0x98de668d692f033c3537455830f3362062426b0708d930ecde0695ccdd6551dd", "MerchantProfileUpdated(uint256,address,bytes)", {"chainId": indexed(p.uint256), "adapter": indexed(p.address), "body": p.bytes}),
    OwnershipTransferred: event("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", {"previousOwner": indexed(p.address), "newOwner": indexed(p.address)}),
    TokenUpdateRelayed: event("0xeda821a22a19ed6b7d6ab50c6faec9145fd0bc8efbc39a1ed7e2d16eef2f2ae2", "TokenUpdateRelayed(uint256,address,bool)", {"chainId": indexed(p.uint256), "adapter": indexed(p.address), "native": p.bool}),
}

export const functions = {
    chainRegistry: viewFun("0xfd5e394a", "chainRegistry()", {}, p.address),
    feeToken: viewFun("0x647846a5", "feeToken()", {}, p.address),
    host: viewFun("0xf437bc59", "host()", {}, p.address),
    merchantRegistry: viewFun("0x6eca5042", "merchantRegistry()", {}, p.address),
    merchantSyncs: viewFun("0xa77c2989", "merchantSyncs(bytes32)", {"_0": p.bytes32}, p.bool),
    onAccept: fun("0x0fee32ce", "onAccept(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),address))", {"_incoming": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "relayer": p.address})}, ),
    onGetResponse: fun("0x44ab20f8", "onGetResponse((((bytes,bytes,uint64,address,uint64,bytes[],uint64,bytes),(bytes,bytes)[]),address))", {"_0": p.struct({"response": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.address, "timeoutTimestamp": p.uint64, "keys": p.array(p.bytes), "height": p.uint64, "context": p.bytes}), "values": p.array(p.struct({"key": p.bytes, "value": p.bytes}))}), "relayer": p.address})}, ),
    onGetTimeout: fun("0xd0fff366", "onGetTimeout((bytes,bytes,uint64,address,uint64,bytes[],uint64,bytes))", {"_0": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.address, "timeoutTimestamp": p.uint64, "keys": p.array(p.bytes), "height": p.uint64, "context": p.bytes})}, ),
    onPostRequestTimeout: fun("0xbc0dd447", "onPostRequestTimeout((bytes,bytes,uint64,bytes,bytes,uint64,bytes))", {"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes})}, ),
    onPostResponse: fun("0xb2a01bf5", "onPostResponse((((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64),address))", {"_0": p.struct({"response": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "response": p.bytes, "timeoutTimestamp": p.uint64}), "relayer": p.address})}, ),
    onPostResponseTimeout: fun("0x0bc37bab", "onPostResponseTimeout(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64))", {"_0": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "response": p.bytes, "timeoutTimestamp": p.uint64})}, ),
    owner: viewFun("0x8da5cb5b", "owner()", {}, p.address),
    processedCharge: viewFun("0x4567907a", "processedCharge(bytes32)", {"_0": p.bytes32}, p.bool),
    'quote((bytes,bytes,bytes,uint64,uint256,address))': viewFun("0x108bc1dd", "quote((bytes,bytes,bytes,uint64,uint256,address))", {"request": p.struct({"dest": p.bytes, "to": p.bytes, "body": p.bytes, "timeout": p.uint64, "fee": p.uint256, "payer": p.address})}, p.uint256),
    'quote((bytes,uint64,bytes[],uint64,uint256,bytes))': viewFun("0xbca96c39", "quote((bytes,uint64,bytes[],uint64,uint256,bytes))", {"request": p.struct({"dest": p.bytes, "height": p.uint64, "keys": p.array(p.bytes), "timeout": p.uint64, "fee": p.uint256, "context": p.bytes})}, p.uint256),
    'quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))': viewFun("0xdd92a316", "quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))", {"response": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "response": p.bytes, "timeout": p.uint64, "fee": p.uint256, "payer": p.address})}, p.uint256),
    'quoteNative((bytes,bytes,bytes,uint64,uint256,address))': viewFun("0x4f3f7c05", "quoteNative((bytes,bytes,bytes,uint64,uint256,address))", {"request": p.struct({"dest": p.bytes, "to": p.bytes, "body": p.bytes, "timeout": p.uint64, "fee": p.uint256, "payer": p.address})}, p.uint256),
    'quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))': viewFun("0x632e235a", "quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))", {"request": p.struct({"request": p.struct({"source": p.bytes, "dest": p.bytes, "nonce": p.uint64, "from": p.bytes, "to": p.bytes, "timeoutTimestamp": p.uint64, "body": p.bytes}), "response": p.bytes, "timeout": p.uint64, "fee": p.uint256, "payer": p.address})}, p.uint256),
    'quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))': viewFun("0xd24740fb", "quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))", {"request": p.struct({"dest": p.bytes, "height": p.uint64, "keys": p.array(p.bytes), "timeout": p.uint64, "fee": p.uint256, "context": p.bytes})}, p.uint256),
    relayChargeRequest: fun("0x64e52788", "relayChargeRequest(uint256,address,bytes,bool)", {"_chain": p.uint256, "_adapter": p.address, "_body": p.bytes, "_native": p.bool}, ),
    relayMerchantProfileUpdate: fun("0x3d453da4", "relayMerchantProfileUpdate(uint256,address,bytes)", {"_chain": p.uint256, "_adapter": p.address, "_body": p.bytes}, ),
    relayTokenUpdate: fun("0x3a358484", "relayTokenUpdate(uint256,address,bool,bytes)", {"_chain": p.uint256, "_adapter": p.address, "_native": p.bool, "_body": p.bytes}, ),
    renounceOwnership: fun("0x715018a6", "renounceOwnership()", {}, ),
    subManager: viewFun("0x6632ba93", "subManager()", {}, p.address),
    tokenSyncs: viewFun("0x665fe179", "tokenSyncs(bytes32)", {"_0": p.bytes32}, p.bool),
    transferOwnership: fun("0xf2fde38b", "transferOwnership(address)", {"newOwner": p.address}, ),
}

export class Contract extends ContractBase {

    chainRegistry() {
        return this.eth_call(functions.chainRegistry, {})
    }

    feeToken() {
        return this.eth_call(functions.feeToken, {})
    }

    host() {
        return this.eth_call(functions.host, {})
    }

    merchantRegistry() {
        return this.eth_call(functions.merchantRegistry, {})
    }

    merchantSyncs(_0: MerchantSyncsParams["_0"]) {
        return this.eth_call(functions.merchantSyncs, {_0})
    }

    owner() {
        return this.eth_call(functions.owner, {})
    }

    processedCharge(_0: ProcessedChargeParams["_0"]) {
        return this.eth_call(functions.processedCharge, {_0})
    }

    'quote((bytes,bytes,bytes,uint64,uint256,address))'(request: QuoteParams_0["request"]) {
        return this.eth_call(functions['quote((bytes,bytes,bytes,uint64,uint256,address))'], {request})
    }

    'quote((bytes,uint64,bytes[],uint64,uint256,bytes))'(request: QuoteParams_1["request"]) {
        return this.eth_call(functions['quote((bytes,uint64,bytes[],uint64,uint256,bytes))'], {request})
    }

    'quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))'(response: QuoteParams_2["response"]) {
        return this.eth_call(functions['quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))'], {response})
    }

    'quoteNative((bytes,bytes,bytes,uint64,uint256,address))'(request: QuoteNativeParams_0["request"]) {
        return this.eth_call(functions['quoteNative((bytes,bytes,bytes,uint64,uint256,address))'], {request})
    }

    'quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))'(request: QuoteNativeParams_1["request"]) {
        return this.eth_call(functions['quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))'], {request})
    }

    'quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))'(request: QuoteNativeParams_2["request"]) {
        return this.eth_call(functions['quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))'], {request})
    }

    subManager() {
        return this.eth_call(functions.subManager, {})
    }

    tokenSyncs(_0: TokenSyncsParams["_0"]) {
        return this.eth_call(functions.tokenSyncs, {_0})
    }
}

/// Event types
export type ChargeConfirmedEventArgs = EParams<typeof events.ChargeConfirmed>
export type ChargeRequestRelayedEventArgs = EParams<typeof events.ChargeRequestRelayed>
export type DispatchFailedEventArgs = EParams<typeof events.DispatchFailed>
export type DispatchTimeoutEventArgs = EParams<typeof events.DispatchTimeout>
export type MerchantProfileUpdatedEventArgs = EParams<typeof events.MerchantProfileUpdated>
export type OwnershipTransferredEventArgs = EParams<typeof events.OwnershipTransferred>
export type TokenUpdateRelayedEventArgs = EParams<typeof events.TokenUpdateRelayed>

/// Function types
export type ChainRegistryParams = FunctionArguments<typeof functions.chainRegistry>
export type ChainRegistryReturn = FunctionReturn<typeof functions.chainRegistry>

export type FeeTokenParams = FunctionArguments<typeof functions.feeToken>
export type FeeTokenReturn = FunctionReturn<typeof functions.feeToken>

export type HostParams = FunctionArguments<typeof functions.host>
export type HostReturn = FunctionReturn<typeof functions.host>

export type MerchantRegistryParams = FunctionArguments<typeof functions.merchantRegistry>
export type MerchantRegistryReturn = FunctionReturn<typeof functions.merchantRegistry>

export type MerchantSyncsParams = FunctionArguments<typeof functions.merchantSyncs>
export type MerchantSyncsReturn = FunctionReturn<typeof functions.merchantSyncs>

export type OnAcceptParams = FunctionArguments<typeof functions.onAccept>
export type OnAcceptReturn = FunctionReturn<typeof functions.onAccept>

export type OnGetResponseParams = FunctionArguments<typeof functions.onGetResponse>
export type OnGetResponseReturn = FunctionReturn<typeof functions.onGetResponse>

export type OnGetTimeoutParams = FunctionArguments<typeof functions.onGetTimeout>
export type OnGetTimeoutReturn = FunctionReturn<typeof functions.onGetTimeout>

export type OnPostRequestTimeoutParams = FunctionArguments<typeof functions.onPostRequestTimeout>
export type OnPostRequestTimeoutReturn = FunctionReturn<typeof functions.onPostRequestTimeout>

export type OnPostResponseParams = FunctionArguments<typeof functions.onPostResponse>
export type OnPostResponseReturn = FunctionReturn<typeof functions.onPostResponse>

export type OnPostResponseTimeoutParams = FunctionArguments<typeof functions.onPostResponseTimeout>
export type OnPostResponseTimeoutReturn = FunctionReturn<typeof functions.onPostResponseTimeout>

export type OwnerParams = FunctionArguments<typeof functions.owner>
export type OwnerReturn = FunctionReturn<typeof functions.owner>

export type ProcessedChargeParams = FunctionArguments<typeof functions.processedCharge>
export type ProcessedChargeReturn = FunctionReturn<typeof functions.processedCharge>

export type QuoteParams_0 = FunctionArguments<typeof functions['quote((bytes,bytes,bytes,uint64,uint256,address))']>
export type QuoteReturn_0 = FunctionReturn<typeof functions['quote((bytes,bytes,bytes,uint64,uint256,address))']>

export type QuoteParams_1 = FunctionArguments<typeof functions['quote((bytes,uint64,bytes[],uint64,uint256,bytes))']>
export type QuoteReturn_1 = FunctionReturn<typeof functions['quote((bytes,uint64,bytes[],uint64,uint256,bytes))']>

export type QuoteParams_2 = FunctionArguments<typeof functions['quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))']>
export type QuoteReturn_2 = FunctionReturn<typeof functions['quote(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))']>

export type QuoteNativeParams_0 = FunctionArguments<typeof functions['quoteNative((bytes,bytes,bytes,uint64,uint256,address))']>
export type QuoteNativeReturn_0 = FunctionReturn<typeof functions['quoteNative((bytes,bytes,bytes,uint64,uint256,address))']>

export type QuoteNativeParams_1 = FunctionArguments<typeof functions['quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))']>
export type QuoteNativeReturn_1 = FunctionReturn<typeof functions['quoteNative(((bytes,bytes,uint64,bytes,bytes,uint64,bytes),bytes,uint64,uint256,address))']>

export type QuoteNativeParams_2 = FunctionArguments<typeof functions['quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))']>
export type QuoteNativeReturn_2 = FunctionReturn<typeof functions['quoteNative((bytes,uint64,bytes[],uint64,uint256,bytes))']>

export type RelayChargeRequestParams = FunctionArguments<typeof functions.relayChargeRequest>
export type RelayChargeRequestReturn = FunctionReturn<typeof functions.relayChargeRequest>

export type RelayMerchantProfileUpdateParams = FunctionArguments<typeof functions.relayMerchantProfileUpdate>
export type RelayMerchantProfileUpdateReturn = FunctionReturn<typeof functions.relayMerchantProfileUpdate>

export type RelayTokenUpdateParams = FunctionArguments<typeof functions.relayTokenUpdate>
export type RelayTokenUpdateReturn = FunctionReturn<typeof functions.relayTokenUpdate>

export type RenounceOwnershipParams = FunctionArguments<typeof functions.renounceOwnership>
export type RenounceOwnershipReturn = FunctionReturn<typeof functions.renounceOwnership>

export type SubManagerParams = FunctionArguments<typeof functions.subManager>
export type SubManagerReturn = FunctionReturn<typeof functions.subManager>

export type TokenSyncsParams = FunctionArguments<typeof functions.tokenSyncs>
export type TokenSyncsReturn = FunctionReturn<typeof functions.tokenSyncs>

export type TransferOwnershipParams = FunctionArguments<typeof functions.transferOwnership>
export type TransferOwnershipReturn = FunctionReturn<typeof functions.transferOwnership>

