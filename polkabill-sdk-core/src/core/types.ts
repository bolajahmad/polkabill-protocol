export type SubscriptionStatus =
  | "idle"
  | "preparing"
  | "awaiting_signature"
  | "tx_submitted"
  | "crosschain_pending"
  | "confirmed"
  | "failed"
  | "cancelled";

export interface ISubscribe {
  planId: bigint;
}

export interface ICancel {
  subscriptionId: bigint;
}

export interface ILifecycle {
  status: SubscriptionStatus;
  txHash?: `0x${string}`;
  subscriptionId?: bigint;
  error?: string;
}
