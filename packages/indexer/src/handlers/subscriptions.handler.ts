import * as subManagerAbi from "../abi/subscriptions-manager";
import { Subscription, SubscriptionStatus, User } from "../model";
import { EntityManager } from "../utils/entity-manager";

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

  const id = subId.toString();

  if (em.getSubscription(id)) return;

  const plan = em.getPlan(planId.toString());
  if (!plan) {
    console.error("Plan missing for subscription", planId.toString());
    return;
  }

  const now = BigInt(log.block.timestamp);
  const userId = subscriber.toLowerCase();

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
    id,
    plan,
    merchant: plan.merchant,
    user,
    status: SubscriptionStatus.ACTIVE,
    startTime: now,
    nextBillingTime: now + BigInt(plan.billingInterval),
    billingCycle: 1n,
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
