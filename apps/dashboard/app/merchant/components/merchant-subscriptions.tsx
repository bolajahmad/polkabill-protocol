import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ISubscription, SubscriptionStatus } from '@/lib/models/subscriptions';
import { formatCurrency, truncateAddress } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Filter, Search, User } from 'lucide-react';
import { useState } from 'react';
import { formatUnits } from 'viem';

type Props = {
  mid: string;
};

export const MerchantSubscriptions = ({ mid }: Props) => {
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const { data: subData } = useQuery<ISubscription[]>({
    queryKey: ['merchant-subscriptions', mid],
    queryFn: async () => fetch(`/api/subscriptions?mid=${mid}`).then(res => res.json()),
    enabled: !!mid,
  });
  const subscriptions = subData || [];
  console.log({ subscriptions });

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
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl">
            <Filter size={16} />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-xl">
            <Search size={16} />
            Search
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-50 text-[10px] uppercase font-bold text-neutral-400">
                <th className="p-4">Subscriber</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Price</th>
                <th className="p-4">Next Billing</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {subscriptions.map(sub => (
                <tr key={sub.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-400">
                        <User size={16} />
                      </div>
                      <span className="font-mono text-sm font-bold">{truncateAddress(sub.user.id)}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{sub.plan.id}</td>
                  <td className="p-4 text-sm font-bold">{formatCurrency(Number(formatUnits(BigInt(sub.plan.price), 18)))}</td>
                  <td className="p-4 text-sm text-neutral-500">{new Date(sub.nextBillingTime / 1000).toDateString()}</td>
                  <td className="p-4">
                    <Badge variant={sub.status === 'ACTIVE' ? 'success' : 'ghost'}>
                      {sub.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedSub(sub)}
                      className="opacity-70 group-hover:opacity-100 transition-opacity"
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* <Dialog open={!!selectedSub} onClose={() => setSelectedSub(null)}>
        <DialogHeader>
          <AlertDialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
          </DialogHeader>
          {selectedSub && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1">
                    Subscriber
                  </p>
                  <p className="text-sm font-mono font-bold truncate">{selectedSub.user}</p>
                </div>
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                  <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1">Plan</p>
                  <p className="text-sm font-bold">{selectedSub.planName}</p>
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
                    {selectedSub.payoutAddress}
                  </p>
                  <p className="text-[10px] text-neutral-500 mt-2 italic">
                    This address is configured on the Merchant Registry for the subscriber's chain.
                  </p>
                </Card>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">
                  Billing History
                </h4>
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-3 text-sm border-b border-neutral-50 last:border-0"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>Cycle #{selectedSub.billingCycle - i}</span>
                      </div>
                      <span className="font-bold">{formatCurrency(selectedSub.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedSub(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};
