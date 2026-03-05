import { baseSepolia } from "viem/chains";
import { SubscriptionManagerContractAddress } from "../contracts";
import { SubscriptionManagerContractABI } from "../contracts/abi/subscription-manager.abi";
import { PolkabillConfig, SubscribeParams } from "../types";

export async function subscribe(
    config: PolkabillConfig,
    params: SubscribeParams,
) {
    if (!config.walletClient) {
        throw new Error("Wallet client is required!");
    }

    const { walletClient } = config;
    const [account] = await walletClient.getAddresses();
    console.log({ account, config, chain: baseSepolia });

    return walletClient.writeContract({
        account,
        address: SubscriptionManagerContractAddress,
        abi: SubscriptionManagerContractABI,
        chain: baseSepolia,   // TODO: should update chain for prod
        functionName: "subscribe",
        args: [
            params.planId
        ]
    })
}