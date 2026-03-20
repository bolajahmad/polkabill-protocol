import { encodePacked, keccak256 } from 'viem';
import * as subControllerAbi from '../abi/subscriptions-controller';
import { EntityManager } from '../utils/entity-manager';
import { decodeChargeRequestParams } from '../utils/helpers';

export function handleChargeConfirmed(log: any, em: EntityManager) {
  const { cycle, chainId, subId, nonce } = subControllerAbi.events.ChargeConfirmed.decode(log);

  const chargeId = keccak256(encodePacked(['string', 'uint256', 'uint256'], [subId.toString(), cycle, nonce]));

  const charge = em.getCharge(chargeId);
  if (!charge) return;

  em.updateCharge(chargeId, {
    success: true,
    chainId: Number(chainId),
    nonce
  });
}

export function handleAdminChargeRequested(log: any, em: EntityManager) {
  const {
    chainId,
    subId: nonce,
    cycle,
    data,
  } = subControllerAbi.events.ChargeRequested.decode(log);

  const { payout, price, subscriber, subId, token } = decodeChargeRequestParams(
    data as `0x${string}`,
  );
  const chargeId = keccak256(
    encodePacked(['string', 'uint256', 'uint256'], [subId.toString(), cycle, nonce]),
  );
  const sub = em.getSubscription(subId.toString());
  const adapter = em.getAdapter(chainId.toString());
  if (!sub || !adapter) return;

  const user = em.getUser(subscriber.toLowerCase());
  if (!user) return;

  const charge = em.getCharge(chargeId);
  if (charge) {
    em.updateCharge(chargeId, {
      createdAt: new Date(),
      token: token,
      amount: price,
      txHash: log.transactionHash,
      blockNumber: log.block.height,
      nonce,
    });
  } else {
    em.createCharge({
      id: chargeId,
      subscription: sub,
      adapter,
      amount: price,
      chainId: Number(chainId),
      token,
      payoutAddress: payout,
      billingCycle: cycle,
      txHash: log.transactionHash,
      blockNumber: log.block.height,
      success: false,
      createdAt: new Date(),
      nonce,
    });
  }
}
