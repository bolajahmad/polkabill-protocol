import { createPublicClient, http } from 'viem';

const RPC = process.env.RPC_ASSETHUB_HTTP ?? 'https://eth-rpc-testnet.polkadot.io/';

const CONTRACTS = [
  '0xc1c8c9b92ab6083609e29193929852883c66d32a',
  '0x1d8c64ca9e08abf56b832edc9606c4eec7889059',
  '0xbba26e6278d6ed710f881633e780a9c3b23a3bab',
  '0x75704c73bdd5ce0dd843ea4aaa375099c133e669',
  '0x6d73534191353e714f607d6b3c08425987131c19',
] as `0x${string}`[];

async function main() {
  const client = createPublicClient({ transport: http(RPC) });

  // Scan in 1000-block chunks from deployment to startAtBlock
  console.log('Scanning for ALL logs from our contracts, blocks 6515050 to 6532180...\n');

  let totalLogs = 0;
  for (let from = 6515050; from <= 6532180; from += 1000) {
    const to = Math.min(from + 999, 6532180);
    try {
      const logs = await client.getLogs({
        address: CONTRACTS,
        fromBlock: BigInt(from),
        toBlock: BigInt(to),
      });
      if (logs.length > 0) {
        console.log(`Range ${from}-${to}: ${logs.length} logs`);
        for (const l of logs) {
          totalLogs++;
          console.log(`  block=${l.blockNumber} addr=${l.address} topic0=${l.topics[0]?.slice(0, 20)}… txIdx=${l.transactionIndex}`);
        }
      } else {
        process.stdout.write(`\r  ${from}-${to}: 0 logs    `);
      }
    } catch (e: any) {
      console.log(`Range ${from}-${to} error: ${e.message?.slice(0, 100)}`);
    }
  }

  console.log(`\n\nTotal logs found: ${totalLogs}`);

  // Also fetch receipts for the deployment blocks where we saw successful calls
  const knownBlocks = [6515057, 6515089, 6515114, 6515120, 6515170, 6515184, 6515194];
  console.log('\n=== Receipts for known deployment blocks ===');
  for (const bn of knownBlocks) {
    const block = await client.getBlock({ blockNumber: BigInt(bn), includeTransactions: true });
    for (const tx of block.transactions) {
      const receipt = await client.getTransactionReceipt({ hash: tx.hash });
      const to = tx.to || `CREATE→${receipt.contractAddress}`;
      console.log(`block=${bn} status=${receipt.status} to=${to} logs=${receipt.logs.length}`);
      for (const l of receipt.logs) {
        console.log(`  log: addr=${l.address} topics=${JSON.stringify(l.topics.map(t => t.slice(0,20) + '…'))}`);
      }
    }
  }
}

main().catch(console.error);
