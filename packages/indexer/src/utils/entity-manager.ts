import { Adapter, Charge, Merchant, Payout, Plan, Relay, Subscription, User } from "../model";
import { BatchCache } from "./batch-cache";
import { merchantPayoutId } from "./helpers";

type EntityState<T> = {
  entity: T;
  isNew: boolean;
  isDirty: boolean;
  isDeleted: boolean;
};

export class EntityManager {
  public merchants = new Map<string, EntityState<Merchant>>();
  public plans = new Map<string, EntityState<Plan>>();
  public subscriptions = new Map<string, EntityState<Subscription>>();
  public adapters = new Map<string, EntityState<Adapter>>();
  public payouts = new Map<string, EntityState<Payout>>();
  public users = new Map<string, EntityState<User>>();
  public charges = new Map<string, EntityState<Charge>>();
  public relays = new Map<string, EntityState<Relay>>(); // For future use

  constructor(private readonly cache: BatchCache) {
    for (const [id, entity] of cache.merchants) {
      this.register(this.merchants, id, entity, true);
    }
    for (const [id, entity] of cache.plans) {
      this.register(this.plans, id, entity, true);
    }
    for (const [id, entity] of cache.adapters) {
      this.register(this.adapters, id, entity, true);
    }
    for (const [id, entity] of cache.payouts) {
      this.register(this.payouts, id, entity, true);
    }
    for (const [id, entity] of cache.subscriptions) {
        this.register(this.subscriptions, id, entity, true);
    }
    for (const [id, entity] of cache.users) {
        this.register(this.users, id, entity, true);
    }
    for (const [id, entity] of cache.charges) {
        this.register(this.charges, id, entity, true);
    }
    for (const [id, entity] of cache.relays) {
        this.register(this.relays, id, entity, true);
    }
  }

  private register<T>(
    map: Map<string, EntityState<T>>,
    id: string,
    entity: T,
    isNew = false,
  ) {
    map.set(id, {
      entity,
      isNew,
      isDirty: isNew,
      isDeleted: false,
    });
  }

  private markDirty<T>(map: Map<string, EntityState<T>>, id: string) {
    const state = map.get(id);
    if (!state || state.isDeleted) return;

    if (!state.isNew) {
      state.isDirty = true;
    }
  }

  getMerchant(id: string) {
    let m = this.merchants.get(id);
    if (m) {
      return m.entity;
    }
  }

  createMerchant(m: Merchant) {
    this.register(this.merchants, m.id, m, true);
    return m;
  }

  updateMerchant(id: string, patch: Partial<Merchant>) {
    const merchant = this.getMerchant(id);
    if (!merchant) return;

    Object.assign(merchant, patch);
    this.markDirty(this.merchants, id);
  }

  getPlan(id: string) {
    let p = this.plans.get(id);
    if (p) {
      return p.entity;
    }
  }

  createPlan(plan: Plan) {
    this.register(this.plans, plan.id, plan, true);
    return plan;
  }

  updatePlan(id: string, patch: Partial<Plan>) {
    const plan = this.getPlan(id);
    if (!plan) return;

    Object.assign(plan, patch);
    this.markDirty(this.plans, id);
  }

  getAdapter(id: string) {
    let a = this.adapters.get(id);
    if (a) {
      return a.entity;
    }
  }

  createAdapter(a: Adapter) {
    this.register(this.adapters, a.id, a, true);
    return a;
  }

  updateAdapter(id: string, patch: Partial<Adapter>) {
    const adapter = this.getAdapter(id);
    if (!adapter) return;

    Object.assign(adapter, patch);
    this.markDirty(this.adapters, id);
  }

  getSubscription(sub: string) {
    const s = this.subscriptions.get(sub);
    if (s) {
      return s.entity;
    }
  }

  createSubscription(s: Subscription) {
    this.register(this.subscriptions, s.id, s, true);
    return s;
  }

  updateSubscription(id: string, patch: Partial<Subscription>) {
    const sub = this.getSubscription(id);
    if (!sub) return;

    Object.assign(sub, patch);
    this.markDirty(this.subscriptions, id);
  }

  getUser(id: string) {
    let u = this.users.get(id);
    if (u) {
     return u.entity;
    }
  }

