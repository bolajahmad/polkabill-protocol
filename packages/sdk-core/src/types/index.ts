import { Address, PublicClient, WalletClient } from "viem"

export interface PolkabillConfig {
  publicClient: PublicClient
  walletClient?: WalletClient
}

export interface SubscribeParams {
  merchant: Address
  planId: bigint
  token: Address
  amount: bigint
}