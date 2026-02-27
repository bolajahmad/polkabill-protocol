import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

// If you want to use a variable for your private key
import { vars } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  etherscan: {
    apiKey: vars.get("ETHERSCAN_API_KEY"),
  },
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
  },
};

export default config;
