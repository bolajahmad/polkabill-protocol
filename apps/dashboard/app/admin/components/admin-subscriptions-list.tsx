import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { SubscriptionManagerContractAddress } from '@/lib/contracts';
import { BillingAdapterContractABI } from '@/lib/contracts/abi/adapter.abi';
import { SubscriptionManagerContractABI } from '@/lib/contracts/abi/subscription-manager.abi';
import { useAdminRelayActions } from '@/lib/hooks/use-admin-relay-logic';
import { MOCK_ALL_SUBSCRIPTIONS } from '@/lib/mocks';
import { cn, formatCurrency } from '@/lib/utils';
import { AlertCircle, CheckCircle2, CreditCard, RefreshCw, Search, Zap } from 'lucide-react';
import { useState } from 'react';
import { useWriteContract } from 'wagmi';

export const AdminSubscriptionsList = () => {
  const [filter, setFilter] = useState({
    status: 'all',
    window: 'all',
    search: '',
  });

  const { mutate: writeContract } = useWriteContract();

  const filteredSubs = MOCK_ALL_SUBSCRIPTIONS.filter(sub => {
    const matchesStatus = filter.status === 'all' || sub.status === filter.status;
    const matchesWindow = filter.window === 'all' || sub.window.toString() === filter.window;
    const matchesSearch =
      sub.subscriber.toLowerCase().includes(filter.search.toLowerCase()) ||
      sub.merchant.toLowerCase().includes(filter.search.toLowerCase());
    return matchesStatus && matchesWindow && matchesSearch;
  });

  const { addAction } = useAdminRelayActions();

  const handleRequestCharge = (sub: any) => {
    writeContract({
      address: sub.adapter as `0x${string}`,
      abi: BillingAdapterContractABI as any,
      functionName: 'requestCharge',
      args: [BigInt(sub.id.replace('s', '')), BigInt(sub.price * 1e6)], // Assuming 6 decimals for USDC
    } as any);

    // Add to relay queue for admin to process
    addAction({
      type: 'CHARGE_REQUEST',
      chainId: 1, // Default chain for now
      charge: {
        subId: sub.id.replace('s', ''),
        cycle: 1, // Default cycle for now
        amount: sub.price * 1e6,
        subscriber: sub.subscriber,
        token: '0x...USDC', // In real app, look up from sub
        merchant: sub.merchantAddress || '0x71C...3E21',
        nonce: 2,
      },
      adapter: sub.adapter,
      signature: '0x' + '0'.repeat(130), // Placeholder signature
    } as any);
  };

  const handleConfirmCharge = (sub: any) => {
    writeContract({
      address: SubscriptionManagerContractAddress as `0x${string}`,
      abi: SubscriptionManagerContractABI as any,
      functionName: 'confirmCharge',
      args: [BigInt(sub.id.replace('s', '')), BigInt(sub.price * 1e6), '0x' as `0x${string}`],
    } as any);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              size={16}
            />
            <Input
              placeholder="Search subscriber or merchant..."
              className="pl-10 w-64 rounded-xl"
              value={filter.search}
              onChange={e => setFilter({ ...filter, search: e.target.value })}
            />
          </div>
          <select
            className="h-11 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-bold"
            value={filter.status}
            onChange={e => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="due">Due for Billing</option>
          </select>
          <select
            className="h-11 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-bold"
            value={filter.window}
            onChange={e => setFilter({ ...filter, window: e.target.value })}
          >
            <option value="all">All Windows</option>
            <option value="12">12h Window</option>
            <option value="24">24h Window</option>
            <option value="48">48h Window</option>
          </select>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl">
          <RefreshCw size={16} />
          Sync State
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-50 text-[10px] uppercase font-bold text-neutral-400">
                <th className="p-4">Subscriber</th>
                <th className="p-4">Merchant/Plan</th>
                <th className="p-4">Chain Status</th>
                <th className="p-4">Billing Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filteredSubs.length > 0 ? (
                filteredSubs.map(sub => {
                  const isDue = false;
                  return (
                    <tr key={sub.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4">
                        <p className="text-sm font-bold font-mono">{sub.subscriber}</p>
                        <p className="text-[10px] text-neutral-400 uppercase font-bold">
                          SID: {sub.id}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold">{sub.merchant}</p>
                        <p className="text-xs text-neutral-500">
                          {sub.plan} • {formatCurrency(sub.price)}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="ghost" className="text-[10px]">
                              {sub.chain}
                            </Badge>
                            {sub.hasBalance ? (
                              <CheckCircle2 size={12} className="text-emerald-500" />
                            ) : (
                              <AlertCircle size={12} className="text-rose-500" />
                            )}
                            <span className="text-[10px] font-bold text-neutral-400">Balance</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {sub.hasApproval ? (
                              <CheckCircle2 size={12} className="text-emerald-500" />
                            ) : (
                              <AlertCircle size={12} className="text-rose-500" />
                            )}
                            <span className="text-[10px] font-bold text-neutral-400">Approval</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {sub.status === 'cancelled' ? (
                          <Badge variant="ghost">Cancelled</Badge>
                        ) : isDue ? (
                          <div className="space-y-1">
                            <Badge variant="destructive">Due for Billing</Badge>
                            <p className="text-[10px] text-rose-500 font-bold">
                              Overdue: {Math.floor((Date.now() - (sub.nextBilling || 0)) / 3600000)}
                              h
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Badge variant="success">Active</Badge>
                            <p className="text-[10px] text-neutral-400 font-bold">
                              Next: {new Date(sub.nextBilling || 0).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1 text-[10px] font-bold uppercase tracking-wider"
                            disabled={!isDue || sub.status === 'cancelled'}
                            onClick={() => handleRequestCharge(sub)}
                          >
                            <Zap size={12} />
                            Request
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 gap-1 text-[10px] font-bold uppercase tracking-wider"
                            disabled={!isDue || sub.status === 'cancelled'}
                            onClick={() => handleConfirmCharge(sub)}
                          >
                            <CheckCircle2 size={12} />
                            Confirm
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>
                    <Empty
                      className={cn(
                        'border-0 bg-transparent p-12 flex flex-col items-center justify-center text-center space-y-4 rounded-3xl border-dashed border-neutral-200',
                      )}
                    >
                      <EmptyHeader>
                        <EmptyMedia
                          variant="icon"
                          className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center text-neutral-400 mb-2"
                        >
                          <CreditCard size={32} />
                        </EmptyMedia>
                      </EmptyHeader>

                      <EmptyContent className="max-w-xs space-y-1">
                        <EmptyTitle className="text-lg font-bold tracking-tight">
                          No Subscriptions Found
                        </EmptyTitle>
                        <EmptyDescription className="text-sm text-neutral-500 leading-relaxed">
"No subscriptions match your current filter criteria.                        </EmptyDescription>
                      </EmptyContent>
                    </Empty>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
