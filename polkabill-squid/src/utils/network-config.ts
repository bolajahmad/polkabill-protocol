import { assertNotNull } from "@subsquid/util-internal";

// export enum Contracts {
//   SUB_MANAGER = "0x9C72abD08280Ba646889fd293232c3d8f60038D5",
//   PLAN_REGISTRY = "0xca35BAFFd15B593Fa7379A1ADb9e21145B813622",
//   CHAIN_REGISTRY = "0x1f98772C698FEb08cCF2364B83599908c93BaDA9",
//   SUB_CONTROLLER = "0x1EE246cB1CeCCbcB5945D3B53c7aB6B200DCbF19",
//   MERCHANT_REGISTRY = "0x5Fd5fC2a89F7eF867bB977E9848F0f90EF42E678",
// }
export enum Contracts {
  SUB_MANAGER = "0x21d4de374BF31123D9A602d2DCDeD72fC8495Bbd",
  PLAN_REGISTRY = "0x286A7C81Da809Ef072F9668Eeef82F7Bc3Ada679",
  CHAIN_REGISTRY = "0xf77e8b132A1977fBbC893478C4Bff30Ad4C91751",
  SUB_CONTROLLER = "0x0A8406cFcE379505EAEE1a401b9e0A22ECEaA936",
  MERCHANT_REGISTRY = "0x9C9e284ce0D6ED4b034B64fD56f101edBdA63652",
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
