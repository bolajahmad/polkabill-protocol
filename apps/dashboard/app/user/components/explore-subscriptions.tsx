import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IAdapterWithBalance } from '@/lib/hooks/use-user-adapter-balance';
import { IMerchant } from '@/lib/models/merchants';
import { formatCurrency, truncateAddress } from '@/lib/utils';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { Info, Search } from 'lucide-react';
import { useState } from 'react';
import { formatUnits } from 'viem';

type Props = {
  adapters: IAdapterWithBalance[];
};

export const UserExploreSubscriptionsView = ({ adapters }: Props) => {
  const { data: merchantsData } = useQuery<IMerchant[]>({
    queryKey: ['merchants-list'],
    queryFn: async () => fetch('/api/merchant').then(res => res.json()),
  });
  console.log({ merchantsData });
  const merchants = merchantsData || [];
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);

  // Subscription Flow State
  const [subChain, setSubChain] = useState<string>(adapters?.[0].id.toString());
  const [subToken, setSubToken] = useState<any>(adapters?.[0].tokens[0].address);

  const handleDetails = (plan: any, merchant: any) => {
    setSelectedPlan({ ...plan, merchantName: merchant.name, merchantDesc: merchant.description });
    setIsDetailsOpen(true);
  };

  const handleSubscribe = (plan: any, merchant: any) => {
    setSelectedPlan({ ...plan, merchantName: merchant.name });
    setIsSubscribeOpen(true);
  };

  const selectedAdapter = adapters.find(a => a.id.toString() === subChain);
  const price = selectedPlan?.price || 0;
  const balance = parseFloat(subToken?.balance || '0');
  const allowance = parseFloat(subToken?.allowance || '0');

  const hasBalance = balance >= price;
  const hasAllowance = allowance >= price;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
        <Search className="text-neutral-400" size={20} />
        <input
          type="text"
          placeholder="Search merchants or services..."
          className="flex-1 bg-transparent border-none focus:outline-none text-sm"
        />
        <Button variant="secondary" size="sm" className="rounded-xl">
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {merchants.map(merchant => (
          <Card key={merchant.id} className="overflow-hidden border-neutral-100">
            <div className="p-8 border-b border-neutral-50 bg-neutral-50/30">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center text-xl font-black">
                    {merchant.id[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold tracking-tight">{truncateAddress(merchant.id)}</h3>
                      <Badge variant="default" className="text-[10px]">
                        Tag
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1 max-w-xl">{"N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-right">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Billing Window
                    </p>
                    <p className="text-sm font-bold">{Math.ceil(merchant.billingWindow / 60 / 24)} hr</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Grace Period
                    </p>
                    <p className="text-sm font-bold">{Math.ceil(merchant.grace / 60 / 24)} hr</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {merchant.plans.map(plan => (
                <div
                  key={plan.id}
                  className="p-6 bg-white rounded-2xl border border-neutral-100 hover:border-black/10 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-lg">{plan.id}</h4>
                    <div className="text-right">
                      <p className="text-lg font-bold">{Number(formatUnits(BigInt(plan.price), 18))}</p>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">/ month</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-2 mb-6 h-8">
                    {"Plan Description"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 rounded-xl text-xs h-10"
                      onClick={() => handleSubscribe(plan, merchant)}
                    >
                      Subscribe
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl px-3 h-10"
                      onClick={() => handleDetails(plan, merchant)}
                    >
                      <Info size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Plan Details Modal */}
      <Dialog open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <DialogTitle>Plan Details</DialogTitle>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  {selectedPlan?.merchantName}
                </p>
                <h3 className="text-2xl font-bold">{selectedPlan?.name}</h3>
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-500">Monthly Price</span>
                  <span className="text-xl font-bold">
                    {formatCurrency(selectedPlan?.price || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-500">Billing Interval</span>
                  <span className="text-sm font-bold">Every {selectedPlan?.interval} days</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Description
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                  {selectedPlan?.description}
                </p>
              </div>

              <div className="p-4 border border-neutral-100 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Merchant Info
                </h4>
                <p className="text-xs text-neutral-500 italic">"{selectedPlan?.merchantDesc}"</p>
              </div>
              <Button onClick={() => setIsDetailsOpen(false)} className="rounded-xl">
                Close
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Subscribe Modal */}
      {/* <Dialog
        open={isSubscribeOpen}
        onClose={() => setIsSubscribeOpen(false)}
        title={`Subscribe to ${selectedPlan?.name}`}
      >
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="space-y-6">
              <div className="p-4 bg-neutral-900 text-white rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Total Due Now
                  </p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedPlan?.price || 0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Merchant
                  </p>
                  <p className="font-bold">{selectedPlan?.merchantName}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Payment Chain
                    </label>
                    <select
                      className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      value={subChain}
                      onChange={e => {
                        const chain = e.target.value;
                        setSubChain(chain);
                        const adapter = adapters.find(a => a.id === Number(chain));
                        if (adapter) setSubToken(adapter.tokens[0]);
                      }}
                    >
                      {adapters.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Payment Token
                    </label>
                    <select
                      className="w-full h-10 rounded-xl border border-neutral-200 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      value={subToken?.symbol}
                      onChange={e => {
                        const token = selectedAdapter?.tokens.find(
                          t => t.symbol === e.target.value,
                        );
                        setSubToken(token);
                      }}
                    >
                      {selectedAdapter?.tokens.map(t => (
                        <option key={t.symbol} value={t.symbol}>
                          {t.symbol}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-4 border border-neutral-100 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-neutral-400 uppercase">
                      Your Balance
                    </span>
                    <span className={cn('text-sm font-bold', !hasBalance && 'text-rose-500')}>
                      {subToken?.balance} {subToken?.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-neutral-400 uppercase">
                      Current Allowance
                    </span>
                    <span className={cn('text-sm font-bold', !hasAllowance && 'text-amber-500')}>
                      {subToken?.allowance} {subToken?.symbol}
                    </span>
                  </div>
                </div>

                {!hasBalance && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex gap-2 items-center">
                    <Info size={14} className="text-rose-500" />
                    <p className="text-[10px] text-rose-700 font-bold uppercase">
                      Insufficient balance on this network.
                    </p>
                  </div>
                )}

                {hasBalance && !hasAllowance && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-2 items-center">
                    <ShieldCheck size={14} className="text-amber-500" />
                    <p className="text-[10px] text-amber-700 font-bold uppercase">
                      Allowance approval required for this adapter.
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 flex gap-3">
                <RefreshCw className="text-neutral-400 shrink-0" size={18} />
                <p className="text-[10px] text-neutral-500 leading-relaxed">
                  By subscribing, you authorize the PolkaBill network to automatically charge your
                  selected adapter every {selectedPlan?.interval} days.
                </p>
              </div>

              <div>
                <Button variant="ghost" onClick={() => setIsSubscribeOpen(false)}>
                  Cancel
                </Button>
                {hasBalance && hasAllowance ? (
                  <Button onClick={() => setIsSubscribeOpen(false)} className="rounded-xl gap-2">
                    Confirm Subscription
                  </Button>
                ) : hasBalance ? (
                  <Button
                    onClick={() => setIsSubscribeOpen(false)}
                    className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white border-none gap-2"
                  >
                    <ShieldCheck size={16} />
                    Approve & Subscribe
                  </Button>
                ) : (
                  <Button disabled className="rounded-xl opacity-50 cursor-not-allowed">
                    Insufficient Funds
                  </Button>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog> */}
    </div>
  );
};
