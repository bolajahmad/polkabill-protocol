'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { BASE_CHAIN, ChainRegistryContractAddress } from '@/lib/contracts';
import { ChainRegistryContractABI } from '@/lib/contracts/abi/chain-registry.abi';
import { createAdapterSchema } from '@/lib/schemas';
import { handleContractError } from '@/lib/utils';
import { queryClient } from '@/lib/wallet/config';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader2, Plus, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useConnection, usePublicClient, useSwitchChain, useWriteContract } from 'wagmi';
import { UpdateTokenModal } from './add-token-modal';

type Props = {
  chainId?: number;
};

/**
 * Creates a new billing adapter, the code hash is deployed on chain, technically
 * Submit a chainID, adapter address to create adapter
 *
 * If successful, optionally create tokens allowed on the adapter.
 * Create tokens takes a list of tokens and (adds them if no tokens)
 * Or removes them, if updating config
 * @param param0
 * @returns
 */
export const UpdateAdapterConfig = ({ chainId }: Props) => {
  const pubClient = usePublicClient();
  const [open, setOpen] = useState<'chain' | 'token' | false>(false);
  const form = useForm({
    resolver: zodResolver(createAdapterSchema),
    defaultValues: {
      chainId: '',
      adapter: '',
    },
  });
  const {
    mutate: createBillingAdapter,
    error: createAdapterError,
    isPending,
  } = useWriteContract({
    mutation: {
      onError: error => {
        const message = handleContractError(error);
        toast.error(message ?? 'Error registering adapter. Please try again.');
      },
      onSuccess: async hash => {
        await pubClient.waitForTransactionReceipt({ hash });
        await queryClient.invalidateQueries({ queryKey: ['chain-list'] });
        toast.success('Adapter registered successfully!');
        form.reset();
        setOpen(false);
      },
    },
  });
  const { chain } = useConnection();
  const { mutate: switchChain } = useSwitchChain();

  const onSubmit = (formData: Record<string, string | number>) => {
    // Handle form submission
    console.log('Form data:', formData);

    if (chain?.id !== BASE_CHAIN.id) {
      switchChain({ chainId: BASE_CHAIN.id });
    }
    // Call mutate to submit to blockchain
    const cid = BigInt(formData.chainId || 0);
    createBillingAdapter({
      abi: ChainRegistryContractABI,
      address: ChainRegistryContractAddress,
      functionName: 'registerChain',
      args: [cid, formData.adapter as `0x${string}`],
      chain: BASE_CHAIN,
    });
  };

  return (
    <>
      {chainId ? (
        <button
          onClick={() => setOpen('token')}
          type="button"
          className="text-[10px] font-bold text-neutral-400 hover:text-black flex items-center gap-1"
        >
          <Plus size={14} />
          Add Token
        </button>
      ) : (
        <Button onClick={() => setOpen('chain')} type="button" className="gap-2 rounded-xl">
          <Plus size={18} /> Add Chain
        </Button>
      )}

      <Dialog open={open !== false} onClose={() => setOpen(false)} className="relative z-50">
        {/* Backdrop */}
        <DialogBackdrop className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Full-screen container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          {open == 'token' ? (
            // Display the Token update modal also
            <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <UpdateTokenModal onComplete={() => setOpen(false)} chainId={chainId!} />
            </DialogPanel>
          ) : (
            <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <DialogTitle className="text-xl font-bold">Register a new Adapter</DialogTitle>
                <button
                  onClick={() => setOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="mb-6">
                <div className="space-y-4">
                  <p className="text-sm text-neutral-500">
                    To become a new adapter, you need to deploy the adapter contract template
                    on-chain.
                  </p>

                  {createAdapterError && (
                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex gap-2 text-rose-600 text-xs">
                      <AlertTriangle size={16} className="shrink-0" />
                      <p>{createAdapterError.message || 'Transaction failed. Please try again.'}</p>
                    </div>
                  )}

                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
                      <ShieldCheck className="text-amber-600 shrink-0" size={20} />
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Registering an adapter requires deploying a valid one on-chain. Ensure your
                        adapter is deployed and ready.
                      </p>
                    </div>
                    <FieldGroup>
                      {/* Chain ID where adapter lives */}
                      <Controller
                        name="chainId"
                        control={form.control}
                        render={({ field, fieldState }) => {
                          return (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-rhf-complex-company">Chain ID</FieldLabel>
                              <Input
                                {...field}
                                id="form-rhf-input-chainId"
                                aria-invalid={fieldState.invalid}
                                placeholder="00"
                              />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          );
                        }}
                      />

                      {/* Billing adapter contract address */}
                      <Controller
                        name="adapter"
                        control={form.control}
                        render={({ field, fieldState }) => {
                          return (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel>Billing Adapter</FieldLabel>
                              <Input
                                {...field}
                                type="text"
                                id="form-rhf-input-adapter"
                                aria-invalid={fieldState.invalid}
                                placeholder="0x0000"
                              />
                              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                          );
                        }}
                      />
                    </FieldGroup>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-4">
                      <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isPending || form.formState.isSubmitting}>
                        {isPending || form.formState.isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            Registering chain...
                          </span>
                        ) : (
                          'Register Adapter'
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </DialogPanel>
          )}
        </div>
      </Dialog>
    </>
  );
};
