import { assertNotNull } from "@subsquid/util-internal";

export enum Contracts {
  SUB_MANAGER = "0x515368Cca3a1224c1e4185FC7f2169FA2901cD43",
  PLAN_REGISTRY = "0xD3753af5C2b8Dffa9fB87503425A2da54b713827",
  CHAIN_REGISTRY = "0x9b196e82E33a3f944EB210CCA73d818458463BB6",
  SUB_CONTROLLER = "0xAC3Dfd48F6Ab7e7a775F750F4F3c2c9ae8037399",
  MERCHANT_REGISTRY = "0xb1094842d12226911eBcD8B7c0bD5C73776E593a",
}

export type NetworkConfig = {
  rpcEndpoint: string;
  finalityConfirmation: number;
  startAtBlock: number;
  contract: Record<Contracts, any>; // [address, eventNames]
};

export const networkConfig: NetworkConfig = {
  rpcEndpoint: assertNotNull(
    process.env.RPC_ASSETHUB_HTTP,
    "No RPC endpoint supplied via RPC_ASSETHUB_HTTP",
  ),
  finalityConfirmation: Number(process.env.FINALITY_CONFIRMATION ?? 10),
  startAtBlock: 6609580,
  contract: {
    [Contracts.SUB_MANAGER]: Contracts.SUB_MANAGER,
    [Contracts.PLAN_REGISTRY]: Contracts.PLAN_REGISTRY,
    [Contracts.CHAIN_REGISTRY]: Contracts.CHAIN_REGISTRY,
    [Contracts.SUB_CONTROLLER]: Contracts.SUB_CONTROLLER,
    [Contracts.MERCHANT_REGISTRY]: Contracts.MERCHANT_REGISTRY,
  }
};
