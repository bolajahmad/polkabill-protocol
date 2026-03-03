import type { Chain, PublicClient, WalletClient } from "viem";

export class AdapterClient {
    constructor(
        private publicClient: PublicClient,
        private walletClient: WalletClient,
        private chain: Chain,
        private abi: any
    ) {}

    async subscribe(planId: bigint) {
        const [account] = await this.walletClient.getAddresses();
        const adapterAddress = this.getAdapter(this.chain);
        return this.walletClient.writeContract({
            address: adapterAddress,
            abi: this.abi,
            chain: this.chain,
            functionName: "subscribe",
            args: [planId],
            account: account ?? "0x",
        })
    }

    async cancel(subId: bigint) {
        const [account] = await this.walletClient.getAddresses();
        const adapterAddress = "0x19bb87b32eeeb7040194ee9eb2efd59afe06ed92295fb1ce19848340834f257b";
        return this.walletClient.writeContract({
            address: adapterAddress,
            abi: this.abi,
            chain: this.chain,
            functionName: "cancel",
            args: [subId],
            account: account ?? "0x",
        })
    }

    getAdapter(chain: Chain): `0x${string}` {
        return "0x19bb87b32eeeb7040194ee9eb2efd59afe06ed92295fb1ce19848340834f257b";
    }
}