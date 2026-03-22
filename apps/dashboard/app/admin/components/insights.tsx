'use client';

import { StatCard } from '@/components/misc/stat-card';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Layers, Store, TrendingUp, Users } from 'lucide-react';
import { useMemo } from 'react';
import { formatUnits } from 'viem';

export const AdminInsights = () => {
  const { data } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => fetch('/api/admin/stats').then(res => res.json()),
  });
  console.log({ stats: data });

  const stats = useMemo(() => {
    return [
      { title: 'Amount Processed', value: formatCurrency(Number(formatUnits(BigInt(data?.revenue || 0), 18))), icon: Layers },
      { title: 'Protocol Fees', value: formatCurrency(Number(formatUnits(BigInt(data?.fees || 0), 18))), icon: TrendingUp },
      { title: 'Active Merchants', value: data?.totalMerchants || 0, icon: Store },
      { title: 'Total Subscriptions', value: data?.subscriptionCount || 0, icon: Users },
    ];
  }, [data]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} label={stat.title} value={stat.value} icon={stat.icon} />
        ))}
      </div>
    </div>
  );
};
