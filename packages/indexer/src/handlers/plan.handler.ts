import * as planRegAbi from "../abi/plan-registry";
import { Plan, Status } from "../model";
import { EntityManager } from "../utils/entity-manager";

export function handleCreatePlan(log: any, em: EntityManager) {
  const { planId, price, interval, merchantId, metadata } =
    planRegAbi.events.PlanCreated.decode(log);

  // Skip if plan already exists
  if (em.getPlan(planId.toString())) return;

  const merchant = em.getMerchant(merchantId.toLowerCase());
  if (!merchant) return;

  const plan = new Plan({
    id: planId.toString(),
    merchant,
    price,
    billingInterval: Number(interval),
    grace: 0,
    status: Status.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    metadataUri: metadata,
  });

  em.createPlan(plan);
}

export function handlePlanUpdated(log: any, em: EntityManager) {
  const { active, grace, planId, price } =
    planRegAbi.events.PlanUpdated.decode(log);

  const plan = em.getPlan(planId.toString());
  if (!plan) return;

  em.updatePlan(planId.toString(), {
    price,
    grace: Number(grace),
    status: active ? Status.ACTIVE : Status.PAUSED,
    updatedAt: new Date(),
  });
}
