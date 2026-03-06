import { Button } from '@/components/ui/button';
import { FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { IAdapterWithBalance } from '@/lib/hooks/use-user-adapter-balance';
import { handleContractError } from '@/lib/utils';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { ArrowRightLeft, Plus, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { toast } from 'sonner';
import { erc20Abi, formatUnits, parseUnits } from 'viem';
import { useChains, useConnection, useSwitchChain, useWriteContract } from 'wagmi';

type Props = {
  adapter: IAdapterWithBalance;
  tokenId: string;
  onComplete: () => void;
};

const MAX_ALLOWANCE = 10_000_000;

export const ManageTokenAllowanceModal = ({ adapter, tokenId, onComplete }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const { chain: connChain } = useConnection();
  const [isSubmitting, setIsSubmitting] = useState<'all' | 'revoke' | boolean>(false);
  const selectedToken = adapter.tokens.find(token => token.address === tokenId);
  const chains = useChains();
  const chain = chains.find(c => c.id === Number(adapter.id));
  const { mutate: switchChain } = useSwitchChain();

  console.log({ connChain });
  const { mutate: updateAllowance } = useWriteContract({
    mutation: {
      onError: error => {
        const message = handleContractError(error);
        toast.error(message || 'Failed to update allowance');
        console.log({ error });
      },
      onSuccess: (data) => {
        toast.success('Allowance updated successfully');
        onComplete();
      },
      onSettled: () => setIsSubmitting(false),
    },
  });

  const handleUpdateAllowance = async (amt: number) => {
    if (!selectedToken || !chain) return;

    setIsSubmitting(() => (amt === 0 ? 'revoke' : amt >= MAX_ALLOWANCE ? 'all' : true));

    // Call contract to update allowance
    updateAllowance({
      address: tokenId as `0x${string}`,
      abi: erc20Abi,
      functionName: 'approve',
      args: [adapter.address, parseUnits(amt.toString(), selectedToken.decimals)],
      chainId: Number(adapter.id) as any,
    });
  };

  useEffect(() => {
    if (isOpen && chain?.id !== connChain?.id) {
      switchChain?.({ chainId: chain?.id as any });
    }
  }, [chain, connChain, isOpen, switchChain]);

  return (
    <Fragment>
      <Button
        variant="outline"
        size="sm"
        className="rounded-lg h-8 text-xs"
        onClick={e => setOpen(true)}
      >
        Manage
      </Button>
      <Dialog
        open={isOpen}
        onClose={() => setOpen(false)}
        className="relative z-50"
        title={`Manage ${selectedToken?.symbol} Allowance`}
      >
        {/* Backdrop */}
        <DialogBackdrop className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-lg font-bold shadow-sm">
                  {selectedToken?.symbol?.[0] ?? 'US'}
                </div>
                <div>
                  <p className="text-sm font-bold">{selectedToken?.symbol}</p>
                  <p className="text-xs text-neutral-500">Network: {chain?.name ?? 'Unknown'}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">Current</p>
                  <p className="text-lg font-bold">
                    {Number(
                      formatUnits(selectedToken?.allowance ?? 0n, selectedToken?.decimals ?? 18),
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    New Allowance Amount
                  </label>
                  <div className="relative">
                    <Input
                      value={amount}
                      onChange={({ target: { value } }) => setAmount(value)}
                      type="number"
                      placeholder="0.00"
                      className="pr-16"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                      {selectedToken?.symbol}
                    </div>
                  </div>
                  <FieldDescription>
                    Available balance:{' '}
                    <strong>
                      {Number(
                        formatUnits(selectedToken?.balance ?? 0n, selectedToken?.decimals ?? 18),
                      ).toLocaleString()}{' '}
                      {selectedToken?.symbol}
                    </strong>
                  </FieldDescription>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    disabled={!!isSubmitting}
                    variant="outline"
                    onClick={() => handleUpdateAllowance(0)}
                    className="rounded-xl gap-2 h-12"
                  >
                    {isSubmitting === 'revoke' ? (
                      <Spinner />
                    ) : (
                      <ArrowRightLeft size={16} className="text-rose-500" />
                    )}
                    Revoke All
                  </Button>
                  <Button
                    disabled={!!isSubmitting}
                    variant="outline"
                    onClick={() => handleUpdateAllowance(MAX_ALLOWANCE)}
                    className="rounded-xl gap-2 h-12"
                  >
                    {isSubmitting === 'all' ? (
                      <Spinner />
                    ) : (
                      <Plus size={16} className="text-emerald-500" />
                    )}
                    Infinite
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3">
                <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
                <p className="text-xs text-emerald-700 leading-relaxed">
                  This transaction will update the allowance on the {chain?.name ?? 'Unknown'}{' '}
                  Billing Adapter.
                </p>
              </div>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                {/* Call cancel Subscription? */}
                Cancel
              </Button>
              <Button
                disabled={!!isSubmitting}
                onClick={() => handleUpdateAllowance(Number(amount))}
                className="rounded-xl"
              >
                {typeof isSubmitting === 'boolean' && isSubmitting && <Spinner />}
                Update Allowance
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Fragment>
  );
};
