import { assertNotNull } from "@subsquid/util-internal";

export enum Contracts {
  SUB_MANAGER = "0x23a92444BC4a9Cf639B54732eD33A55A9ae0ba15",
  PLAN_REGISTRY = "0xf4589146A5B6Acacac1CBCB19B46A0FDF05B8AF4",
  CHAIN_REGISTRY = "0x5e58936DdFA55A9a5115446B02689874261eD34A",
  SUB_CONTROLLER = "0x2Cea0acbab5D5788d241D7279b2ebE0C5d49512D",
  MERCHANT_REGISTRY = "0x43408C22242fa6A59DE28ab7128Ea4aC121C5569",
}

export type NetworkConfig = {
  gateway: string;
  rpcEndpoint: string;
  finalityConfirmation: number;
  startAtBlock: number;
  contract: Record<Contracts, any>; // [address, eventNames]
};

export const networkConfig: NetworkConfig = {
  gateway: "https://v2.archive.subsquid.io/network/asset-hub-paseo",
  rpcEndpoint: assertNotNull(
    process.env.RPC_ASSETHUB_HTTP,
    "No RPC endpoint supplied via RPC_ASSETHUB_HTTP",
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
