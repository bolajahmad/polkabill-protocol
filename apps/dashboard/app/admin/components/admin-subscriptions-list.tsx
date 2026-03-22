import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { SubscriptionManagerContractAddress } from '@/lib/contracts';
import { SubscriptionManagerContractABI } from '@/lib/contracts/abi/subscription-manager.abi';
import { IAdapterWithBalance, useUserAdapterBalance } from '@/lib/hooks/use-user-adapter-balance';
import { ISubscription, SubscriptionStatus } from '@/lib/models/subscriptions';
import { cn, formatCurrency, parseJsonOrUndefined, truncateAddress } from '@/lib/utils';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  CreditCard,
  RefreshCw,
  Search,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { formatUnits, hexToString } from 'viem';
import { useChains, useWriteContract } from 'wagmi';

dayjs.extend(relativeTime);

export const DisplayBalanceAllowanceCharge = ({ sub }: { sub: ISubscription }) => {
  const { adaptersWithBalance: adapters } = useUserAdapterBalance(sub.user.id as `0x${string}`);
  const chains = useChains();
  const lastCharge = sub.charges[0];
  const price = lastCharge ? lastCharge.amount : sub.plan.price;

  const { token } = useMemo(() => {
    let tokenWithBalance: IAdapterWithBalance['tokens'][0] | undefined = undefined;
    let adapterWithBalance: IAdapterWithBalance | undefined = undefined;

    for (const adapter of adapters) {
      for (const token of adapter.tokens) {
        if (token.balance >= BigInt(price || 0) && (token.allowance || 0) >= BigInt(price || 0)) {
          tokenWithBalance = token;
          adapterWithBalance = adapter;
          break;
        }
        if (token.balance >= BigInt(price || 0)) {
          tokenWithBalance = token;
          adapterWithBalance = adapter;
          break;
        }
      }
    }

    return {
      token: tokenWithBalance,
      adapter: adapterWithBalance,
    };
  }, [adapters, price]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {lastCharge ? (
          <Badge variant="ghost" className="text-[10px]">
            {chains.find(({ id }) => id == lastCharge.chainId)?.name || 'N/A'}
          </Badge>
        ) : null}
        {BigInt(token?.balance || 0) >= BigInt(price || 0) ? (
          <CheckCircle2 size={12} className="text-emerald-500" />
        ) : (
          <AlertCircle size={12} className="text-rose-500" />
        )}
        <span className="text-[10px] font-bold text-neutral-400">Balance</span>
      </div>
      <div className="flex items-center gap-2">
        {(token?.allowance || 0n) >= BigInt(price || 0) ? (
          <CheckCircle2 size={12} className="text-emerald-500" />
        ) : (
          <AlertCircle size={12} className="text-rose-500" />
        )}
        <span className="text-[10px] font-bold text-neutral-400">Approval</span>
      </div>
    </div>
  );
};

