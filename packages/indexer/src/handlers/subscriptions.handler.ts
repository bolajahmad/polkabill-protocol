import { EntityManager } from "../utils/entity-manager";
import * as subManagerAbi from "../abi/subscriptions-manager";
import { Subscription, SubscriptionStatus, User } from "../model";

const SubStatusMap = {
  0: SubscriptionStatus.INACTIVE,
  1: SubscriptionStatus.ACTIVE,
  2: SubscriptionStatus.PAST_DUE,
  3: SubscriptionStatus.CANCELLED,
  4: SubscriptionStatus.EXPIRED,
};

export function handleUserSubscribed(log: any, em: EntityManager) {
  const { planId, subId, subscriber } =
    subManagerAbi.events.Subscribed.decode(log);
  
  // Skip if subscription already exists
  if (em.getSubscription(subId.toString())) return;

  const plan = em.getPlan(planId.toString());
  if (!plan) return;

  const now = Math.floor(Date.now() / 1000);
  const userId = subscriber.toLowerCase();

  // Get or create user
  let user = em.getUser(userId);
  if (!user) {
    user = new User({
      id: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    em.createUser(user);
  }

  const sub = new Subscription({
    id: subId.toString(),
    plan,                              // FK → Plan
    merchant: plan.merchant,           // FK → Merchant
    user,                              // FK → User
    status: SubscriptionStatus.ACTIVE,
    startTime: BigInt(now),
    nextBillingTime: BigInt(now + plan.billingInterval),
    billingCycle: 1n,                  // First billing cycle
    cancelledAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  em.createSubscription(sub);
}

export function handleSubscriptionUpdated(log: any, em: EntityManager) {
  const { status, subscriptionId } =
    subManagerAbi.events.SubscriptionUpdated.decode(log);
  const sub = em.getSubscription(subscriptionId.toString());
  if (!sub) return;

  sub.status = SubStatusMap[status as keyof typeof SubStatusMap];
  sub.updatedAt = new Date();
  em.updateSubscription(subscriptionId.toString(), sub);
}

export function handleSubscriptionPaid(log: any, em: EntityManager) {
  const { _nextCharge, billingCycle, subscriptionId } =
    subManagerAbi.events.SubscriptionPaid.decode(log);
  const sub = em.getSubscription(subscriptionId.toString());
  if (!sub) return;

  sub.nextBillingTime = _nextCharge;
  sub.billingCycle = billingCycle;
  sub.updatedAt = new Date();
  em.updateSubscription(subscriptionId.toString(), sub);
}
