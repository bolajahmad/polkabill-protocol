export interface ICharge {
  id: string;
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
