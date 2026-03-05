"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { MerchantContractAddress } from "@/lib/contracts";
import { MerchantContractABI } from "@/lib/contracts/abi/merchant.abi";
import { IPayout } from "@/lib/models/merchants";
import { cn, handleContractError } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useChains, useWriteContract } from "wagmi";

type Props = {
  mid: `0x${string}`;
  payouts: IPayout[];
  onComplete: () => void;
  onCancel: () => void;
  cid?: number;
};

export const UpdateMerchantSupportedToken = ({
  cid,
  mid,
  payouts,
  onComplete,
  onCancel,
}: Props) => {
  const chains = useChains();
  const [tokenConfig, setTokenConfig] = useState({
    chainId: cid || "",
    tokenAddress: "",
    adding: true,
  });
  const validToken = /^0x[a-fA-F0-9]{40}$/.test(tokenConfig.tokenAddress);
  const { mutate: updateTokens, isPending } = useWriteContract({
    mutation: {
      onError: (error) => {
        const message = handleContractError(error);
        toast.error(message || "Failed to update supported tokens");
      },
      onSuccess: (data) => {
        console.log({ data });
        toast.success("Supported tokens updated successfully");
        onComplete();
      },
    },
  });
  const handleUpdateTokens = () => {
    if (!validToken) {
      return;
    }

    updateTokens({
      abi: MerchantContractABI,
      address: MerchantContractAddress,
      functionName: "updateAllowedToken",
      args: [
        mid,
        BigInt(tokenConfig.chainId),
        [tokenConfig.tokenAddress as `0x${string}`],
        tokenConfig.adding,
      ],
    });
  };

  return (
    <div className="space-y-4">
      <h2>Manage Allowed Tokens</h2>
      <div className="space-y-2">
        <label
          htmlFor="form-rhf-select-token"
          className="text-sm font-bold uppercase tracking-wider text-neutral-500"
        >
          Select Chain
        </label>
        <Select
          value={tokenConfig.chainId.toString()}
          onValueChange={(value) =>
            setTokenConfig({ ...tokenConfig, chainId: Number(value) })
          }
        >
          <SelectTrigger id="form-rhf-select-token" className="w-full">
            <SelectValue placeholder="--- Select chain ---" />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            {payouts.map((p) => (
              <SelectItem key={p.chainId} value={p.chainId.toString()}>
                {chains.find(({ id }) => id == p.chainId)?.name || p.chainId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="o=tokenAddress"
          className="text-sm font-bold uppercase tracking-wider text-neutral-500"
        >
          Token Contract Address
        </label>
        <Input
          value={tokenConfig.tokenAddress}
          onChange={(e) =>
            setTokenConfig({ ...tokenConfig, tokenAddress: e.target.value })
          }
          placeholder="0x..."
        />
      </div>
      <div className="flex items-center gap-4 p-4 border border-neutral-100 rounded-xl">
        <div className="flex-1">
          <p className="text-sm font-bold">Action Type</p>
          <p className="text-xs text-neutral-500">
            Are you adding or removing this token?
          </p>
        </div>
        <div className="flex bg-neutral-100 p-1 rounded-lg">
          <button
            onClick={() => setTokenConfig({ ...tokenConfig, adding: true })}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded-md transition-all",
              tokenConfig.adding
                ? "bg-white shadow-sm text-black"
                : "text-neutral-500",
            )}
          >
            Add
          </button>
          <button
            onClick={() => setTokenConfig({ ...tokenConfig, adding: false })}
            className={cn(
              "px-3 py-1 text-xs font-bold rounded-md transition-all",
              tokenConfig.adding
                ? "text-neutral-500"
                : "bg-white shadow-sm text-black",
            )}
          >
            Remove
          </button>
        </div>
      </div>

      <div>
        <Button variant="ghost" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button
          onClick={handleUpdateTokens}
          disabled={!validToken || isPending}
        >
          {isPending ? (
            <Spinner />
          ) : tokenConfig.adding ? (
            "Add Token"
          ) : (
            "Remove Token"
          )}
        </Button>
      </div>
    </div>
  );
};
