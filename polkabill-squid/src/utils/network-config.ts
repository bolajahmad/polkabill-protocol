import { assertNotNull } from "@subsquid/util-internal";

// export enum Contracts {
//   SUB_MANAGER = "0x9C72abD08280Ba646889fd293232c3d8f60038D5",
//   PLAN_REGISTRY = "0xca35BAFFd15B593Fa7379A1ADb9e21145B813622",
//   CHAIN_REGISTRY = "0x1f98772C698FEb08cCF2364B83599908c93BaDA9",
//   SUB_CONTROLLER = "0x1EE246cB1CeCCbcB5945D3B53c7aB6B200DCbF19",
//   MERCHANT_REGISTRY = "0x5Fd5fC2a89F7eF867bB977E9848F0f90EF42E678",
// }
export enum Contracts {
  SUB_MANAGER = "0x3cc6dE0F20F93Cc8f84fF22524816ecC6EEc87aE",
  PLAN_REGISTRY = "0x45a33501380787989D6ec89908C89D109cAC0806",
  CHAIN_REGISTRY = "0xD1BB4F0e0ae5178b35e2AF4A9ab21432a82FA248",
  SUB_CONTROLLER = "0x6b20392efB4309976Cd955873331E866E5A554c8",
  MERCHANT_REGISTRY = "0x97990b090231112677315f707976b4bDa436689A",
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
