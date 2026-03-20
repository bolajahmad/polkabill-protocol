import { DataSource, In } from "typeorm";
import { Adapter, Charge, Merchant, Payout, Plan, Relay, Subscription, User } from "../model";
import { BatchCache } from "./batch-cache";
import { collectIds } from "./collect-ids";

export async function preloadEntities(
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

  if (ids.charges.size) {
    const rows = await ds.getRepository(Charge).find({
      where: { id: In([...ids.charges]) },
      relations: { subscription: true, adapter: true },
    });
    rows.forEach((s) => cache.charges.set(s.id, s));
  }

  if (ids.users.size) {
    const rows = await ds.getRepository(User).find({
      where: { id: In([...ids.users]) },
      relations: { subscriptions: true },
    });
    rows.forEach((u) => cache.users.set(u.id, u));
  }

  if (ids.relays.size) {
    const rows = await ds.getRepository(Relay).find({
      where: { id: In([...ids.relays]) },
      relations: { adapter: true, merchant: true },
    });
    rows.forEach((s) => cache.relays.set(s.id, s));
  }
}