export const AdminSubscriptionsList = () => {
  const chains = useChains();
  const [filter, setFilter] = useState({
    status: 'all',
    window: 'all',
    search: '',
  });
  const [isOpen, setIsOpen] = useState<ISubscription>();

  const { mutate: writeContract } = useWriteContract();
  const { data: subscriptions } = useQuery({
    queryKey: ['all-subscriptions'],
    queryFn: async () => fetch('/api/admin/subs').then(res => res.json()),
  });

  const filteredSubs = ((subscriptions || []) as ISubscription[]).filter(sub => {
    const matchesStatus = filter.status === 'all' || sub.status === filter.status;
    const matchesWindow =
      filter.window === 'all' || (sub.plan.merchant?.billingWindow ?? 0) <= Number(filter.window);
    const matchesSearch =
      sub.user.id.toLowerCase().includes(filter.search.toLowerCase()) ||
      sub.plan.merchant?.id.toLowerCase().includes(filter.search.toLowerCase());
    return matchesStatus && matchesWindow && matchesSearch;
  });

  const handleRequestCharge = (sub: ISubscription) => {
    writeContract({
      address: SubscriptionManagerContractAddress,
      abi: SubscriptionManagerContractABI,
      functionName: 'requestCharge',
      args: [BigInt(sub.id), 97n, '0x'], // Assuming 6 decimals for USDC
    });
  };

  const merchantData = isOpen
    ? (parseJsonOrUndefined(
        hexToString(isOpen?.plan.merchant?.metadataUri as `0x${string}`),
      ) as Record<string, string>)
    : undefined;

  const { adaptersWithBalance: adapters } = useUserAdapterBalance(isOpen?.user.id as `0x${string}`);
  const adapterInfo = useMemo(() => {
    if (isOpen) {
      let tokenWithBalance: IAdapterWithBalance['tokens'][0] | undefined = undefined;
      let adapterWithBalance: IAdapterWithBalance | undefined = undefined;

      for (const adapter of adapters) {
        for (const token of adapter.tokens) {
          if (
            token.balance >= BigInt(isOpen?.plan.price || 0) &&
            (token.allowance || 0) >= BigInt(isOpen?.plan.price || 0)
          ) {
            tokenWithBalance = token;
            adapterWithBalance = adapter;
            break;
          }
          if (token.balance >= BigInt(isOpen?.plan.price || 0)) {
            tokenWithBalance = token;
            adapterWithBalance = adapter;
            break;
          }
        }
      }

      return {
        token: tokenWithBalance,
        adapter: adapterWithBalance,
      };
    }
  }, [adapters, isOpen]);

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
                  const merchantData = parseJsonOrUndefined(
                    hexToString(sub.plan.merchant?.metadataUri as `0x${string}`),
                  ) as Record<string, string>;
                  const planMetadata = parseJsonOrUndefined(
                    hexToString(sub.plan.metadataUri as `0x${string}`),
                  ) as Record<string, string>;
                  const isDue =
                    sub.status == SubscriptionStatus.PAST_DUE ||
                    (sub.nextBillingTime - (sub.plan.merchant?.billingWindow || 0) - Date.now() <=
                      0 &&
                      sub.nextBillingTime +
                        ((sub.plan.merchant?.grace || sub.plan.grace || 0) + sub.nextBillingTime) >
                        Date.now());

                  return (
                    <tr key={sub.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4">
                        <p className="text-sm font-bold font-mono">
                          {truncateAddress(sub.user.id)}
                        </p>
                        <p className="text-[10px] text-neutral-400 uppercase font-bold">
                          SID: {sub.id}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold">{merchantData.title}</p>
                        <p className="text-xs text-neutral-500">
                          {planMetadata.name} •{' '}
                          {formatCurrency(Number(formatUnits(BigInt(sub.plan.price), 18)))}
                        </p>
                      </td>
                      <td className="p-4">
                        <DisplayBalanceAllowanceCharge sub={sub} />
                      </td>
                      <td className="p-4">
                        {sub.status === SubscriptionStatus.CANCELLED ? (
                          <Badge variant="ghost">Cancelled</Badge>
                        ) : isDue ? (
                          <div className="space-y-1">
                            <Badge variant="destructive">Due for Billing</Badge>
                            <p className="text-[10px] text-rose-500 font-bold">
                              Overdue:{' '}
                              {dayjs().from(
                                dayjs(
                                  (sub.nextBillingTime - (sub.plan.merchant?.billingWindow || 0)) *
                                    1000,
                                ),
                              )}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <Badge variant="success">Active</Badge>
                            <p className="text-[10px] text-neutral-400 font-bold">
                              Next:{' '}
                              {dayjs(
                                (sub.nextBillingTime - (sub.plan.merchant?.billingWindow || 0)) *
                                  1000,
                              ).format('MM/DD/YYYY, HH:mm:ss')}
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
                            disabled={!isDue || sub.status === SubscriptionStatus.CANCELLED}
                            onClick={() => setIsOpen(sub)}
                          >
                            <Zap size={12} />
                            Request Charge
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
                          No subscriptions match your current filter criteria.{' '}
                        </EmptyDescription>
                      </EmptyContent>
                    </Empty>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isOpen ? (
        <Dialog
          open={!!isOpen}
          onClose={() => setIsOpen(undefined)}
          title="Request Subscription Charge"
        >
          <DialogBackdrop className="fixed inset-0 bg-black/30" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <div>
                <div className="space-y-6">
                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-neutral-400 uppercase">
                        Subscriber
                      </span>
                      <span className="text-xs font-mono font-bold">
                        {truncateAddress(isOpen.user.id)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-neutral-400 uppercase">Merchant</span>
                      <span className="text-xs font-bold">{merchantData?.title ?? 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-neutral-400 uppercase">
                        Amount Due
                      </span>
                      <span className="text-sm font-bold text-emerald-600">
                        {formatCurrency(Number(formatUnits(BigInt(isOpen.plan.price), 18)))}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-neutral-400 tracking-wider">
                      Chain Status:{' '}
                      {chains.find(chain => chain.id === adapterInfo?.adapter?.id)?.name ?? 'N/A'}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white border border-neutral-100 rounded-xl space-y-1">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase">
                          User Balance
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold">
                            {formatCurrency(
                              Number(formatUnits(adapterInfo?.token?.balance || 0n, 18)),
                            )}{' '}
                            {adapterInfo?.token?.symbol}
                          </p>
                          {(adapterInfo?.token?.balance || 0n) > BigInt(isOpen?.plan.price || 0) ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : (
                            <AlertCircle size={16} className="text-rose-500" />
                          )}
                        </div>
                      </div>
                      <div className="p-4 bg-white border border-neutral-100 rounded-xl space-y-1">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase">
                          Allowance
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-lg font-bold">
                            {formatCurrency(
                              Number(formatUnits(adapterInfo?.token?.allowance || 0n, 18)),
                            )}{' '}
                            {adapterInfo?.token?.symbol}
                          </p>
                          {(adapterInfo?.token?.allowance || 0n) >
                          BigInt(isOpen?.plan.price || 0) ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : (
                            <AlertCircle size={16} className="text-rose-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
                    <Activity className="text-blue-600 shrink-0" size={20} />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Requesting a charge will add an action to the Relay Queue. The charge will be
                      processed once the relay is executed on the target chain.
                    </p>
                  </div>
                </div>
                <div>
                  <Button variant="ghost" onClick={() => setIsOpen(undefined)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleRequestCharge(isOpen)}>Request Charge</Button>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
};
