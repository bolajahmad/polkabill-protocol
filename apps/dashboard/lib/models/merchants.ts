import { Status } from "./chains";

export interface IPayout {
    chainId: number;
    id: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    tokens: string[];
    merchant: IMerchant[]
}

export interface IPlan {
  billingInterval: number;
  id: number;
  createdAt: string;
  grace: number;
  price: number;
  status: Status,
  updatedAt: string;
  subscriptions: []
}

export interface IMerchant {
  billingWindow: number;
  createdAt: string;
  grace: number;
  id: string;
  metadataUri: string;
  payout: IPayout[];
  plans: IPlan[];
  status: Status;
  updatedAt: string;
}
