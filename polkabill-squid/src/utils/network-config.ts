import { assertNotNull } from "@subsquid/util-internal";

// export enum Contracts {
//   SUB_MANAGER = "0x9C72abD08280Ba646889fd293232c3d8f60038D5",
//   PLAN_REGISTRY = "0xca35BAFFd15B593Fa7379A1ADb9e21145B813622",
//   CHAIN_REGISTRY = "0x1f98772C698FEb08cCF2364B83599908c93BaDA9",
//   SUB_CONTROLLER = "0x1EE246cB1CeCCbcB5945D3B53c7aB6B200DCbF19",
//   MERCHANT_REGISTRY = "0x5Fd5fC2a89F7eF867bB977E9848F0f90EF42E678",
// }
export enum Contracts {
  SUB_MANAGER = "0xEABBa27579dC4bCf61cCFdcccBC75E8C89d65b0E",
  PLAN_REGISTRY = "0xb86a1e88dD55CE110968F184B946461219542e63",
  CHAIN_REGISTRY = "0x4691e2EAc5fbAdA85a0aDAC7d607E149ff83b363",
  SUB_CONTROLLER = "0x4328AF0B2435bf02224CDe80d2037349c3769667",
  MERCHANT_REGISTRY = "0xB99e6b15f1962385a13C040384D8B73a18EFF975",
}

export type NetworkConfig = {
  gateway: string;
  rpcEndpoint: string;
  finalityConfirmation: number;
  startAtBlock: number;
  contract: Record<Contracts, any>; // [address, eventNames]
};

export const networkConfig: NetworkConfig = {
  gateway: "https://v2.archive.subsquid.io/network/base-sepolia",
  rpcEndpoint: assertNotNull(
    process.env.RPC_BASE_SEPOLIA_HTTP,
    "No RPC endpoint supplied via RPC_BASE_SEPOLIA_HTTP",
  ),
  finalityConfirmation: 75,
  startAtBlock: 6_082_465,
  contract: {
    [Contracts.SUB_MANAGER]: Contracts.SUB_MANAGER,
    [Contracts.PLAN_REGISTRY]: Contracts.PLAN_REGISTRY,
    [Contracts.CHAIN_REGISTRY]: Contracts.CHAIN_REGISTRY,
    [Contracts.SUB_CONTROLLER]: Contracts.SUB_CONTROLLER,
    [Contracts.MERCHANT_REGISTRY]: Contracts.MERCHANT_REGISTRY,
  }
};
