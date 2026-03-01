import {
  cookieStorage,
  createConfig,
  createStorage,
  http,
  injected,
} from "wagmi";
import { base, baseSepolia, mainnet, sepolia } from "wagmi/chains";

export const passetHub = {
  id: 420_420_417,
  name: "AssetHub (Paseo)",
  network: "Polkadot Hub Testnet",
  nativeCurrency: {
    decimals: 10,
    name: "Paseo",
    symbol: "PAS",
  },
  rpcUrls: {
    default: {
      // http: ['https://eth-rpc-testnet.polkadot.io/', 'https://testnet-passet-hub-eth-rpc.polkadot.io'],
      http: ["https://services.polkadothub-rpc.com/testnet"],
    },
  },
} as const;

export const assetHub = {
  id: 420_420_419,
  name: "AssetHub",
  network: "Polkadot Asset Hub",
  nativeCurrency: {
    decimals: 10,
    name: "DOT",
    symbol: "DOT",
  },
  rpcUrls: {
    default: {
      http: ["https://eth-rpc.polkadot.io/"],
    },
    public: {
      http: ["https://asset-hub-eth-rpc.polkadot.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Subscan",
      url: "https://assethub-polkadot.subscan.io",
    },
  },
} as const;

export function getConfig() {
  return createConfig({
    chains: [passetHub, mainnet, sepolia, baseSepolia, base, assetHub],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    connectors: [injected()],
    transports: {
      [passetHub.id]: http(),
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [base.id]: http(),
      [baseSepolia.id]: http(),
      [assetHub.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
