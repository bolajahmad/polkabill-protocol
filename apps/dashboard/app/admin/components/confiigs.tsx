import { TokenDisplayBadge } from '@/components/misc/tokens-badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { ChainRegistryContractAddress } from '@/lib/contracts';
import { ChainRegistryContractABI } from '@/lib/contracts/abi/chain-registry.abi';
import { IAdapter, Status } from '@/lib/models/chains';
import { cn, formatCurrency, handleContractError, truncateAddress } from '@/lib/utils';
import { queryClient } from '@/lib/wallet/config';
import { Dialog } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Globe, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useChains, usePublicClient, useWriteContract } from 'wagmi';
import { UpdateAdapterConfig } from './create-adapter';

export const AdminConfig = () => {
  const pubClient = usePublicClient();
  const chains = useChains();
  const [isUpdating, setUpdating] = useState<number | false>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, isLoading } = useQuery<{ data: IAdapter[] }>({
    queryKey: ['chain-list'],
    queryFn: async () => fetch('/api/admin/chains').then(res => res.json()),
  });
  const { mutate: toggleAdapter } = useWriteContract({
    mutation: {
      onError: error => {
        toast.error(
          handleContractError(error) || 'Error toggling adapter status. Please try again.',
        );
      },
      onSuccess: async hash => {
        await pubClient.waitForTransactionReceipt({ hash });
        await queryClient.invalidateQueries({ queryKey: ['chain-list'] });
        toast.success('Adapter status updated successfully!');
      },
      onSettled: () => {
        setUpdating(false);
      },
    },
  });
  const adapters = data?.data || [];

  const toggleAdapterStatus = (cid: number, on: boolean) => {
    setUpdating(cid);
    toggleAdapter({
      abi: ChainRegistryContractABI,
      address: ChainRegistryContractAddress,
      functionName: 'setChainStatus',
      args: [BigInt(cid), on],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Protocol Configuration</h2>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 rounded-xl">
          <Settings size={18} />
          Update Global Config
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader title="Chain Adapters">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-medium">Chain Adapters</h2>
                <h4>Registry of deployed adapters</h4>
              </div>
              <div>
                <UpdateAdapterConfig />
              </div>
            </div>
          </CardHeader>
          <div className="divide-y divide-neutral-50">
            {isLoading ? (
              <Skeleton className="h-12 w-12 rounded-full" />
            ) : adapters.length ? (
              adapters.map(c => (
                <div key={c.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start justify-start gap-3">
                      <div>
                        <p className="text-sm font-bold">
                          {chains.find(chain => chain.id === c.id)?.name || 'Unknown'} (ID: {c.id})
                        </p>
                        <p className="text-xs font-mono text-neutral-400">
                          {truncateAddress(c.address)}
                        </p>
                      </div>

                      <div>
                        {isUpdating == c.id ? (
                          <Spinner />
                        ) :  <Switch
                          checked={c.status === Status.ACTIVE}
                          onCheckedChange={value => toggleAdapterStatus(c.id, value)}
                        />}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold">{formatCurrency(0)}</p>
                      <p className="text-[10px] text-neutral-400 uppercase font-bold">
                        Accrued Fees
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {c.tokens.map(t => (
                      <TokenDisplayBadge key={t} chainId={c.id} address={t as `0x${string}`} />
                    ))}
                    <div>
                      <UpdateAdapterConfig chainId={c.id} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <Empty
                className={cn(
                  'flex flex-col items-center justify-center p-12 text-center space-y-4 bg-neutral-50/30 rounded-3xl border border-dashed border-neutral-200',
                )}
              >
                <EmptyHeader>
                  <EmptyMedia
                    variant="icon"
                    className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center text-neutral-400 mb-2"
                  >
                    <Globe size={32} />
                  </EmptyMedia>
                </EmptyHeader>

                <EmptyContent className="max-w-xs space-y-1">
                  <EmptyTitle className="text-lg font-bold tracking-tight">
                    No Chains Configured
                  </EmptyTitle>
                  <EmptyDescription className="text-sm text-neutral-500 leading-relaxed">
                    The protocol registry is empty. Add your first billing adapter to enable
                    cross-chain subscriptions.
                  </EmptyDescription>

                  <UpdateAdapterConfig />
                </EmptyContent>
              </Empty>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Role Management">Protocol administrators</CardHeader>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {[
                { addr: '0x71C...3E21', role: 'Super Admin' },
                { addr: '0x12A...9F82', role: 'Operator' },
              ].map(admin => (
                <div
                  key={admin.addr}
                  className="flex items-center justify-between p-3 border border-neutral-100 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-mono font-bold">{admin.addr}</p>
                    <p className="text-[10px] text-neutral-400 uppercase font-bold">{admin.role}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-rose-500 hover:bg-rose-50">
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Input placeholder="Enter address to grant role..." />
              <Button className="w-full rounded-xl">Grant Operator Role</Button>
            </div>
          </div>
        </Card>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Protocol Config"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              Protocol Fee (%)
            </label>
            <Input type="number" placeholder="0.5" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              Withdrawal Threshold
            </label>
            <Input type="number" placeholder="1000" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              Global Pause
            </label>
            <div className="flex items-center gap-3 p-4 border border-neutral-100 rounded-xl bg-rose-50/30">
              <AlertCircle className="text-rose-500" />
              <div className="flex-1">
                <p className="text-sm font-bold text-rose-700">Emergency Protocol Pause</p>
                <p className="text-xs text-rose-600">
                  Disables all charges and subscriptions immediately.
                </p>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-rose-300" />
            </div>
          </div>
        </div>
        <div>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>Save Changes</Button>
        </div>
      </Dialog>
    </div>
  );
};
