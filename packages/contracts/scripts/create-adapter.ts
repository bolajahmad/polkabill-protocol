import { createWalletClient, encodeFunctionData, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

// Replace with your contract's ABI
const abi = [
  // Only the initialize function is needed for this script
  'function initialize(address _h, bytes _hub, address _fee) public'
];

// Replace with your contract address
const contractAddress = '0xYourContractAddress';

// Replace with your values
const _h = '0x...'; // HyperApp address
const _hub = '0x...'; // bytes value
const _fee = '0x...'; // fee token address

async function main() {
  // Set up account and client
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
  const client = createWalletClient({
    account,
    chain: undefined, // or specify your chain config
    transport: http(process.env.RPC_URL)
  });

  // Prepare calldata for initialize
  const calldata = encodeFunctionData({
    abi: parseAbi(abi),
    functionName: 'initialize',
    args: [_h, _hub, _fee]
  });

  // Send transaction
  try {
    const hash = await client.sendTransaction({
      to: contractAddress,
      data: calldata,
      account
    });
    console.log('Tx sent:', hash);

    // Wait for confirmation
    const receipt = await client.waitForTransactionReceipt({ hash });
    console.log('Tx confirmed:', receipt.status === 'success' ? 'Success' : 'Failed');
    process.exit(receipt.status === 'success' ? 0 : 1);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();