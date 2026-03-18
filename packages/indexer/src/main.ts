/**
 * Custom resilient event poller — replaces the Subsquid EvmBatchProcessor.
 *
 * Uses eth_getLogs directly via viem to fetch contract events, with cursor
 * tracking via a _poller_status table. Reuses the same handlers, entity
 * management, and DB schema as the original Subsquid-based indexer.
 */
import { DataSource, In } from 'typeorm';
import { createPublicClient, http } from 'viem';
import * as chainRegAbi from './abi/chain-registry';
import * as merchantRegAbi from './abi/merchant-registry';
import * as planRegAbi from './abi/plan-registry';
import * as subControllerAbi from './abi/subscriptions-controller';
import * as subManagerAbi from './abi/subscriptions-manager';
import {
  handleChainRegistered,
  handleChainStatusUpdated,
  handleUpdateSupportedChainTokens,
} from './handlers/adapter.handler';
import { handleChargeConfirmed, handleChargeRequestRelayed } from './handlers/charge.handler';
import {
  handleMerchantCreated,
  handleMerchantStatusUpdated,
  handleMerchantUpdated,
  handlePayoutAddressSet,
  handleTokensAdded,
} from './handlers/merchant.handler';
import { handleCreatePlan, handlePlanUpdated } from './handlers/plan.handler';
import {
  handlePlanChanged,
  handleSubscriptionPaid,
  handleSubscriptionUpdated,
  handleUserSubscribed,
  handleUserUpdateSubscribedPlan,
} from './handlers/subscriptions.handler';
import { Adapter, Charge, Merchant, Payout, Plan, Subscription, User } from './model';
import { BatchCache } from './utils/batch-cache';
import { collectIds } from './utils/collect-ids';
import { EntityManager } from './utils/entity-manager';
import { Contracts, networkConfig } from './utils/network-config';

// ─── Configuration ──────────────────────────────────────────────────────────
const BATCH_SIZE = Number(process.env.POLL_BATCH_SIZE ?? 100);
const POLL_INTERVAL = Number(process.env.POLL_INTERVAL_MS ?? 12_000);
const RETRY_DELAY = 10_000;

const CONTRACT_ADDRESSES = Object.values(Contracts).map(
  (a) => a.toLowerCase() as `0x${string}`,
);

// ─── Shaped log compatible with existing handlers / collectIds ──────────────
interface IndexerLog {
  data: string;
  topics: string[];
  address: string;
  transactionHash: string;
  block: { height: number; timestamp: number };
}

// ─── Database ───────────────────────────────────────────────────────────────
function createDataSource(): DataSource {
  return new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    database: process.env.DB_NAME ?? 'squid',
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASS ?? 'postgres',
    entities: [User, Merchant, Payout, Plan, Adapter, Subscription, Charge],
    synchronize: false,
  });
}

// ─── Cursor tracking ────────────────────────────────────────────────────────
async function ensureCursorTable(ds: DataSource): Promise<void> {
  await ds.query(`
    CREATE TABLE IF NOT EXISTS _poller_status (
      id TEXT PRIMARY KEY DEFAULT 'main',
      height INT NOT NULL
    )
  `);
}

async function getCursor(ds: DataSource): Promise<number> {
  const rows = await ds.query(
    `SELECT height FROM _poller_status WHERE id = 'main'`,
  );
  return rows.length > 0 ? rows[0].height : networkConfig.startAtBlock - 1;
}

async function setCursor(ds: DataSource, height: number): Promise<void> {
  await ds.query(
    `INSERT INTO _poller_status (id, height) VALUES ('main', $1)
     ON CONFLICT (id) DO UPDATE SET height = $1`,
    [height],
  );
}

