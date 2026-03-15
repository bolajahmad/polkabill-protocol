"use client";

import { truncateAddress } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useReadContract } from "wagmi";
import { ERC20ContractABI } from "@/lib/contracts/abi/erc20.abi";
import { Spinner } from "../ui/spinner";

type Props = {
    chainId: number;
    address: `0x${string}`;
}

export const TokenDisplayBadge = ({ chainId, address }: Props) => {
    const {data: symbol, isLoading} = useReadContract({
        abi: ERC20ContractABI,
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
