import { Address, PublicClient, WalletClient } from "viem"

export interface PolkabillConfig {
  publicClient: PublicClient
  walletClient?: WalletClient
}

export interface SubscribeParams {
  planId: bigint
  chainId?: bigint
  token?: Address
}