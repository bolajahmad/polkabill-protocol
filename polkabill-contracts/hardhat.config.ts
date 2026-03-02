import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

// If you want to use a variable for your private key
import { vars } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  sourcify: {
    enabled: true,
  },
  networks: {
    polkadotTestnet: {
      url: "https://services.polkadothub-rpc.com/testnet",
      chainId: 420420417,
      accounts: [vars.get("PRIVATE_KEY")],
    },
    baseSepolia: {
      chainId: 84532,
      url: "https://base-sepolia.gateway.tenderly.co",
      accounts: [vars.get("PRIVATE_KEY")],
    },
    sepolia: {
      chainId: 11155111,
      url: "https://gateway.tenderly.co/public/sepolia",
      accounts: [vars.get("PRIVATE_KEY")],
    },
    amoy: {
      chainId: 80052,
      url: "https://polygon-amoy.api.onfinality.io/public",
      accounts: [vars.get("PRIVATE_KEY")],
    }
  },
  etherscan: {
    apiKey: {
      polkadotTestnet: vars.get("SUBSCAN_API_KEY"),
      baseSepolia: vars.get("ETHERSCAN_API_KEY"),
    },
    customChains: [
      {
        network: "polkadotTestnet",
        chainId: 420420417,
        urls: {
          apiURL:
            "https://assethub-paseo.api.subscan.io/api/scan/evm/contract/verifysource",
          browserURL: "https://assethub-paseo.subscan.io",
        },
      },
    ],
  },
};

export default config;