  createUser(u: User) {
    this.register(this.users, u.id, u, true);
    return u;
  }

  updateUser(id: string, patch: Partial<User>) {
    const user = this.getUser(id);
    if (!user) return;

    Object.assign(user, patch);
    this.markDirty(this.users, id);
  }

  getPayout(id: string) {
    const p = this.payouts.get(id);
    if (p) {
      return p.entity;
    }
  }

  createPayout(payout: Payout) {
    this.register(this.payouts, payout.id, payout, true);
    return payout;
  }

  updatePayout(id: string, patch: Partial<Payout>) {
    const payout = this.getPayout(id);
    if (!payout) return;

    Object.assign(payout, patch);
    this.markDirty(this.payouts, id);
  }

  getCharge(id: string) {
    const ch = this.charges.get(id);
    if (ch) {
      return ch.entity;
    }
  }

  createCharge(ch: Charge) {
    this.register(this.charges, ch.id, ch, true);
    return ch;
  }

  updateCharge(id: string, patch: Partial<Charge>) {
    const charge = this.getCharge(id);
    if (!charge) return;

    Object.assign(charge, patch);
    this.markDirty(this.charges, id);
  }

  /** Get all payouts for a merchant (works in-batch) */
  getPayoutsForMerchant(merchantId: string): Payout[] {
    const result: Payout[] = [];
    this.payouts.forEach(({ entity }) => {
      if (entity.merchant?.id === merchantId) result.push(entity);
    });
    return result;
  }

  /** Find payout by merchant and chainId */
  getPayoutByMerchantAndChain(merchantId: string, chainId: number): Payout | undefined {
    const payoutId = merchantPayoutId(merchantId, BigInt(chainId));
    const payout = this.getPayout(payoutId);
    if (payout) {
      return payout;
    }

    for (const [, { entity }] of this.payouts) {
      if (entity.merchant?.id === merchantId && entity.chainId === chainId) {
        return entity;
      }
    }
    return undefined;
  }

  /** Get all subscriptions for a user (works in-batch) */
  getSubscriptionsForUser(userId: string): Subscription[] {
    const result: Subscription[] = [];
    this.subscriptions.forEach(({ entity }) => {
      if (entity.user?.id === userId) result.push(entity);
    });
    return result;
  }

  /** Get all subscriptions for a merchant (works in-batch) */
  getSubscriptionsForMerchant(merchantId: string): Subscription[] {
    const result: Subscription[] = [];
    this.subscriptions.forEach(({ entity }) => {
      if (entity.merchant?.id === merchantId) result.push(entity);
    });
    return result;
  }

  /** Get all subscriptions for a plan (works in-batch) */
  getSubscriptionsForPlan(planId: string): Subscription[] {
    const result: Subscription[] = [];
    this.subscriptions.forEach(({ entity }) => {
      if (entity.plan?.id === planId) result.push(entity);
    });
    return result;
  }

  /** Get all plans for a merchant (works in-batch) */
  getPlansForMerchant(merchantId: string): Plan[] {
    const result: Plan[] = [];
    this.plans.forEach(({ entity }) => {
      if (entity.merchant?.id === merchantId) result.push(entity);
    });
    return result;
  }

  /** Update all subscriptions for a user */
  updateSubscriptionsForUser(userId: string, patch: Partial<Subscription>) {
    this.subscriptions.forEach(({ entity }) => {
      if (entity.user?.id === userId) {
        Object.assign(entity, patch);
        this.markDirty(this.subscriptions, entity.id);
      }
    });
  }

  /** Update all subscriptions for a plan */
  updateSubscriptionsForPlan(planId: string, patch: Partial<Subscription>) {
    this.subscriptions.forEach(({ entity }) => {
      if (entity.plan?.id === planId) {
        Object.assign(entity, patch);
        this.markDirty(this.subscriptions, entity.id);
      }
    });
  }

  getRelay(id: string) {
    const r = this.relays.get(id);
    if (r) {
      return r.entity;
    }
  }

  createRelay(r: Relay) {
    this.register(this.relays, r.id, r, true);
    return r;
  }

  updateRelay(id: string, patch: Partial<Relay>) {
    const relay = this.getRelay(id);
    if (!relay) return;

    Object.assign(relay, patch);
    this.markDirty(this.relays, id);
  }
}
