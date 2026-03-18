/**
 * Check if chain 11155111 (Sepolia) is already registered, and verify function selector
 */
import { createPublicClient, encodeFunctionData, http } from 'viem';

const RPC = process.env.RPC_ASSETHUB_HTTP ?? 'https://eth-rpc-testnet.polkadot.io/';
const CHAIN_REGISTRY = '0xbba26e6278d6ed710f881633e780a9c3b23a3bab' as `0x${string}`;

const abi = [
  {
    name: 'getBillingAdapter',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_cid', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'isChainSupported',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_cid', type: 'uint256' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    name: 'registerChain',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: '_cid', type: 'uint256' }, { name: '_adapter', type: 'address' }],
    outputs: [],
  },
] as const;

async function main() {
  const client = createPublicClient({ transport: http(RPC) });

  // 1) Verify function selector
  const registerChainData = encodeFunctionData({
    abi,
    functionName: 'registerChain',
    args: [11155111n, '0x0000000000000000000000000000000000000001'],
  });
  console.log(`registerChain selector: ${registerChainData.slice(0, 10)}`);
  console.log(`tx input selector was: 0x7e25b5f8`);
  console.log(`Match: ${registerChainData.slice(0, 10) === '0x7e25b5f8'}`);

  // 2) Check if chain 11155111 already has a billing adapter
  console.log('\n=== Check chain 11155111 (Sepolia) ===');
  try {
    const adapter = await client.readContract({
      address: CHAIN_REGISTRY,
      abi,
      functionName: 'getBillingAdapter',
      args: [11155111n],
    });
    console.log(`  getBillingAdapter(11155111): ${adapter}`);
  } catch (e: any) {
    console.log(`  error: ${e.shortMessage || e.message?.slice(0, 200)}`);
  }

  try {
    const supported = await client.readContract({
      address: CHAIN_REGISTRY,
      abi,
      functionName: 'isChainSupported',
      args: [11155111n],
    });
    console.log(`  isChainSupported(11155111): ${supported}`);
  } catch (e: any) {
    console.log(`  error: ${e.shortMessage || e.message?.slice(0, 200)}`);
  }

  // 3) Check Asset Hub chain IDs too
  for (const cid of [420420417n, 0n, 1n]) {
    try {
      const adapter = await client.readContract({
        address: CHAIN_REGISTRY,
        abi,
        functionName: 'getBillingAdapter',
        args: [cid],
      });
      console.log(`  getBillingAdapter(${cid}): ${adapter}`);
    } catch (e: any) {
      console.log(`  getBillingAdapter(${cid}) error: ${e.shortMessage?.slice(0, 100)}`);
    }
  }

  // 4) Try to simulate the exact failed tx
  console.log('\n=== Simulate registerChain(11155111, adapter) from owner ===');
  const fullTxInput = '0x7e25b5f80000000000000000000000000000000000000000000000000000000000aa36a7';
  // We need the full input - fetch the tx
  const tx = await client.getTransaction({
    hash: '0xb1baa80f0d2be8f90859d706648282f7df3e50b183523bc62ae7c8ab4e3ae75f' as `0x${string}`,
  });
  console.log(`  Full tx input: ${tx.input}`);
  console.log(`  Input length: ${tx.input.length}`);
  
  // Decode the args
  const cidHex = '0x' + tx.input.slice(10, 74);
  const adapterHex = '0x' + tx.input.slice(74 + 24); // skip 24 chars of zero-padding
  console.log(`  Chain ID arg: ${BigInt(cidHex)}`);
  console.log(`  Adapter arg: ${adapterHex}`);

  // 5) Try simulating at latest block
  console.log('\n=== Simulate at latest block ===');
  try {
    await client.call({
      to: CHAIN_REGISTRY,
      data: tx.input,
      from: tx.from,
    });
    console.log('  ✅ Simulation succeeded at latest block');
  } catch (e: any) {
    console.log(`  ❌ Revert: ${e.shortMessage || e.message?.slice(0, 300)}`);
    if (e.data) console.log(`  Revert data: ${e.data}`);
  }

  // 6) Check what bytecode is at the contract address
  console.log('\n=== Contract bytecode check ===');
  const code = await client.getCode({ address: CHAIN_REGISTRY });
  console.log(`  Code length: ${code?.length ?? 0} chars (${((code?.length ?? 2) - 2) / 2} bytes)`);
  console.log(`  Has code: ${!!code && code !== '0x'}`);
}

main().catch(console.error);
