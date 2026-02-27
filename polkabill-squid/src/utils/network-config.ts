import { assertNotNull } from "@subsquid/util-internal";

// export enum Contracts {
//   SUB_MANAGER = "0x9C72abD08280Ba646889fd293232c3d8f60038D5",
//   PLAN_REGISTRY = "0xca35BAFFd15B593Fa7379A1ADb9e21145B813622",
//   CHAIN_REGISTRY = "0x1f98772C698FEb08cCF2364B83599908c93BaDA9",
//   SUB_CONTROLLER = "0x1EE246cB1CeCCbcB5945D3B53c7aB6B200DCbF19",
//   MERCHANT_REGISTRY = "0x5Fd5fC2a89F7eF867bB977E9848F0f90EF42E678",
// }
export enum Contracts {
  SUB_MANAGER = "0x42B11dB9c5D31e8bd214516aED5293aFB806b28c",
  PLAN_REGISTRY = "0x39BBAAF9c319f5416FD83c0982d406b9DFf2c910",
  CHAIN_REGISTRY = "0x1f98772C60x509b31A3868D90A02ee65331290fAaDE59adD9518FEb08cCF2364B83599908c93BaDA9",
  SUB_CONTROLLER = "0x3202Bd82eE6F098D1966a062BE22AA5adD3e7621",
  MERCHANT_REGISTRY = "0x8499CBBCf79239Bf38E1056580C2020CA12C1cBa",
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
  startAtBlock: 6_082_465,
  contract: {
    [Contracts.SUB_MANAGER]: Contracts.SUB_MANAGER,
    [Contracts.PLAN_REGISTRY]: Contracts.PLAN_REGISTRY,
    [Contracts.CHAIN_REGISTRY]: Contracts.CHAIN_REGISTRY,
    [Contracts.SUB_CONTROLLER]: Contracts.SUB_CONTROLLER,
    [Contracts.MERCHANT_REGISTRY]: Contracts.MERCHANT_REGISTRY,
  }
};
