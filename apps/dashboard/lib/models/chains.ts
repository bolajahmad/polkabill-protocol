import { IMerchant } from "./merchants";

export interface ICharge {
  id: string;
}

export enum Status {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DISABLED = 'DISABLED',
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

export interface IRelayRequest {
  type: 'TOKEN_SUPPORT' | 'MERCHANT_PAYOUT' | 'CHARGE_REQUEST';
  id: string;
  allow: boolean;
  nonce: string;
  token: string;
  adapter: IAdapter | null;
  merchant: IMerchant | null;
}