// ─── Preload (adapted from original, uses DataSource directly) ──────────────
async function preloadEntities(
  ds: DataSource,
  cache: BatchCache,
  ids: ReturnType<typeof collectIds>,
): Promise<void> {
  if (ids.merchants.size) {
    const rows = await ds
      .getRepository(Merchant)
      .findBy({ id: In([...ids.merchants]) });
    rows.forEach((r) => cache.merchants.set(r.id, r));
  }
  if (ids.plans.size) {
    const rows = await ds.getRepository(Plan).find({
      where: { id: In([...ids.plans].map(String)) },
      relations: { merchant: true },
    });
    rows.forEach((r) => cache.plans.set(r.id, r));
  }
  if (ids.adapters.size) {
    const rows = await ds
      .getRepository(Adapter)
      .findBy({ id: In([...ids.adapters].map(String)) });
    rows.forEach((a) => cache.adapters.set(a.id, a));
  }
  if (ids.payouts.size) {
    const rows = await ds.getRepository(Payout).find({
      where: { id: In([...ids.payouts]) },
      relations: { merchant: true },
    });
    rows.forEach((p) => cache.payouts.set(p.id, p));
  }
  if (ids.subscriptions.size) {
    const rows = await ds.getRepository(Subscription).find({
      where: { id: In([...ids.subscriptions]) },
      relations: { plan: true, user: true, merchant: true },
    });
    rows.forEach((s) => cache.subscriptions.set(s.id, s));
  }
}

// ─── Save entities in FK-safe order ─────────────────────────────────────────
async function saveEntities(
  ds: DataSource,
  em: EntityManager,
): Promise<void> {
  const collect = <T>(map: Map<string, { entity: T }>): T[] => {
    const arr: T[] = [];
    map.forEach(({ entity }) => arr.push(entity));
    return arr;
  };

  const users = collect(em.users);
  const adapters = collect(em.adapters);
  const merchants = collect(em.merchants);
  const payouts = collect(em.payouts);
  const plans = collect(em.plans);
  const subscriptions = collect(em.subscriptions);
  const charges = collect(em.charges);

  if (users.length) await ds.getRepository(User).save(users);
  if (adapters.length) await ds.getRepository(Adapter).save(adapters);
  if (merchants.length) await ds.getRepository(Merchant).save(merchants);
  if (payouts.length) await ds.getRepository(Payout).save(payouts);
  if (plans.length) await ds.getRepository(Plan).save(plans);
  if (subscriptions.length)
    await ds.getRepository(Subscription).save(subscriptions);
  if (charges.length) await ds.getRepository(Charge).save(charges);
}

// ─── Process a single log (same logic as the original main.ts) ──────────────
function processLog(log: IndexerLog, em: EntityManager): void {
  const topic = log.topics[0];
  if (topic === merchantRegAbi.events.MerchantCreated.topic) {
    handleMerchantCreated(log, em);
  } else if (topic === merchantRegAbi.events.MerchantUpdated.topic) {
    handleMerchantUpdated(log, em);
  } else if (topic === merchantRegAbi.events.MerchantStatusUpdated.topic) {
    handleMerchantStatusUpdated(log, em);
  } else if (topic === merchantRegAbi.events.PayoutAddressSet.topic) {
    handlePayoutAddressSet(log, em);
  } else if (topic === merchantRegAbi.events.TokensAdded.topic) {
    handleTokensAdded(log, em);
  } else if (topic === planRegAbi.events.PlanCreated.topic) {
    handleCreatePlan(log, em);
  } else if (topic === planRegAbi.events.PlanUpdated.topic) {
    handlePlanUpdated(log, em);
  } else if (topic === chainRegAbi.events.ChainRegistered.topic) {
    handleChainRegistered(log, em);
  } else if (topic === chainRegAbi.events.ChainStatusUpdated.topic) {
    handleChainStatusUpdated(log, em);
  } else if (topic === chainRegAbi.events.TokenSupportUpdated.topic) {
    handleUpdateSupportedChainTokens(log, em);
  } else if (topic === subManagerAbi.events.Subscribed.topic) {
    handleUserSubscribed(log, em);
  } else if (topic === subManagerAbi.events.PlanChangeScheduled.topic) {
    handleUserUpdateSubscribedPlan(log, em);
  } else if (topic === subManagerAbi.events.PlanChanged.topic) {
    handlePlanChanged(log, em);
  } else if (topic === subManagerAbi.events.SubscriptionPaid.topic) {
    handleSubscriptionPaid(log, em);
  } else if (topic === subManagerAbi.events.SubscriptionUpdated.topic) {
    handleSubscriptionUpdated(log, em);
  } else if (topic === subControllerAbi.events.ChargeRequestRelayed.topic) {
    handleChargeRequestRelayed(log, em);
  } else if (topic === subControllerAbi.events.ChargeConfirmed.topic) {
    handleChargeConfirmed(log, em);
  }
}

