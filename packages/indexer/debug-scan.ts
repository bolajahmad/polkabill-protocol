/**
 * Scan a range of blocks to find ANY successful transaction to our contracts
 */
import { createPublicClient, http } from 'viem';

const RPC = process.env.RPC_ASSETHUB_HTTP ?? 'https://eth-rpc-testnet.polkadot.io/';

const CONTRACTS = new Set([
  '0xc1c8c9b92ab6083609e29193929852883c66d32a', // SUB_MANAGER
  '0x1d8c64ca9e08abf56b832edc9606c4eec7889059', // PLAN_REGISTRY
  '0xbba26e6278d6ed710f881633e780a9c3b23a3bab', // CHAIN_REGISTRY
  '0x75704c73bdd5ce0dd843ea4aaa375099c133e669', // SUB_CONTROLLER
  '0x6d73534191353e714f607d6b3c08425987131c19', // MERCHANT_REGISTRY
]);

async function main() {
  const client = createPublicClient({ transport: http(RPC) });
  const head = await client.getBlockNumber();
  console.log(`Chain head: ${head}`);

  // Scan from startAtBlock to head
  const START = 6532180;
  const END = Number(head);
  const BATCH = 50;

  let totalTxs = 0;
  let successTxs = 0;
  let revertedTxs = 0;

  for (let from = START; from <= END; from += BATCH) {
    const to = Math.min(from + BATCH - 1, END);
    
    // Fetch blocks in parallel batches of 10
    const blockNums = Array.from({ length: to - from + 1 }, (_, i) => from + i);
    const blocks = await Promise.all(
      blockNums.map(n => client.getBlock({ blockNumber: BigInt(n), includeTransactions: true }).catch(() => null))
    );
    
    for (const block of blocks) {
      if (!block || block.transactions.length === 0) continue;
      
      for (const tx of block.transactions) {
        if (!tx.to || !CONTRACTS.has(tx.to.toLowerCase() as `0x${string}`)) continue;
        
        totalTxs++;
        try {
          const receipt = await client.getTransactionReceipt({ hash: tx.hash });
          if (receipt.status === 'success') {
            successTxs++;
            console.log(`✅ SUCCESS block=${block.number} tx=${tx.hash.slice(0, 20)}… to=${tx.to} logs=${receipt.logs.length}`);
            for (const l of receipt.logs) {
              console.log(`   log: addr=${l.address} topic0=${l.topics[0]?.slice(0, 20)}…`);
            }
          } else {
            revertedTxs++;
            console.log(`❌ REVERTED block=${block.number} tx=${tx.hash.slice(0, 20)}… to=${tx.to}`);
          }
        } catch (e: any) {
          console.log(`⚠️  ERROR block=${block.number} tx=${tx.hash.slice(0, 20)}… err=${e.message?.slice(0, 100)}`);
        }
      }
    }
    
    process.stdout.write(`\rScanned blocks ${from}-${to} / ${END}    `);
  }

  console.log(`\n\nSummary: total=${totalTxs} success=${successTxs} reverted=${revertedTxs}`);
}

main().catch(console.error);
