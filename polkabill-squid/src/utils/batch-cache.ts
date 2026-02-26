import { Merchant, Plan, Adapter, Payout, Subscription, Charge, User } from "../model";

export class BatchCache {
  merchants = new Map<string, Merchant>();
  plans = new Map<string, Plan>();
  adapters = new Map<string, Adapter>();
  payouts = new Map<string, Payout>();
  subscriptions = new Map<string, Subscription>();
  charges = new Map<string, Charge>();
  users = new Map<string, User>();
}