'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { BASE_CHAIN, MerchantContractAddress } from '@/lib/contracts';
import { MerchantContractABI } from '@/lib/contracts/abi/merchant.abi';
import { IAdapter } from '@/lib/models/chains';
import { IPayout } from '@/lib/models/merchants';
import { createAdapterSchemaLooseChain } from '@/lib/schemas';
import { handleContractError, truncateAddress } from '@/lib/utils';
import { queryClient } from '@/lib/wallet/config';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useChains, useConnection, usePublicClient, useSwitchChain, useWriteContract } from 'wagmi';

type Props = {
  mid: `0x${string}`;
  onComplete: (cid?: number) => void;
  onCancel: () => void;
  existingPayouts?: IPayout[];
};

export const RegisterMerchantPayoutAddress = ({ mid, onComplete, onCancel }: Props) => {
  const pubClient = usePublicClient();
  const chains = useChains();
  const { chain } = useConnection();
  const { mutate: switchChain } = useSwitchChain();
  const form = useForm({
    resolver: zodResolver(createAdapterSchemaLooseChain),
    defaultValues: {
      chainId: '',
      adapter: mid,
    },
  });
  const { mutate: registerPayout, isPending } = useWriteContract({
    mutation: {
      onError: error => {
        const message = handleContractError(error);
        toast.error(message || 'Failed to register payout address');
        console.log({ error });
      },
      onSuccess: async (data, variables) => {
        await pubClient.waitForTransactionReceipt({ hash: data });
        setTimeout(async () => {
          await queryClient.refetchQueries({
            queryKey: ['merchantinformation', mid],
          });
        }, 3500);
        const chainId = variables?.args?.[1];
        onComplete(Number(chainId));
        toast.success('Payout address registered successfully');
      },
    },
  });
  const { data: adapterData, isLoading } = useQuery<{ data: IAdapter[] }>({
    queryKey: ['chain-list'],
    queryFn: async () => fetch('/api/admin/chains').then(res => res.json()),
  });
  const adapters = adapterData?.data || [];
  console.log({ adapters});

  const handleSubmit = (data: Record<string, string | number>) => {
    // Call API to update payout address
    console.log('Submitting payout address update:', data, mid);
    if (chain?.id !== BASE_CHAIN.id) switchChain({ chainId: BASE_CHAIN.id });
    const chainId = data.chainId.toString().split('/')[0].trim();
    registerPayout({
      abi: MerchantContractABI,
      address: MerchantContractAddress,
      functionName: 'setPayoutAddress',
      args: [mid, BigInt(chainId), data.adapter as `0x${string}`],
      chainId: BASE_CHAIN.id,
    });
  };

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
        <ShieldCheck className="text-blue-600 shrink-0" size={20} />
        <p className="text-xs text-blue-700 leading-relaxed">
          Updating your payout address will trigger a cross-chain message to all billing adapters on
          this network.
        </p>
      </div>

      <FieldGroup>
        <Controller
          name="chainId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel>Select Chain</FieldLabel>
              </FieldContent>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="form-rhf-select-chain"
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                >
                  <SelectValue placeholder="--- Select chain ---">
                    {field.value.split('/')[1]} ({field.value.split('/')[0]})
                  </SelectValue>
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {adapters.map(({ address, id }) => (
                    <SelectItem
                      key={address + id}
                      value={`${id.toString()}/${
                        chains.find(chain => chain.id === Number(id))?.name || 'Unknown'
                      }`}
                    >
                      {isLoading ? (
                        <Spinner />
                      ) : (
                        <span className="flex flex-col gap-1">
                          <span>
                            {chains.find(chain => chain.id === Number(id))?.name || 'Unknown'}
                          </span>
                          <span className="text-xs text-neutral-900">
                            {truncateAddress(address)}
                          </span>
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="adapter"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-input-adapter">Payout Address</FieldLabel>
              <Input
                {...field}
                id="form-rhf-input-adapter"
                aria-invalid={fieldState.invalid}
                placeholder="0x0000"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div>
        <Button variant="ghost" type="button" onClick={() => onCancel()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : null}
          {isPending ? 'Saving...' : 'Save Payout Address'}
        </Button>
      </div>
    </form>
  );
};
