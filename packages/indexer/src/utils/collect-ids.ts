import { Log } from '@subsquid/evm-processor';
import { encodePacked, keccak256 } from 'viem';
import * as chainRegAbi from '../abi/chain-registry';
import * as merchantRegAbi from '../abi/merchant-registry';
import * as planRegAbi from '../abi/plan-registry';
import * as subControllerAbi from '../abi/subscriptions-controller';
import * as subManagerAbi from '../abi/subscriptions-manager';
import { merchantPayoutId } from './helpers';

export interface CollectedIds {
  merchants: Set<string>;
  plans: Set<bigint>;
  subscriptions: Set<string>;
  adapters: Set<bigint>;
  payouts: Set<string>;
  relays: Set<string>;
  users: Set<string>;
  charges: Set<string>;
}

export function collectIds(blocks: { logs: Log[] }[]): CollectedIds {
  const merchants = new Set<string>();
  const plans = new Set<bigint>();
  const subscriptions = new Set<string>();
  const adapters = new Set<bigint>();
  const payouts = new Set<string>();
  const relays = new Set<string>();
  const users = new Set<string>();
  const charges = new Set<string>();

  for (const block of blocks) {
    for (const log of block.logs) {
      switch (log.topics[0]) {
        case merchantRegAbi.events.MerchantCreated.topic: {
          const { mId } = merchantRegAbi.events.MerchantCreated.decode(log);
          merchants.add(mId.toLowerCase());
          break;
        }
        case merchantRegAbi.events.MerchantUpdated.topic: {
          const { mid } = merchantRegAbi.events.MerchantUpdated.decode(log);
          merchants.add(mid.toLowerCase());
          break;
        }
        case merchantRegAbi.events.MerchantStatusUpdated.topic: {
          const { mId } = merchantRegAbi.events.MerchantStatusUpdated.decode(log);
          merchants.add(mId.toLowerCase());
          break;
        }
        case merchantRegAbi.events.PayoutAddressSet.topic: {
          const { chainId, mId } = merchantRegAbi.events.PayoutAddressSet.decode(log);
          merchants.add(mId.toLowerCase());
          payouts.add(merchantPayoutId(mId, chainId));
          break;
        }
        case merchantRegAbi.events.TokensAdded.topic: {
          const { cid, mid } = merchantRegAbi.events.TokensAdded.decode(log);
          adapters.add(cid);
          merchants.add(mid.toLowerCase());
          payouts.add(merchantPayoutId(mid, cid));
          break;
        }
        case planRegAbi.events.PlanCreated.topic: {
          const { merchantId, planId } = planRegAbi.events.PlanCreated.decode(log);
          merchants.add(merchantId.toLowerCase());
          plans.add(planId);
          break;
        }
        case planRegAbi.events.PlanUpdated.topic: {
          const { planId } = planRegAbi.events.PlanUpdated.decode(log);
          plans.add(planId);
          break;
        }
        case chainRegAbi.events.ChainRegistered.topic: {
          const { chainId } = chainRegAbi.events.ChainRegistered.decode(log);
          adapters.add(chainId);
          break;
        }
        case chainRegAbi.events.ChainStatusUpdated.topic: {
          const { chainId } = chainRegAbi.events.ChainStatusUpdated.decode(log);
          adapters.add(chainId);
          break;
        }
        case chainRegAbi.events.TokenSupportUpdated.topic: {
          const { chainId } = chainRegAbi.events.TokenSupportUpdated.decode(log);
          adapters.add(chainId);
          break;
        }
        case subManagerAbi.events.Subscribed.topic: {
          const { planId, subId } = subManagerAbi.events.Subscribed.decode(log);
          plans.add(planId);
          subscriptions.add(subId.toString());
          break;
        }
        case subManagerAbi.events.SubscriptionUpdated.topic: {
          const { subscriptionId } = subManagerAbi.events.SubscriptionUpdated.decode(log);
          subscriptions.add(subscriptionId.toString());
          break;
        }
        case subManagerAbi.events.SubscriptionPaid.topic: {
          const { subscriptionId } = subManagerAbi.events.SubscriptionPaid.decode(log);
          subscriptions.add(subscriptionId.toString());
          break;
        }
        case subManagerAbi.events.PlanChangeScheduled.topic: {
          const { subId, planId } = subManagerAbi.events.PlanChangeScheduled.decode(log);
          subscriptions.add(subId.toString());
          plans.add(planId);
          break;
        }
        case subManagerAbi.events.PlanChanged.topic: {
          const { subId } = subManagerAbi.events.PlanChanged.decode(log);
          subscriptions.add(subId.toString());
          break;
        }
        case subControllerAbi.events.ChargeConfirmed.topic: {
          const { subId, cycle, chainId } = subControllerAbi.events.ChargeConfirmed.decode(log);
          const chargeId = keccak256(
            encodePacked(['string', 'uint256', 'uint256'], [subId.toString(), cycle, chainId]),
          );
          charges.add(chargeId);
          break;
        }
        case subControllerAbi.events.ChargeRequested.topic: {
          const { subId, cycle, chainId } = subControllerAbi.events.ChargeRequested.decode(log);
          const chargeId = keccak256(
            encodePacked(['string', 'uint256', 'uint256'], [subId.toString(), cycle, chainId]),
          );
          charges.add(chargeId);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  return {
    merchants,
    plans,
    subscriptions,
    adapters,
    payouts,
    charges,
    users,
    relays,
  };
}
