import {
  cookieStorage,
  createConfig,
  createStorage,
  fallback,
  http,
  injected,
  webSocket,
} from "wagmi";
import { base, baseSepolia, mainnet, polygon, polygonAmoy, sepolia } from "wagmi/chains";

// Your custom chains
export const passetHub = {
  id: 420_420_417,
  name: "AssetHub (Paseo)",
  network: "Polkadot Hub Testnet",
  nativeCurrency: { decimals: 10, name: "Paseo", symbol: "PAS" },
  rpcUrls: {
    default: {
      http: ["https://services.polkadothub-rpc.com/testnet"],
    },
  },
} as const;

export const assetHub = {
  id: 420_420_419,
  name: "AssetHub",
  network: "Polkadot Asset Hub",
  nativeCurrency: { decimals: 10, name: "DOT", symbol: "DOT" },
  rpcUrls: {
    default: { http: ["https://eth-rpc.polkadot.io/"] },
    public: { http: ["https://asset-hub-eth-rpc.polkadot.io"] },
  },
  blockExplorers: {
    default: { name: "Subscan", url: "https://assethub-polkadot.subscan.io" },
  },
} as const;

// WAGMI config with multi-RPC fallbacks
export function getConfig() {
  return createConfig({
    storage: createStorage({ storage: cookieStorage }),
    ssr: true,
    connectors: [injected()], // MetaMask, etc.
    chains: [
      baseSepolia,
      passetHub,
      assetHub,
      sepolia,
      mainnet,
      base,
      polygon,
      polygonAmoy,
    ],
    // Multi-RPC fallback transports
    transports: {
      [baseSepolia.id]: fallback([
        http("https://base-sepolia.g.alchemy.com/v2/FPg_srMCXrb0pwXZnO6_J"),
        http("https://rpc.sepolia.org"),
        http("https://base-sepolia.rpc.thirdweb.com"),
        webSocket("wss://base-sepolia-rpc.publicnode.com"),
      ]),
      [passetHub.id]: fallback([
        webSocket("wss://services.polkadothub-rpc.com/testnet"),
        http("https://services.polkadothub-rpc.com/testnet"),
      ]),
      [assetHub.id]: fallback([
        http("https://asset-hub-eth-rpc.polkadot.io"),
        http("https://eth-rpc.polkadot.io/"),
      ]),
      [sepolia.id]: http(),
      [mainnet.id]: http(),
      [base.id]: http(),
      [polygon.id]: http(),
      [polygonAmoy.id]: http(),
    },
  });
}

// Optional: TypeScript helper to extend WAGMI types
declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}