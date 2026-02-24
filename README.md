# Polkabill

Polkabill is a cross-chain stablecoin-based subscription protocol, that is built off the Polkadot ecosystem. It enables `MERCHANTS` to create on-chain subscription products and automatically charge subscribers across chains and is powered by Hyperbridge messaging.

## Motivation

The digital ecosystem nowadays is built around numerous applications that require `USERS` to pay scheduled fees to have unlimited access. Many Web3 protocols also require these subscruiption payments from their `USERS`. The forefront ways to do these is to rely on centralized platforms like Stripe, which charge some fee and allow scheduled withdrawals into `MERCHANTS'` fiat accounts. This is awesome but it also means that `USERS` must have a bank account to be able to pay these subscriptions. Polkabill allows `USERS` (including Humans and AI agents) to subscribe to services with out exposing their identities, no cross-border barriers (because of card details or censoring).

`MERCHANTS` get immediate settlement into their Crypto wallet(s) and fullcustody of their subscriptions payment.

## Vision

Polkabill provides:

i. Easy setup process for Merchants
ii. Recurring cross-chain stablecoin billing
iii. Merchant managed billing logic
iv. Trust-minimized cross-chain coordination
v. Easy installation into app 
vi. One-click subscriptions for `USERS`

The goal of Polkabill is to make rrecurring payments a first-class primitive in the ecosystem. 

## Architecture Overview

Polkabill uses a Hub + Adapter architecture for its smart contracts

### Hub (Polkadot Hub)
- Manages merchants
- Stores subscription definitions
- Tracks billing cycles
- Dispatches cross-chain charge instructions
- Confirms successful execution

### Adapters (Remote chains)
- Receive charge instructions from Hub
- Execute token transfers
- Enforce idempotency
- Notify Hub of success
- Maintain charge state tracking
  
Communication is handled via Hyperbridge (cross-chain messaging) and XCM.