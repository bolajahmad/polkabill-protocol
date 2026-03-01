import type { PublicClient } from "viem";

export class HubClient {
  constructor(
    private publicClient: PublicClient,
    private hubAddress: `0x${string}`,
    private abi: any
  ) {}

  async getSubscription(subscriptionId: bigint) {
    return this.publicClient.readContract({
      address: this.hubAddress,
      abi: this.abi,
      functionName: "getSubscription",
      args: [subscriptionId],
    });
  }
}