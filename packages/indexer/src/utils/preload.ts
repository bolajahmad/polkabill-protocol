import { In } from "typeorm";
import { Adapter, Charge, Merchant, Payout, Plan, Subscription, User } from "../model";
import { BatchCache } from "./batch-cache";
import { StoreContext } from "./helpers";

export async function preloadEntities(
  ctx: StoreContext,
  cache: BatchCache,
  ids: {
    merchants: Set<string>;
    plans: Set<bigint>;
    adapters: Set<bigint>;
    payouts: Set<string>;
    subscriptions: Set<string>;
    users: Set<string>;
    charges: Set<string>;
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

  if (ids.subscriptions.size) {
    const rows = await ctx.store.findBy(Subscription, {
      id: In([...ids.subscriptions]),
    });
    rows.forEach((s) => cache.subscriptions.set(s.id, s));
  }

  if (ids.users.size) {
    const rows = await ctx.store.findBy(User, {
      id: In([...ids.users]),
    });
    rows.forEach((u) => cache.users.set(u.id, u));
  }

  if (ids.charges.size) {
    const rows = await ctx.store.findBy(Charge, {
      id: In([...ids.charges]),
    });
    rows.forEach((c) => cache.charges.set(c.id, c));
  }
}
