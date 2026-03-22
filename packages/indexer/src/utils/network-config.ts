import { assertNotNull } from '@subsquid/util-internal';

export enum Contracts {
  SUB_MANAGER = '0x7AFa0299E063333453a6d8cac6045a09a4F26505',
  PLAN_REGISTRY = '0xF2073fFa1B5E64118B93810cB134f6B47792A879',
  CHAIN_REGISTRY = '0xb0f7C69ed9F4910ce38cAbD1f03827C0943076c1',
  SUB_CONTROLLER = '0x1fabb39966D694cE09095724B12BDd8c42aD8808',
  MERCHANT_REGISTRY = '0xbF35A9083c86b6F7c1b3CA441e05CDFf11a1d4f1',
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
  startAtBlock: 10490168,
  contract: {
    [Contracts.SUB_MANAGER]: Contracts.SUB_MANAGER,
    [Contracts.PLAN_REGISTRY]: Contracts.PLAN_REGISTRY,
    [Contracts.CHAIN_REGISTRY]: Contracts.CHAIN_REGISTRY,
    [Contracts.SUB_CONTROLLER]: Contracts.SUB_CONTROLLER,
    [Contracts.MERCHANT_REGISTRY]: Contracts.MERCHANT_REGISTRY,
  },
};
