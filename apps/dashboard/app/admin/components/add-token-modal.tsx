import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { BASE_CHAIN, ChainRegistryContractAddress } from "@/lib/contracts";
import { ChainRegistryContractABI } from "@/lib/contracts/abi/chain-registry.abi";
import { handleContractError } from "@/lib/utils";
import { queryClient } from "@/lib/wallet/config";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useConnection, usePublicClient, useSwitchChain, useWriteContract } from "wagmi";

type Props = {
  chainId: number;
  onComplete: () => void
};

export const UpdateTokenModal = ({ chainId, onComplete }: Props) => {
  const [token, setToken] = useState("");
  const publicClient = usePublicClient();
  const { chain } = useConnection();
  const { mutate: switchChain } = useSwitchChain();

  const {
    mutate: updateAdapterTokens,
    isPending,
  } = useWriteContract({
    mutation: {
      onError: (error) => {
        const message = handleContractError(error);
        toast.error(message || "Failed to add token");
        console.log({ error });
      },
      onSuccess: async (hash) => {
        await publicClient.waitForTransactionReceipt({ hash });
        await queryClient.invalidateQueries({ queryKey: ['chain-list'] });
        toast.success("Token added successfully");
        onComplete();
      }
    }
  });

  const validToken = /^0x[a-fA-F0-9]{40}$/.test(token);

  const updateAdapterToken = () => {
      if (chain?.id !== BASE_CHAIN.id) {
        switchChain({ chainId: BASE_CHAIN.id });
      }
    updateAdapterTokens({
      abi: ChainRegistryContractABI,
      address: ChainRegistryContractAddress,
      functionName: 'setTokenSupport',
      args: [BigInt(chainId), token as `0x${string}`, true],
      chainId: BASE_CHAIN.id,
    });
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3 mb-4">
          <CheckCircle2 className="text-emerald-600 shrink-0" size={20} />
          <p className="text-xs text-emerald-700 leading-relaxed">
            Chain registered successfully! Now add the stablecoin addresses
            supported on this network.
          </p>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="token"
            className="text-sm font-bold uppercase tracking-wider text-neutral-500"
          >
            Token Address
          </label>
          <Input
            id="token"
            placeholder="0x..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          {!!token && !validToken && (
            <FieldError errors={[{ message: "Invalid token address" }]} />
          )}
        </div>
        <p className="text-[10px] text-neutral-400 italic">
          You can add more tokens later from the Chain Adapters list.
        </p>
      </div>

      <div className="w-full">
        <Button
          onClick={() => updateAdapterToken()}
          className="w-full mt-6"
          disabled={isPending || !validToken}
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            "Add Token"
          )}
        </Button>
      </div>
    </div>
  );
};
