import { assertNotNull } from "@subsquid/util-internal";

export enum Contracts {
  SUB_MANAGER = "0xc1c8c9b92AB6083609E29193929852883c66D32a",
  PLAN_REGISTRY = "0x1d8C64CA9E08AbF56b832edC9606c4Eec7889059",
  CHAIN_REGISTRY = "0xbBa26e6278D6eD710f881633E780A9C3b23a3BAb",
  SUB_CONTROLLER = "0x75704c73bdD5Ce0dd843ea4AAa375099c133E669",
  MERCHANT_REGISTRY = "0x6D73534191353E714F607D6b3C08425987131C19",
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
  startAtBlock: 6_515_050,
  contract: {
    [Contracts.SUB_MANAGER]: Contracts.SUB_MANAGER,
    [Contracts.PLAN_REGISTRY]: Contracts.PLAN_REGISTRY,
    [Contracts.CHAIN_REGISTRY]: Contracts.CHAIN_REGISTRY,
    [Contracts.SUB_CONTROLLER]: Contracts.SUB_CONTROLLER,
    [Contracts.MERCHANT_REGISTRY]: Contracts.MERCHANT_REGISTRY,
  }
};
