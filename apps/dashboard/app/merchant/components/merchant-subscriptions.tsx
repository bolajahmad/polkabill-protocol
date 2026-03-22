import { EmptyState } from '@/components/misc/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ISubscription, SubscriptionStatus } from '@/lib/models/subscriptions';
import { formatCurrency, formatDuration, parseJsonOrUndefined, truncateAddress } from '@/lib/utils';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { CheckCircle2, ChevronRight, Search, User, Wallet } from 'lucide-react';
import { useState } from 'react';
import { formatUnits, hexToString } from 'viem';

type Props = {
  mid: string;
};

export const MerchantSubscriptions = ({ mid }: Props) => {
  const [filter, setFilter] = useState({
    status: 'all',
    search: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSub, setSelectedSub] = useState<ISubscription | null>(null);
  const { data: subData } = useQuery<ISubscription[]>({
    queryKey: ['merchant-subscriptions', mid],
    queryFn: async () => fetch(`/api/subscriptions?mid=${mid}`).then(res => res.json()),
    enabled: !!mid,
  });
  const subscriptions = subData || [];

  const planMetadata = selectedSub
    ? (parseJsonOrUndefined(hexToString(selectedSub?.plan.metadataUri as `0x${string}`)) as Record<
        string,
        string
      >)
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">All Subscriptions</h2>
          <p className="text-sm text-neutral-500">
            Total active subscriptions across all plans:{' '}
            {
              subscriptions.filter(sub =>
                [SubscriptionStatus.ACTIVE, SubscriptionStatus.PAST_DUE].includes(sub.status),
              ).length
            }
          </p>
        </div>
        <div>
          <div className="flex items-stretch flex-wrap gap-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                size={16}
              />
              <Input
                placeholder="Search subscriber or plan..."
                className="pl-10 w-64 rounded-xl"
                value={filter.search}
                onChange={e => {
                  setFilter({ ...filter, search: e.target.value });
                  setCurrentPage(1);
                }}
              />
            </div>
            <select
              className="h-11 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-bold"
              value={filter.status}
              onChange={e => {
                setFilter({ ...filter, status: e.target.value });
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <Card>
        {subscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-50 text-[10px] uppercase font-bold text-neutral-400">
                  <th className="p-4">Subscriber</th>
                  <th className="p-4">Plan Details</th>
                  <th className="p-4">Billing</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {subscriptions.map(sub => {
                  const planMetadata = parseJsonOrUndefined(
                    hexToString(sub.plan.metadataUri as `0x${string}`),
                  ) as Record<string, string>;

                  return (
                    <tr key={sub.id} className="hover:bg-neutral-50/50 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400">
                            <User size={16} />
                          </div>
                          <div>
                            <p className="font-mono text-sm font-bold">
                              {truncateAddress(sub.user.id)}
                            </p>
                            <p className="text-[10px] text-neutral-400 uppercase font-bold">
                              ID: #{sub.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold">{planMetadata?.name || 'N/A'}</p>
                        <p className="text-xs text-neutral-500">
                          {formatCurrency(Number(formatUnits(BigInt(sub.plan.price), 18)))} /{' '}
                          {formatDuration(Number(sub.plan.billingInterval))}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold">Cycle #{sub.billingCycle}</p>
                        <p className="text-xs text-neutral-500">
                          Next: {dayjs(sub.nextBillingTime).format('YYYY-MM-DD')}
                        </p>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={sub.status === SubscriptionStatus.ACTIVE ? 'success' : 'ghost'}
                        >
                          {sub.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSub(sub)}
                          className="opacity-90 group-hover:opacity-100 transition-opacity gap-2"
                        >
                          View Details
                          <ChevronRight size={14} />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={User}
            title="No Active Subscription"
            description="When users subscribe to your plans, they will appear in this list for you to manage."
          />
        )}
      </Card>

      {selectedSub ? (
        <Dialog open={!!selectedSub} onClose={() => setSelectedSub(null)}>
          <DialogBackdrop className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div>
                <DialogTitle>Subscription Details</DialogTitle>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                      <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1">
                        Subscriber
                      </p>
                      <p className="text-sm font-mono font-bold truncate">
                        {truncateAddress(selectedSub.user.id)}
                      </p>
                    </div>
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                      <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1">Plan</p>
                      <p className="text-sm font-bold">{planMetadata?.name || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">
                      Payout Information
                    </h4>
                    <Card className="p-4 border-neutral-100 bg-neutral-50/30">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <Wallet size={16} className="text-neutral-400" />
                          <span className="text-sm font-bold">Payout Address</span>
                        </div>
                        <Badge variant="success">Verified</Badge>
                      </div>
                      <p className="text-sm font-mono bg-white p-3 rounded-lg border border-neutral-100 break-all">
                        {truncateAddress(selectedSub.plan.merchant?.id || '')}
                      </p>
                      <p className="text-[10px] text-neutral-500 mt-2 italic">
                        This address is configured on the Merchant Registry for the
                        subscriber&apos;s chain.
                      </p>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">
                      Billing History
                    </h4>
                    <div className="space-y-2">
                      {selectedSub.charges.splice(0, 3).map(({ id, billingCycle, amount }) => (
                        <div
                          key={id}
                          className="flex justify-between items-center p-3 text-sm border-b border-neutral-50 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span>Cycle #{billingCycle}</span>
                          </div>
                          <span className="font-bold">
                            {formatCurrency(Number(formatUnits(BigInt(amount || 0), 18)))}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button onClick={() => setSelectedSub(null)}>Close</Button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
};
