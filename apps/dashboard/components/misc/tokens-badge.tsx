"use client";

import { ERC20ContractABI } from "@/lib/contracts/abi/erc20.abi";
import { truncateAddress } from "@/lib/utils";
import { useReadContract } from "wagmi";
import { Badge } from "../ui/badge";
import { Spinner } from "../ui/spinner";

type Props = {
    chainId: number;
    address: `0x${string}`;
    variant?: "ghost" | "default";
}

export const TokenDisplayBadge = ({ chainId, address, variant }: Props) => {
    const {data: symbol, isLoading} = useReadContract({
        abi: ERC20ContractABI,
        chainId: chainId as any,
        address,
        functionName: "symbol",
    });
  return (
    <Badge key={address} variant={variant} className="text-[10px] py-0 px-2">
      {isLoading ? <Spinner /> : symbol || truncateAddress(address)}
    </Badge>
  );
};
