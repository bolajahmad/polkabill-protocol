import { In } from "typeorm";
import { BatchCache } from "./batch-cache";
import { StoreContext } from "./helpers";
import { Adapter, Merchant, Payout, Plan } from "../model";

export async function preloadEntities(
  ctx: StoreContext,
  cache: BatchCache,
  ids: {
    merchants: Set<string>;
    plans: Set<bigint>;
    adapters: Set<bigint>;
    payouts: Set<string>;
  },
) {
  if (ids.merchants.size) {
    const rows = await ctx.store.findBy(Merchant, {
      id: In([...ids.merchants]),
    });
    rows.forEach((r) => cache.merchants.set(r.id, r));
  }

  if (ids.plans.size) {
    const rows = await ctx.store.findBy(Plan, {
      id: In([...ids.plans]),
    });
    rows.forEach((r) => cache.plans.set(r.id, r));
  }

  if (ids.adapters.size) {
    const rows = await ctx.store.findBy(Adapter, {
      id: In([...ids.adapters]),
    });
    rows.forEach((a) => cache.adapters.set(a.id, a));
  }

  if (ids.payouts.size) {
    const rows = await ctx.store.findBy(Payout, {
      id: In([...ids.payouts]),
    });
    rows.forEach((p) => cache.payouts.set(p.id, p));
  }
}
