import { Log } from "@subsquid/evm-processor";
import * as subManagerAbi from "../abi/subscriptions-manager";
import * as merchantRegAbi from "../abi/merchant-registry";
import { merchantPayoutId } from "./helpers";
import * as planRegAbi from "../abi/plan-registry";
import * as chainRegAbi from "../abi/chain-registry";
// import * as subControllerAbi from "./abi/subscriptions-controller";

export interface CollectedIds {
  merchants: Set<string>;
  plans: Set<bigint>;
  subscriptions: Set<string>;
  adapters: Set<bigint>;
  payouts: Set<string>;
}

export function collectIds(blocks: { logs: Log[] }[]): CollectedIds {
  const merchants = new Set<string>();
  const plans = new Set<bigint>();
  const subscriptions = new Set<string>();
  const adapters = new Set<bigint>();
  const payouts = new Set<string>();

  for (const block of blocks) {
    for (const log of block.logs) {
      switch (log.topics[0]) {
        case merchantRegAbi.events.MerchantCreated.topic: {
          const { mId } = merchantRegAbi.events.MerchantCreated.decode(log);
          merchants.add(mId.toLowerCase());
          break;
        }
        case merchantRegAbi.events.MerchantUpdated.topic: {
          const { mid } =
            merchantRegAbi.events.MerchantUpdated.decode(log);
          merchants.add(mid.toLowerCase());
          break;
        }
        case merchantRegAbi.events.MerchantStatusUpdated.topic: {
          const { mId } = merchantRegAbi.events.MerchantStatusUpdated.decode(log);
          merchants.add(mId.toLowerCase());
          break;
        }
        case merchantRegAbi.events.PayoutAddressSet.topic: {
            const {chainId, mId} = merchantRegAbi.events.PayoutAddressSet.decode(log);
            merchants.add(mId.toLowerCase());
            payouts.add(merchantPayoutId(mId, chainId));
            break;
        }
        case merchantRegAbi.events.TokensAdded.topic: {
            const { cid, mid } = merchantRegAbi.events.TokensAdded.decode(log);
            merchants.add(mid.toLowerCase());
            adapters.add(cid);
            break;
        }
        case planRegAbi.events.PlanCreated.topic: {
            const {merchantId, planId} = planRegAbi.events.PlanCreated.decode(log);
            merchants.add(merchantId.toLowerCase());
            plans.add(planId);
            break;
        }
        case planRegAbi.events.PlanUpdated.topic: {
            const {planId} = planRegAbi.events.PlanUpdated.decode(log)
            plans.add(planId);
            break;
        }
        case chainRegAbi.events.ChainRegistered.topic: {
            const { chainId } = chainRegAbi.events.ChainRegistered.decode(log);
            adapters.add(chainId);
            break;
        }
        case chainRegAbi.events.ChainStatusUpdated.topic: {
            const {chainId} = chainRegAbi.events.ChainStatusUpdated.decode(log)
            adapters.add(chainId);
            break;
        }
        case chainRegAbi.events.TokenSupportUpdated.topic: {
            const {chainId} = chainRegAbi.events.TokenSupportUpdated.decode(log);
            adapters.add(chainId);
            break;
        }
        case subManagerAbi.events.Subscribed.topic: {
            const {planId, subId} = subManagerAbi.events.Subscribed.decode(log);
            plans.add(planId);
            subscriptions.add(subId.toString());
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
  };
}
