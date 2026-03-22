import { assertNotNull } from '@subsquid/util-internal';

export enum Contracts {
  SUB_MANAGER = '0xBfdbA4E11De8B3b82F910Dd3AE8e517Ce60b0bB2',
  PLAN_REGISTRY = '0x4791Ea0134eA66b40371A6Daf22d43e02bbB39f8',
  CHAIN_REGISTRY = '0x46A6cbc0Fd15936F4F67aABBc554f4CAf80281F9',
  SUB_CONTROLLER = '0xf5B0d7c1fA5F7DC12796D919B48faCCb325e9B07',
  MERCHANT_REGISTRY = '0x81854B479c4657E92D52dE54BdE06E0Ed28586F9',
}

export type NetworkConfig = {
  rpcEndpoint: string;
  gateway: string;
  finalityConfirmation: number;
  startAtBlock: number;
  contract: Record<Contracts, any>; // [address, eventNames]
};

export const networkConfig: NetworkConfig = {
  gateway: assertNotNull('https://v2.archive.subsquid.io/network/ethereum-sepolia'),
  rpcEndpoint: assertNotNull(
    process.env.RPC_ETHEREUM_SEPOLIA_HTTP,
    'No RPC endpoint supplied via RPC_ETHEREUM_SEPOLIA_HTTP',
  ),
  finalityConfirmation: Number(process.env.FINALITY_CONFIRMATION ?? 10),
  startAtBlock: 10_499_170,
  contract: {
    [Contracts.SUB_MANAGER]: Contracts.SUB_MANAGER,
    [Contracts.PLAN_REGISTRY]: Contracts.PLAN_REGISTRY,
    [Contracts.CHAIN_REGISTRY]: Contracts.CHAIN_REGISTRY,
    [Contracts.SUB_CONTROLLER]: Contracts.SUB_CONTROLLER,
    [Contracts.MERCHANT_REGISTRY]: Contracts.MERCHANT_REGISTRY,
  },
};
