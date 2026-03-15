'use client';

import { StatCard } from '@/components/misc/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { ISubscription } from '@/lib/models/subscriptions';
import { cn, truncateAddress } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CreditCard,
  Settings,
  Wallet
} from 'lucide-react';
import { formatUnits } from 'viem';
import { useWriteContract } from 'wagmi';

type Props = {
  mid: string;
};

export function MerchantsOverview({ mid }: Props) {
  const { mutate } = useWriteContract({
    mutation: {
      onError: error => console.log({ error }),
      onSuccess: data => console.log({ data }),
    },
  });
  const { data: stats } = useQuery({
    queryKey: ['merchant-stats', mid],
    queryFn: async () =>
      fetch(`/api/merchant/stats/${mid}`).then(res => res.json()),
    enabled: !!mid,
  })
  console.log({ stats });
  const { data: subData } = useQuery<ISubscription[]>({
    queryKey: ['merchant-subscriptions', mid],
    queryFn: async () => fetch(`/api/subscriptions?mid=${mid}`).then(res => res.json()),
    enabled: !!mid,
  });
  const subscriptions = subData || [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`$${Number(formatUnits(BigInt(stats?.revenue || 0), 18)).toLocaleString()}`} icon={CreditCard} />
        <StatCard label="Active Subs" value={stats?.activeSubCount || 0} icon={Activity} />
        <StatCard label="Churn Rate" value={`${stats?.churn || 0}%`} icon={AlertCircle} />
        <StatCard label="Avg LTV" value={`$${Number(formatUnits(BigInt(stats?.ltv || 0), 18)).toLocaleString()}`} icon={ArrowUpRight} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader title="Recent Activity" className='text-xl font-semibold'>Recent Activity</CardHeader>
          <CardTitle className="flex items-center justify-between px-6">
            <h3>Latest subscription events</h3>
          </CardTitle>
          <div className="divide-y divide-neutral-50 px-6">
            {subscriptions.length > 0 ? (
              subscriptions.slice(0, 5).map(sub => (
                <div
                  key={sub.id}
                  className="p-4 flex items-center justify-between hover:bg-neutral-50/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-600">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{truncateAddress(sub.user.id)}</p>
                      <p className="text-xs text-neutral-500">
                        {sub.plan.id} • Cycle #{sub.billingCycle}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      ${Number(formatUnits(BigInt(sub.plan.price), 18))}
                    </p>
                    <p className="text-[10px] text-neutral-400 uppercase font-bold">2 hours ago</p>
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
                    <Activity size={32} />
                  </EmptyMedia>
                </EmptyHeader>

                <EmptyContent className="max-w-xs space-y-1">
                  <EmptyTitle className="text-lg font-bold tracking-tight">
                    No Recent Activity
                  </EmptyTitle>
                  <EmptyDescription className="text-sm text-neutral-500 leading-relaxed">
                    New subscription events and payments will appear here once your business starts
                    receiving them.
                  </EmptyDescription>
                </EmptyContent>
              </Empty>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Quick Actions" />
          <div className="p-6 space-y-3">
            <Button className="w-full justify-start gap-3 rounded-xl">
              <Settings size={18} />
              Update Profile
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3 rounded-xl">
              <Wallet size={18} />
              Manage Payouts
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
