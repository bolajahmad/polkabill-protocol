/**
 * Diagnostic: test what the RPC actually returns for a known block with events
 */
import { createPublicClient, http } from 'viem';

const RPC = process.env.RPC_ASSETHUB_HTTP ?? 'https://eth-rpc-testnet.polkadot.io/';
const TARGET_BLOCK = 6532338n; // Known block with registerChain event

const CONTRACTS = [
  '0xc1c8c9b92AB6083609E29193929852883c66D32a',
  '0x1d8C64CA9E08AbF56b832edC9606c4Eec7889059',
  '0xbBa26e6278D6eD710f881633E780A9C3b23a3BAb',
  '0x75704c73bdD5Ce0dd843ea4AAa375099c133E669',
  '0x6D73534191353E714F607D6b3C08425987131C19',
].map(a => a.toLowerCase());

async function main() {
  const client = createPublicClient({ transport: http(RPC) });

  console.log(`\n=== RPC: ${RPC} ===`);
  console.log(`=== Target block: ${TARGET_BLOCK} ===\n`);

  // 1) getBlockNumber
  const head = await client.getBlockNumber();
  console.log(`Chain head: ${head}\n`);

  // 2) getBlock WITHOUT transactions
  console.log('--- getBlock (no txs) ---');
  const blockNoTx = await client.getBlock({ blockNumber: TARGET_BLOCK });
  console.log(`  hash: ${blockNoTx.hash}`);
  console.log(`  timestamp: ${blockNoTx.timestamp}`);
  console.log(`  transactions count: ${blockNoTx.transactions.length}`);
  console.log(`  logsBloom empty: ${blockNoTx.logsBloom === '0x' + '0'.repeat(512)}`);
  if (blockNoTx.transactions.length > 0) {
    console.log(`  first 3 tx hashes:`, blockNoTx.transactions.slice(0, 3));
  }

  // 3) getBlock WITH transactions
  console.log('\n--- getBlock (with txs) ---');
  const blockWithTx = await client.getBlock({ blockNumber: TARGET_BLOCK, includeTransactions: true });
  console.log(`  transactions count: ${blockWithTx.transactions.length}`);
  if (blockWithTx.transactions.length > 0) {
    for (const tx of blockWithTx.transactions.slice(0, 5)) {
      console.log(`  tx: hash=${tx.hash} to=${tx.to} from=${tx.from}`);
      const isOurContract = tx.to && CONTRACTS.includes(tx.to.toLowerCase());
      console.log(`    → targets our contract: ${isOurContract}`);
    }
  }

  // 4) eth_getLogs for the target block
  console.log('\n--- getLogs (target block) ---');
  try {
    const logs = await client.getLogs({
      fromBlock: TARGET_BLOCK,
      toBlock: TARGET_BLOCK,
    });
    console.log(`  logs count (no filter): ${logs.length}`);
    if (logs.length > 0) {
      for (const l of logs.slice(0, 5)) {
        console.log(`  log: addr=${l.address} topic0=${l.topics[0]?.slice(0, 18)}…`);
      }
    }
  } catch (e: any) {
    console.log(`  getLogs error: ${e.message?.slice(0, 200)}`);
  }

  // 5) getLogs filtered by our contract addresses
  console.log('\n--- getLogs (our contracts) ---');
  try {
    const logs = await client.getLogs({
      address: CONTRACTS as `0x${string}`[],
      fromBlock: TARGET_BLOCK,
      toBlock: TARGET_BLOCK,
    });
    console.log(`  logs count: ${logs.length}`);
    for (const l of logs) {
      console.log(`  log: addr=${l.address} topic0=${l.topics[0]?.slice(0, 18)}…`);
    }
  } catch (e: any) {
    console.log(`  getLogs error: ${e.message?.slice(0, 200)}`);
  }

  // 6) If we got transactions, fetch their receipts
  if (blockWithTx.transactions.length > 0) {
    console.log('\n--- Transaction receipts ---');
    for (const tx of blockWithTx.transactions.slice(0, 5)) {
      try {
        const receipt = await client.getTransactionReceipt({ hash: tx.hash });
        console.log(`  receipt for ${tx.hash.slice(0, 18)}…: status=${receipt.status} logs=${receipt.logs.length}`);
        for (const l of receipt.logs) {
          console.log(`    log: addr=${l.address} topic0=${l.topics[0]?.slice(0, 18)}…`);
          const isOurs = CONTRACTS.includes(l.address.toLowerCase());
          console.log(`      → matches our contract: ${isOurs}`);
        }
      } catch (e: any) {
        console.log(`  receipt error for ${tx.hash.slice(0, 18)}…: ${e.message?.slice(0, 200)}`);
      }
    }
  }

  // 7) Try raw JSON-RPC for eth_getBlockReceipts
  console.log('\n--- eth_getBlockReceipts (raw) ---');
  try {
    const resp = await fetch(RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1,
        method: 'eth_getBlockReceipts',
        params: ['0x' + TARGET_BLOCK.toString(16)],
      }),
    });
    const json = await resp.json() as any;
    if (json.error) {
      console.log(`  error: ${JSON.stringify(json.error)}`);
    } else if (json.result) {
      console.log(`  receipts count: ${json.result.length}`);
      for (const r of json.result.slice(0, 5)) {
        console.log(`  receipt: txHash=${r.transactionHash?.slice(0, 18)}… logs=${r.logs?.length ?? 0}`);
      }
    } else {
      console.log(`  result: null`);
    }
  } catch (e: any) {
    console.log(`  fetch error: ${e.message?.slice(0, 200)}`);
  }

  // 8) Also check a wider block range with getLogs (maybe the event is at a different block)
  console.log('\n--- getLogs wider range (6532300-6532400) ---');
  try {
    const logs = await client.getLogs({
      address: CONTRACTS as `0x${string}`[],
      fromBlock: 6532300n,
      toBlock: 6532400n,
    });
    console.log(`  logs count: ${logs.length}`);
    for (const l of logs.slice(0, 10)) {
      console.log(`  block=${l.blockNumber} addr=${l.address} topic0=${l.topics[0]?.slice(0, 18)}…`);
    }
  } catch (e: any) {
    console.log(`  getLogs error: ${e.message?.slice(0, 200)}`);
  }
}

main().catch(console.error);
