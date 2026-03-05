import { useAccount } from "wagmi";
import { usePolkabill } from "../providers/PolkabillProvider";

export function SubscribeButton({
    planId,
    merchantId
}: any) {
    const pb = usePolkabill();
    const { address } = useAccount();
    console.log({ address });

    async function handleSubscribe() {
        if (!address) {
            alert("Connect wallet");
            return;
        }

        await pb.subscribe({
            merchant: merchantId,
            planId,
            token: "0x0000000000000000000000000000000000000000", // TODO: update token for prod
            amount: 0n   // TODO: update amount for prod
        });
    }

    return (
        <button onClick={handleSubscribe}>
            Subscribe
        </button>
    )
}