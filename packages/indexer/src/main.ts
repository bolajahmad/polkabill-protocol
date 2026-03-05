// TypeormDatabase is the class responsible for data storage.
import { TypeormDatabase } from "@subsquid/typeorm-store";
import * as chainRegAbi from "./abi/chain-registry";
import * as merchantRegAbi from "./abi/merchant-registry";
import * as planRegAbi from "./abi/plan-registry";
import * as subControllerAbi from "./abi/subscriptions-controller";
import * as subManagerAbi from "./abi/subscriptions-manager";
import {
  handleChainRegistered,
  handleChainStatusUpdated,
  handleUpdateSupportedChainTokens,
} from "./handlers/adapter.handler";
import { handleChargeConfirmed, handleChargeRequestRelayed } from "./handlers/charge.handler";
import {
  handleMerchantStatusUpdated,
  handleMerchantUpdated,
  handlePayoutAddressSet,
  handleTokensAdded,
} from "./handlers/merchant.handler";
import { handleCreatePlan, handlePlanUpdated } from "./handlers/plan.handler";
import {
  handleSubscriptionPaid,
  handleSubscriptionUpdated,
  handleUserSubscribed,
} from "./handlers/subscriptions.handler";
import {
  Adapter,
  Charge,
  Merchant,
  Payout,
  Plan,
  Subscription,
  User
} from "./model";
import { makeProcessor } from "./processor";
import { BatchCache } from "./utils/batch-cache";
import { collectIds } from "./utils/collect-ids";
import { EntityManager } from "./utils/entity-manager";
import { networkConfig } from "./utils/network-config";
import { preloadEntities } from "./utils/preload";

async function processLog(log: any, store: EntityManager) {
  if (log.topics[0] == merchantRegAbi.events.MerchantUpdated.topic) {
    handleMerchantUpdated(log, store);
  } else if (
    log.topics[0] == merchantRegAbi.events.MerchantStatusUpdated.topic
  ) {
    handleMerchantStatusUpdated(log, store);
  } else if (log.topics[0] == merchantRegAbi.events.PayoutAddressSet.topic) {
    handlePayoutAddressSet(log, store);
  } else if (log.topics[0] == merchantRegAbi.events.TokensAdded.topic) {
    handleTokensAdded(log, store);
  } else if (log.topics[0] == planRegAbi.events.PlanCreated.topic) {
    handleCreatePlan(log, store);
  } else if (log.topics[0] == planRegAbi.events.PlanUpdated.topic) {
    handlePlanUpdated(log, store);
  } else if (log.topics[0] == chainRegAbi.events.ChainRegistered.topic) {
    handleChainRegistered(log, store);
  } else if (log.topics[0] == chainRegAbi.events.ChainStatusUpdated.topic) {
    handleChainStatusUpdated(log, store);
  } else if (log.topics[0] == chainRegAbi.events.TokenSupportUpdated.topic) {
    handleUpdateSupportedChainTokens(log, store);
  } else if (log.topics[0] == subManagerAbi.events.Subscribed.topic) {
    handleUserSubscribed(log, store);
  } else if (log.topics[0] == subManagerAbi.events.SubscriptionPaid.topic) {
    handleSubscriptionPaid(log, store);
  } else if (log.topics[0] == subManagerAbi.events.SubscriptionUpdated.topic) {
    handleSubscriptionUpdated(log, store);
  } else if (log.topics[0] == subControllerAbi.events.ChargeRequestRelayed.topic) {
    handleChargeRequestRelayed(log, store)
  } else if (log.topics[0] == subControllerAbi.events.ChargeConfirmed.topic) {
    handleChargeConfirmed(log, store)
  } else {
    return;
  }
}

const processor = makeProcessor(networkConfig);
const db = new TypeormDatabase({ supportHotBlocks: true });

processor.run(db, async (ctx) => {
  const cache = new BatchCache();
  const ids = collectIds(ctx.blocks);
  await preloadEntities(ctx, cache, ids);

  const em = new EntityManager(cache);

  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      await processLog(log, em);
    }
  }
  const merchants: Merchant[] = [];
  em.merchants.forEach(({ entity }) => merchants.push(entity));

  const plans: Plan[] = [];
  em.plans.forEach(({ entity }) => plans.push(entity));

  const adapters: Adapter[] = [];
  em.adapters.forEach(({ entity }) => adapters.push(entity));

  const payouts: Payout[] = [];
  em.payouts.forEach(({ entity }) => payouts.push(entity));

  const subscriptions: Subscription[] = [];
  em.subscriptions.forEach(({ entity }) => subscriptions.push(entity));

  const charges: Charge[] = [];
  em.charges.forEach(({ entity }) => charges.push(entity));

  const users: User[] = [];
  em.users.forEach(({ entity }) => users.push(entity));

  await ctx.store.save(adapters);
  await ctx.store.save(merchants);
  await ctx.store.save(payouts);
  await ctx.store.save(plans);
  await ctx.store.save(users);
  await ctx.store.save(subscriptions);
  await ctx.store.save(charges);
});
