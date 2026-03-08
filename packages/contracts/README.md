# Polkabill Smart contracts

This package contains the Solidity smart contracts for the Polkabill protocol.

## Overview

The contracts follow a Hub-and-Adapter architecture.

### Hub Contract
Deployed on:
- Paseo Polkadot Hub (Testnet)

Responsibilities
- Manage merchants and their subscription plans
- Manage user subscriptions
- Track billing cycles
- Dispatch charge instructions
- Confirm execution(s)


### Billing Adapter
Deployed on
- Target execution chains (same code because the codeHash is stored on the Hub)

Responsibilities
- Receive charge instructions via Hyperbridge
- Validate source chain and hub identity
- Enforce allowed tokens 
- Transfer tokens (after billing from Users to Merchants)
- Charges fees and allows withdrawals


## Contract Flow

### Charge Execution Flow

1. Hub determines subscription due for billing: this is done by some bots that monitor the Subscriptions contract for subscriptions within the billing window.
2. Hub dispatches a `CHARGE` message to the Adapter
3. Adapter:
  - Validates source of message (must be Hub)
  - Checks allowed tokens and ensures charge is not duplicated
  - Transfers tokens as necessary
  - Dispatches success message to the Hub
4. Hub updates the subscription billing state.

Each charge is uniquely identified on the Adapter based on its (subscriptionId, billingCycle). Thi ensures there are:
- No double charging
- Replay-safe execution
- Deterministic billing


## Cross-chain Messaging

The cross-chain messaging is powered by Hyperbridge SDK (which allows messaging between Polkadot and EVM chains). The main parties are the SubscriptionController and the BillingAdapter and they work based on

- Incoming messages va;idated via `onAccept`
- Outgoing mesages are dispatched using the `IDispatcher`


## E2E Testing

Using E2E testing, we can verify the full flow of the contracts:

1. Merchant lifecycle
2. Plan lifecycle
3. Plan lifecycle
4. Subscription lifecycle
5. Charging lifecycle
6. Cross-chain notification
7. Failure handling
8. Retry logic
9. State consistency after failure
10. Invariants across multiple cycles

## Deployment Order

Contracts are deployed in certain orders based on how they are interrelated.

1. [Chain Registry](./ignition//modules/ChainRegistry.ts).
2.  [SubscriptionManager](./ignition/modules/SubscriptionManager.ts). Expects the Just deployed `ChainAddress`.
3. [Merchant Registry](./ignition/modules/MerchantRegistry.ts). Use the `ChainRegistry` and `SubscriptionManager`, but use placeholder for `Controller`
4. [Plan Registry](./ignition/modules/PlanRegistry.ts). Pass the `MerchantRegistry` address
5. [SubscriptionController](./ignition/modules/SubscriptionsController.ts). Deploys the `SubscriptionController` and also calls the other contracts (at their deployed address(es)) to update their state(s) with the most recent deployments.