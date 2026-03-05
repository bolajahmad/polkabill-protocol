import { EntityManager } from "../utils/entity-manager";
import * as subControllerAbi from "../abi/subscriptions-controller";
import { Charge } from "../model";
import { decodeChargeRequestParams } from "../utils/helpers";
import { encodePacked, keccak256 } from "viem";

export function handleChargeRequestRelayed(log: any, em: EntityManager) {
  const { body, chainId } =
    subControllerAbi.events.ChargeRequestRelayed.decode(log);

  // Check that adapter exists
  const adapterEntity = em.getAdapter(chainId.toString());
  if (!adapterEntity) return;

  const decodedParams = decodeChargeRequestParams(body as `0x${string}`);
  if (!decodedParams) return;

  const { subId, price, token, cycle, payout } = decodedParams;

  const sub = em.getSubscription(subId.toString());
  if (!sub) return;

  const chargeId = keccak256(
    encodePacked(["string", "uint256"], [subId.toString(), cycle]),
  );

  // Check if charge already exists
  const existingCharge = em.getCharge(chargeId);

  if (existingCharge) {
    // Update existing charge
    em.updateCharge(chargeId, {
      amount: price,
      token,
      payoutAddress: payout,
      txHash: log.transactionHash,
    });
  } else {
    // Create new charge with all required fields
    const charge = new Charge({
      id: chargeId,
      subscription: sub,           // FK → Subscription
      adapter: adapterEntity,      // FK → Adapter
      amount: price,
      chainId: Number(chainId),
      token,
      payoutAddress: payout,
      billingCycle: cycle,
      txHash: log.transactionHash,
      blockNumber: BigInt(log.block.height),
      success: false,              // Default to false, set true when confirmed
      createdAt: new Date(),
    });

    em.createCharge(charge);
  }
}

export function handleChargeConfirmed(log: any, em: EntityManager) {
  const { billingCycle, subscriptionId } =
    subControllerAbi.events.ChargeConfirmed.decode(log);

  const chargeId = keccak256(
    encodePacked(["string", "uint256"], [subscriptionId.toString(), billingCycle]),
  );

  const charge = em.getCharge(chargeId);
  if (!charge) return;

  em.updateCharge(chargeId, {
    success: true,
  });
}
