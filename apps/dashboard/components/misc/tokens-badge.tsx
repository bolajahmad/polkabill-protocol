"use client";

import { truncateAddress } from "@/lib/utils";
import { erc20Abi } from "viem";
import { useReadContract } from "wagmi";
import { Badge } from "../ui/badge";
import { Spinner } from "../ui/spinner";

type Props = {
    chainId: number;
    address: `0x${string}`;
}

export const TokenDisplayBadge = ({ chainId, address }: Props) => {
    const {data: symbol, isLoading} = useReadContract({
        abi: erc20Abi,
        chainId: chainId as any,
        address,
        functionName: "symbol",
    });
  return (
    <Badge key={address} className="text-[10px] py-0 px-2">
      {isLoading ? <Spinner /> : symbol || truncateAddress(address)}
    </Badge>
  );
};
