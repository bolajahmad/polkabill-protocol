'use client';

import { BASE_CHAIN } from '@/lib/contracts';
import { BillingAdapterContractABI } from '@/lib/contracts/abi/adapter.abi';
import { IAdapter } from '@/lib/models/chains';
import { useQuery } from '@tanstack/react-query';
import { CircleCheckIcon, Clock } from 'lucide-react';
import { useReadContract } from 'wagmi';

type Props = {
    id: string;
  chainId: number;
  address: `0x${string}`;
};

export const DisplayRelayStatusBadge = ({ id, chainId, address }: Props) => {
  const { data, isLoading } = useQuery<{ data: IAdapter[] }>({
    queryKey: ['chain-list'],
    queryFn: async () => fetch('/api/admin/chains').then(res => res.json()),
  });
  const adapter = data?.data.find((a) => a.id === chainId);
  const { data: isRelayed, isPending } = useReadContract({
    abi: BillingAdapterContractABI,
    address: address,
    functionName: 'executedRelay',
    args: [id as `0x${string}`],
    chainId: BASE_CHAIN.id,
    query: {
        enabled: Boolean(adapter),
    }
  });
  return (
    <>
      {isRelayed ? (
        <div className="flex items-center gap-2 text-green-600">
          <CircleCheckIcon size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Done</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-amber-600">
          <Clock size={14} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Pending Relay</span>
        </div>
      )}
    </>
  );
};
