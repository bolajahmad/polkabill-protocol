import { DataHandlerContext } from "@subsquid/evm-processor";
import { Store } from "@subsquid/typeorm-store/lib/store";
import { decodeAbiParameters, encodePacked, keccak256 } from "viem";

export type StoreContext = DataHandlerContext<
  Store,
  {
    log: {
      transactionHash: true;
    };
  }
>;

export function merchantPayoutId(mid: string, chainId: bigint) {
  return keccak256(encodePacked(["string", "uint256"], [mid, chainId]));
}

export function chargeId(subId: string, cycle: bigint) {
  return keccak256(encodePacked(["string", "uint256"], [subId, cycle]));
}

export function relayMerchantUpdateId(merchant: `0x${string}`, payout: `0x${string}`, nonce: bigint) {
  return keccak256(encodePacked(["address", "address", "uint256"], [merchant, payout, nonce]));
}

export function relayAdminTokenUpdateId(token: `0x${string}`, allowed: boolean, nonce: bigint) {
  return keccak256(encodePacked(["address", "bool", "uint256"], [token, allowed, nonce]));
}

export function decodeChargeRequestParams(body: `0x${string}`) {
  const decoded = decodeAbiParameters(
    [
      {
        name: "chargeRequest",
        type: "tuple",
        components: [
          { name: "subId", type: "uint256" },
          {name: "price", type: "uint256"},
          { name: "subscriber", type: "address" },
          { name: "token", type: "address" },
          { name: "cycle", type: "uint256" },
          { name: "payout", type: "address"}
        ]
      }
    ],
    body
  );

  return decoded[0]
}
