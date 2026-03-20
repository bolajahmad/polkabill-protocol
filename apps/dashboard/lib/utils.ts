import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function truncateAddress(address: string) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const handleContractError = (error: any) => {
  const message = error?.cause?.message || error.message || "An unknown error occurred";
  console.error("Contract Error:", message);
  return message;
}

export async function fetchIpfsJson<T = unknown>(uri: string): Promise<T> {
  const res = await fetch(`https://ipfs.io/ipfs/${uri}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!res.ok) {
    throw new Error(`IPFS fetch failed: ${res.status}`)
  }

  return res.json() as Promise<T>
}

export function parseJsonOrUndefined<T = unknown>(value: string): T | undefined {
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

const DURATION_UNITS: { label: string; seconds: number }[] = [
  { label: "yr",     seconds: 365 * 24 * 3600 },
  { label: "month",  seconds: 30  * 24 * 3600 },
  { label: "week",   seconds: 7   * 24 * 3600 },
  { label: "day",    seconds: 24  * 3600 },
  { label: "hr",     seconds: 3600 },
  { label: "min",    seconds: 60 },
  { label: "sec",    seconds: 1 },
];

export function formatDuration(seconds: number): string {
  for (const { label, seconds: unitSeconds } of DURATION_UNITS) {
    const value = seconds / unitSeconds;
    if (Number.isInteger(value) && value >= 1) {
      return `${value} ${label}${value !== 1 ? "s" : ""}`;
    }
  }
  // Fallback: use the largest unit where value >= 1
  for (const { label, seconds: unitSeconds } of DURATION_UNITS) {
    const value = seconds / unitSeconds;
    if (value >= 1) {
      return `${Math.round(value)} ${label}${Math.round(value) !== 1 ? "s" : ""}`;
    }
  }
  return `${seconds} sec${seconds !== 1 ? "s" : ""}`;
}

export const TokenSignatureTypes = {
  TokenUpdate: [
    { name: "token", type: "address" },
    { name: "allowed", type: "bool" },
    { name: "nonce", type: "uint256" },
  ],
}; 

export const MerchantSignatureTypes = {
  MerchantUpdate: [
    { name: "merchant", type: "address" },
    { name: "payout", type: "address" },
    { name: "nonce", type: "uint256" },
  ],
}

export const ChargeRequestSignatureTypes = {
  Charge: [
    { name: "subId", type: "uint256" },
    { name: "cycle", type: "uint256" },
    { name: "amount", type: "uint256" },
    { name: "subscriber", type: "address" },
    { name: "token", type: "address" },
    { name: "merchant", type: "address" },
    { name: "nonce", type: "uint256" },
  ],
}

export const getDomain = (chainId: number, verifyingContract: `0x${string}`) => ({
  name: "BillingAdapter",
  version: "1",
  chainId,
  verifyingContract,
})