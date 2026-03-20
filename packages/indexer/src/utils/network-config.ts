import { assertNotNull } from "@subsquid/util-internal";

export enum Contracts {
  SUB_MANAGER = "0x845589dbb1271BE563D768e93F5f59cdaA0fd192",
  PLAN_REGISTRY = "0xa6b4f8687040E31707F5232C9E96A062dE32e960",
  CHAIN_REGISTRY = "0x97e4b7577e4B3Db2F603054a6Aa4a9E2d6f14a00",
  SUB_CONTROLLER = "0x2EC29313fbC5Fd488195584E717b0aa9ca3812c3",
  MERCHANT_REGISTRY = "0x0D0f40bb15cd1AdC996d3a5Ae6d48dd4A4746940",
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
  startAtBlock: 6598520,
  contract: {
    [Contracts.SUB_MANAGER]: Contracts.SUB_MANAGER,
    [Contracts.PLAN_REGISTRY]: Contracts.PLAN_REGISTRY,
    [Contracts.CHAIN_REGISTRY]: Contracts.CHAIN_REGISTRY,
    [Contracts.SUB_CONTROLLER]: Contracts.SUB_CONTROLLER,
    [Contracts.MERCHANT_REGISTRY]: Contracts.MERCHANT_REGISTRY,
  }
};
