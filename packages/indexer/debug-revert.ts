/**
 * Check earlier blocks near deployment for successful txs, and try to get revert reasons
 */
import { createPublicClient, http } from 'viem';

const RPC = process.env.RPC_ASSETHUB_HTTP ?? 'https://eth-rpc-testnet.polkadot.io/';

const CONTRACTS = new Set([
  '0xc1c8c9b92ab6083609e29193929852883c66d32a',
  '0x1d8c64ca9e08abf56b832edc9606c4eec7889059',
  '0xbba26e6278d6ed710f881633e780a9c3b23a3bab',
  '0x75704c73bdd5ce0dd843ea4aaa375099c133e669',
  '0x6d73534191353e714f607d6b3c08425987131c19',
]);

async function main() {
  const client = createPublicClient({ transport: http(RPC) });

  // 1) Try to get the revert reason for the known reverted tx
  console.log('=== Revert reason for tx 0xb1baa80f0d2be8f9… ===');
  try {
    const tx = await client.getTransaction({
      hash: '0xb1baa80f0d2be8f90859d706648282f7df3e50b183523bc62ae7c8ab4e3ae75f' as `0x${string}`,
    });
    console.log(`  from: ${tx.from}`);
    console.log(`  to: ${tx.to}`);
    console.log(`  input: ${tx.input.slice(0, 74)}…`);
    console.log(`  value: ${tx.value}`);

    // Try eth_call to simulate and get revert reason
    try {
      const result = await client.call({
        to: tx.to!,
        data: tx.input,
        from: tx.from,
        blockNumber: BigInt(tx.blockNumber!) - 1n,
      });
      console.log(`  call result: ${result.data}`);
    } catch (e: any) {
      console.log(`  call revert: ${e.shortMessage || e.message?.slice(0, 300)}`);
    }
  } catch (e: any) {
    console.log(`  error: ${e.message?.slice(0, 200)}`);
  }

  // 2) Check the owner of the ChainRegistry
  console.log('\n=== ChainRegistry owner() ===');
  try {
    const ownerData = await client.call({
      to: '0xbba26e6278d6ed710f881633e780a9c3b23a3bab' as `0x${string}`,
      data: '0x8da5cb5b', // owner() selector
    });
    console.log(`  owner: 0x${ownerData.data?.slice(26)}`);
  } catch (e: any) {
    console.log(`  error: ${e.message?.slice(0, 200)}`);
  }

  // 3) Check deployment range for successful txs
  console.log('\n=== Scanning deployment range 6515050-6515300 ===');
  for (let n = 6515050; n <= 6515300; n++) {
    try {
      const block = await client.getBlock({ blockNumber: BigInt(n), includeTransactions: true });
      if (block.transactions.length === 0) continue;
      for (const tx of block.transactions) {
        const receipt = await client.getTransactionReceipt({ hash: tx.hash });
        const isOurs = tx.to && CONTRACTS.has(tx.to.toLowerCase() as `0x${string}`);
        const isContractCreate = !tx.to && receipt.contractAddress && CONTRACTS.has(receipt.contractAddress.toLowerCase() as `0x${string}`);
        if (isOurs || isContractCreate) {
          console.log(`  block=${n} status=${receipt.status} to=${tx.to ?? 'CREATE→' + receipt.contractAddress} logs=${receipt.logs.length}`);
          for (const l of receipt.logs) {
            console.log(`    log: addr=${l.address} topic0=${l.topics[0]?.slice(0, 20)}…`);
          }
        }
      }
    } catch {}
    if (n % 50 === 0) process.stdout.write(`\r  Scanned ${n}/6515300    `);
  }

  console.log('\n\nDone.');
}

main().catch(console.error);
