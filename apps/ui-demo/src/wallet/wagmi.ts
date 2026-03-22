import {
  cookieStorage,
  createConfig,
  createStorage,
  fallback,
  http,
  injected,
  webSocket,
} from "wagmi";
import { baseSepolia, polygonAmoy, sepolia } from "wagmi/chains";

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

// WAGMI config with multi-RPC fallbacks
export function getConfig() {
  return createConfig({
    storage: createStorage({ storage: cookieStorage }),
    ssr: true,
    connectors: [injected()], // MetaMask, etc.
    chains: [
      sepolia,
      polygonAmoy,
      baseSepolia,
      passetHub,
    ],
    // Multi-RPC fallback transports
    transports: {
      [sepolia.id]: http(),
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