// ─── Fetch logs via eth_getLogs for a block range ───────────────────────────
async function fetchLogs(
  client: ReturnType<typeof createPublicClient>,
  fromBlock: number,
  toBlock: number,
): Promise<IndexerLog[]> {
  const rawLogs = await client.getLogs({
    address: CONTRACT_ADDRESSES,
    fromBlock: BigInt(fromBlock),
    toBlock: BigInt(toBlock),
  });

  if (rawLogs.length === 0) return [];

  // We need timestamps for each block that has logs
  const blockNums = [...new Set(rawLogs.map((l) => Number(l.blockNumber)))];
  const blockTimestamps = new Map<number, number>();
  await Promise.all(
    blockNums.map(async (bn) => {
      const block = await client.getBlock({ blockNumber: BigInt(bn) });
      blockTimestamps.set(bn, Number(block.timestamp));
    }),
  );

  return rawLogs.map((l) => ({
    data: l.data,
    topics: [...l.topics],
    address: l.address.toLowerCase(),
    transactionHash: l.transactionHash,
    block: {
      height: Number(l.blockNumber),
      timestamp: blockTimestamps.get(Number(l.blockNumber)) ?? 0,
    },
  }));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Main polling loop ──────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log('PolkaBill Event Poller starting…');

  const ds = createDataSource();
  await ds.initialize();
  await ensureCursorTable(ds);
  console.log('Database connected');

  const client = createPublicClient({
    transport: http(networkConfig.rpcEndpoint),
  });

  let cursor = await getCursor(ds);
  console.log(`Resuming from block ${cursor + 1}`);

  while (true) {
    try {
      const chainHead = Number(await client.getBlockNumber());
      const safeHead = chainHead - networkConfig.finalityConfirmation;

      if (cursor >= safeHead) {
        console.log(`Waiting for new blocks… head=${chainHead} safe=${safeHead} cursor=${cursor}`);
        await sleep(POLL_INTERVAL);
        continue;
      }

      const from = cursor + 1;
      const to = Math.min(from + BATCH_SIZE - 1, safeHead);

      // Fetch logs for the entire batch via eth_getLogs
      const allLogs = await fetchLogs(client, from, to);

      if (allLogs.length > 0) {
        // Group logs by block, sorted ascending
        const blockMap = new Map<number, IndexerLog[]>();
        for (const log of allLogs) {
          const bn = log.block.height;
          if (!blockMap.has(bn)) blockMap.set(bn, []);
          blockMap.get(bn)!.push(log);
        }

        const blocks = [...blockMap.entries()]
          .sort(([a], [b]) => a - b)
          .map(([, logs]) => ({ logs }));

        // Run through the standard processing pipeline
        const cache = new BatchCache();
        const ids = collectIds(blocks as any);
        await preloadEntities(ds, cache, ids);
        const em = new EntityManager(cache);

        for (const block of blocks) {
          for (const log of block.logs) {
            try {
              processLog(log, em);
            } catch (err) {
              console.warn(
                `Failed processing log ${log.transactionHash}:`,
                err,
              );
            }
          }
        }

        await saveEntities(ds, em);
        console.log(
          `Processed ${allLogs.length} log(s) in blocks ${from}–${to}`,
        );
      } else {
        console.log(`Blocks ${from}–${to}: no relevant logs`);
      }

      cursor = to;
      await setCursor(ds, cursor);
    } catch (err) {
      console.error('Processing error, retrying in 10s:', err);
      await sleep(RETRY_DELAY);
    }
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
