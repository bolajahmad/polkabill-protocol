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