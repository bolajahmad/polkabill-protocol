import { assertNotNull } from "@subsquid/util-internal";

export enum Contracts {
  SUB_MANAGER = "0x221AA534015a9260c10d183B087dDd2447d2058f",
  PLAN_REGISTRY = "0xc7a444dD7820526355b376685609fB50238a410e",
  CHAIN_REGISTRY = "0xD4e3363741d2e2A034A3F0B2004a90aDD62968bf",
  SUB_CONTROLLER = "0x7Cb0fb5c089e7277E7cA7779a1c98C51A4d5FeE9",
  MERCHANT_REGISTRY = "0x55eF99F40f8674034e192BC90407f2284B11C3EF",
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
  startAtBlock: 6_100_000,
  contract: {
    [Contracts.SUB_MANAGER]: Contracts.SUB_MANAGER,
    [Contracts.PLAN_REGISTRY]: Contracts.PLAN_REGISTRY,
    [Contracts.CHAIN_REGISTRY]: Contracts.CHAIN_REGISTRY,
    [Contracts.SUB_CONTROLLER]: Contracts.SUB_CONTROLLER,
    [Contracts.MERCHANT_REGISTRY]: Contracts.MERCHANT_REGISTRY,
  }
};
