import hre from "hardhat";
import { defineChain } from "viem";

// Contract addresses from deployed_addresses.json
const CHAIN_REGISTRY_ADDRESS =
  "0x5e407F1B8715Bd5eDdaCa4D9CE70A1aA1338E4A2" as const;

// Configuration
const CHAIN_ID_TO_REGISTER = 84532; // Base Sepolia
const BILLING_ADAPTER_ADDRESS =
  "0x0511d63630357B3af7D3101bA9d6860ec21d188E" as `0x${string}`; // Replace with actual deployed adapter

const chain = defineChain({
  id: 420420417,
  name: "AssetHub (Paseo)",
  nativeCurrency: {
    decimals: 10,
    name: "Paseo",
    symbol: "PAS",
  },
  rpcUrls: {
    default: {
      // http: ['https://eth-rpc-testnet.polkadot.io/', 'https://testnet-passet-hub-eth-rpc.polkadot.io'],
      // http: ["https://services.polkadothub-rpc.com/testnet"],
      http: ["https://services.polkadothub-rpc.com/testnet"],
    },
  },
});
async function main() {
  // Get clients
  const publicClient = await hre.viem.getPublicClient({
    chain,
  });
  const [walletClient] = await hre.viem.getWalletClients();

  // Get account
  const [account] = await walletClient.getAddresses();
  console.log(`Using account: ${account}\n`);

  // Get ChainRegistry contract
  const chainRegistry = await hre.viem.getContractAt(
    "ChainRegistry",
    CHAIN_REGISTRY_ADDRESS,
  );

  const isSupported = await chainRegistry.read.isChainSupported([
    BigInt(CHAIN_ID_TO_REGISTER),
  ]);
  console.log(`Chain supported: ${isSupported}`);

  const existingAdapter = await chainRegistry.read.getBillingAdapter([
    BigInt(CHAIN_ID_TO_REGISTER),
  ]);
  console.log(`Current adapter: ${existingAdapter}\n`);

  // Register the chain with its adapter
  console.log("Registering chain with adapter...");
  try {
    const hash = await chainRegistry.write.registerChain([
      BigInt(CHAIN_ID_TO_REGISTER),
      BILLING_ADAPTER_ADDRESS,
    ]);

    console.log(`Transaction hash: ${hash}`);
    console.log("Waiting for confirmation...");

    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    if (receipt.status === "success") {
      console.log("Transaction confirmed!\n");
    } else {
      console.log("Transaction failed!\n");
      return;
    }
  } catch (error: any) {
    console.error("Registration failed:", error.message);

    if (error.message.includes("ChainExists")) {
      console.log("   Chain is already registered.");
    } else if (error.message.includes("InvalidAdapterCode")) {
      console.log("   The adapter code hash does not match the expected hash.");
      console.log("   Make sure the BillingAdapter is properly deployed.");
    } else if (error.message.includes("OwnableUnauthorizedAccount")) {
      console.log("   You are not the owner of the ChainRegistry.");
    }
    return;
  }

  // Read and verify the updated state
  console.log("📊 Verifying registration...");

  //   const isSupported = await chainRegistry.read.isChainSupported([
  //     BigInt(CHAIN_ID_TO_REGISTER),
  //   ]);
  //   console.log(`   ✓ Chain supported: ${isSupported}`);

  //   const registeredAdapter = await chainRegistry.read.getBillingAdapter([
  //     BigInt(CHAIN_ID_TO_REGISTER),
  //   ]);
  //   console.log(`   ✓ Registered adapter: ${registeredAdapter}`);

  //   const isValid = await chainRegistry.read.isValidAdapter([
  //     BigInt(CHAIN_ID_TO_REGISTER),
  //     BILLING_ADAPTER_ADDRESS,
  //   ]);
  //   console.log(`   ✓ Adapter is valid: ${isValid}`);

  //   const approvedCodeHash = await chainRegistry.read.approvedAdapterCodeHash();
  //   console.log(`   ✓ Approved code hash: ${approvedCodeHash}\n`);

  //   console.log("🎉 BillingAdapter registration completed successfully!");
  //   console.log("\n📝 Next steps:");
  //   console.log("   1. Activate the chain using setChainStatus(chainId, true)");
  //   console.log("   2. Add supported tokens using setTokenSupport()");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
