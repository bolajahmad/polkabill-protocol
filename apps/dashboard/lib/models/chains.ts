import { ISubscription } from "./subscriptions";

export interface ICharge {
  id: string;
  billingCycle: string;
  amount: string;
  success: boolean;
  txHash: string;
  blockNumber: string;
  chainId: number;
  subscription: ISubscription;
  adapter: IAdapter;
  createdAt: string
}

export enum Status {
  ACTIVE = "ACTIVE",
  PAUSED = "PAUSED",
  DISABLED = "DISABLED",
}

export interface IAdapter {
  address: `0x${string}`;
  charges: ICharge[];
  createdAt: string;
  id: number;
  status: Status;
  tokens: string[];
  updatedAt: string;
}
