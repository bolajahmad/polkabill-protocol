import '@nomicfoundation/hardhat-toolbox-viem';
import type { HardhatUserConfig } from 'hardhat/config';

// If you want to use a variable for your private key
import { vars } from 'hardhat/config';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.28',
    settings: {
      evmVersion: 'cancun',
      optimizer: {
        enabled: true,
        runs: 200,
      },
      // viaIr: true
    },
  },
  sourcify: {
    enabled: true,
  },
  networks: {
    baseSepolia: {
      chainId: 84532,
      url: 'https://base-sepolia.gateway.tenderly.co',
      accounts: [vars.get('PRIVATE_KEY')],
    },
    sepolia: {
      chainId: 11155111,
      url: 'https://gateway.tenderly.co/public/sepolia',
      accounts: [vars.get('PRIVATE_KEY')],
    },
    polygonAmoy: {
      chainId: 80002,
      url: 'https://polygon-amoy.api.onfinality.io/public',
      accounts: [vars.get('PRIVATE_KEY')],
    },
    bncTestnet: {
      chainId: 97,
      url: 'wss://bsc-testnet-rpc.publicnode.com',
      accounts: [vars.get('PRIVATE_KEY')],
    }
  },
  etherscan: {
    apiKey: {
      baseSepolia: vars.get('ETHERSCAN_API_KEY'),
      sepolia: vars.get('ETHERSCAN_API_KEY'),
      polygonAmoy: vars.get('ETHERSCAN_API_KEY'),
      bscTestnet: vars.get('ETHERSCAN_API_KEY'),
    }
  },
};

export default config;
