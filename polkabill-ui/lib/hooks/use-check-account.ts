"use client";

import { useReadContract } from "wagmi"
import { MerchantContractABI } from "../contracts/abi/merchant.abi"
import { MerchantContractAddress } from "../contracts";

export const useCheckIsMerchantProfile = (address: `0x${string}`) => {
    const { data: merchantData, isLoading } = useReadContract({
        address: MerchantContractAddress,
        abi: MerchantContractABI,
        functionName: "getMerchant",
        args: [address],
        query: {
            enabled: !!address,
        }
    });
    console.log({ merchantData });

    const merchant = {
        address,
        billingWindow: Number(merchantData?.window || 0),
        gracePeriod: Number(merchantData?.grace || 0),
        isActive: !!merchantData?.active,
        metadata: merchantData?.metadata
    }

    return {
        hasMerchant: !!merchantData?.window,
        merchant,
        isLoading
    }
}