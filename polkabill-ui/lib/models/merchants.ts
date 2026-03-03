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

export interface IMerchant {
  billingWindow: number;
  createdAt: string;
  grace: number;
  id: string;
  metadataUri: string;
  payout: IPayout[];
  plans: [];
  status: Status;
  updatedAt: string;
}
