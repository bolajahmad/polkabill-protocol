import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { BASE_CHAIN, SubscriptionManagerContractAddress } from '@/lib/contracts';
import { SubscriptionManagerContractABI } from '@/lib/contracts/abi/subscription-manager.abi';
import { IAdapterWithBalance } from '@/lib/hooks/use-user-adapter-balance';
import { IMerchant, IPlan } from '@/lib/models/merchants';
import {
  cn,
  formatDuration,
  handleContractError,
  parseJsonOrUndefined,
  truncateAddress,
} from '@/lib/utils';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { Info, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { formatUnits, hexToString } from 'viem';
import { useChains, useConnection, useSwitchChain, useWriteContract } from 'wagmi';

const ViewPlanDetailsModal = ({ plan, merchant }: { plan: IPlan; merchant: IMerchant }) => {
  const [isOpen, setOpen] = useState(false);

  const merchantData = parseJsonOrUndefined(
    hexToString(merchant.metadataUri as `0x${string}`),
  ) as Record<string, string>;
  const planMetadata = parseJsonOrUndefined(hexToString(plan.metadataUri as `0x${string}`)) as Record<
    string,
    string
  >;

  return (
    <>
      <Button variant="outline" className="rounded-xl px-3 h-10" onClick={() => setOpen(true)}>
        <Info size={16} />
      </Button>
      <Dialog open={isOpen} onClose={() => setOpen(false)}>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <DialogTitle>Plan Details</DialogTitle>

            <div className="space-y-6 mt-6">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  {merchantData.title || ''}
                </p>
                <h3 className="text-2xl font-bold">{planMetadata.name || "N/A"}</h3>
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-500">Plan Price</span>
                  <span className="text-xl font-bold">
                    ${Number(formatUnits(BigInt(plan?.price || 0), 18)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-500">Billing Interval</span>
                  <span className="text-sm font-bold">
                    Every {formatDuration(plan.billingInterval)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Description
                </h4>
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                  {planMetadata.description || "N/A"}
                </p>
              </div>

              <div className="p-4 border border-neutral-100 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Merchant Info
                </h4>
                <p className="text-xs text-neutral-500 italic">{merchantData.description || "N/A"}</p>
              </div>
              <Button onClick={() => setOpen(false)} className="rounded-xl">
                Close
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

const SubscribeToPlan = ({ plan, adapters, merchant }: { plan: IPlan; adapters: IAdapterWithBalance[]; merchant: IMerchant }) => {
  const [isOpen, setOpen] = useState(false);
  const { chain } = useConnection();
  const [paymentChain, setPaymentChain] = useState('');
  const [paymentToken, setPaymentToken] = useState('');
  const { mutate: switchChain } = useSwitchChain();
  const chains = useChains();
  const { mutate: subscribe, isPending } = useWriteContract({
    mutation: {
      onError: error => {
        const message = handleContractError(error);
        toast.error(message || 'Subscription Failed');
      },
      onSuccess: data => console.log({ data }),
    },
  });

  const { adapter, token } = useMemo(() => {
    const adapter = adapters.find(({ id }) => id == Number(paymentChain.split('/')[0]));
    const token = adapter?.tokens.find(({ address }) => address === paymentToken.split('/')[0]);

    return { adapter, token };
  }, [paymentChain, paymentToken, adapters]);

  const handleSubscribe = (plan: IPlan) => {
    if (chain?.id !== BASE_CHAIN.id) return;
    subscribe({
      abi: SubscriptionManagerContractABI,
      address: SubscriptionManagerContractAddress,
      functionName: 'subscribe',
      args: [BigInt(plan.id), BigInt(adapter?.id || 0), token?.address as `0x${string}`],
      chain: chain!,
    });
  };

  const planMetadata = parseJsonOrUndefined(hexToString(plan.metadataUri as `0x${string}`)) as Record<
    string,
    string
  >;
  const merchantData = parseJsonOrUndefined(
    hexToString(merchant?.metadataUri as `0x${string}`),
  ) as Record<string, string>;

  useEffect(() => {
    if (chain?.id !== BASE_CHAIN.id) switchChain({ chainId: BASE_CHAIN.id });
  }, [chains, chain, switchChain]);

  return (
    <>
      <Button className="flex-1 rounded-xl text-xs h-10" onClick={() => setOpen(true)}>
        Subscribe
      </Button>
      <Dialog open={isOpen} onClose={() => setOpen(false)}>
        <DialogBackdrop className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-6">
            <DialogTitle>Subscribe to {planMetadata.name || ("#" + plan.id)}</DialogTitle>
            <div className="space-y-6">
              <div className="p-4 bg-neutral-900 text-white rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Total Due Now
                  </p>
                  <p className="text-2xl font-bold">
                    ${Number(formatUnits(BigInt(plan?.price || 0), 18)).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Merchant
                  </p>
                  <p className="font-bold">{truncateAddress(merchantData.title || '')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Payment Chain
                    </label>
                    <Select
                      value={paymentChain || ''}
                      onValueChange={value => {
                        setPaymentChain(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="--- Select chain ---">
                          {paymentChain?.split('/')[1]} ({paymentChain?.split('/')[0]})
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {adapters.map(({ address, id, tokens }) => (
                          <SelectItem
                            key={address + id}
                            value={`${id.toString()}/${
                              chains.find(chain => chain.id === Number(id))?.name || 'Unknown'
                            }`}
                          >
                            {tokens.length < 1 ? (
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
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Payment Token
                    </label>
                    <Select value={paymentToken} onValueChange={value => setPaymentToken(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="--- Select token ---">
                          {paymentToken?.split('/')[1]} ({paymentToken?.split('/')[0]})
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {adapters
                          .find(({ id }) => id == Number(paymentChain.split('/')[0]))
                          ?.tokens.map(({ address, symbol }) => (
                            <SelectItem key={address} value={`${address.toString()}/${symbol}`}>
                              {
                                <span className="flex flex-col gap-1">
                                  <span>{symbol ?? 'N/A'}</span>
                                  <span className="text-xs text-neutral-900">
                                    {truncateAddress(address)}
                                  </span>
                                </span>
                              }
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 border border-neutral-100 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-neutral-400 uppercase">
                      Your Balance
                    </span>
                    <span
                      className={cn(
                        'text-sm font-bold',
                        !token || (token?.balance < plan.price && 'text-rose-500'),
                      )}
                    >
                      {Number(
                        formatUnits(BigInt(token?.balance || 0), token?.decimals || 18),
                      ).toLocaleString()}{' '}
                      {token?.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-neutral-400 uppercase">
                      Current Allowance
                    </span>
                    <span
                      className={cn(
                        'text-sm font-bold',
                        !token || ((token.allowance || 0) < plan.price && 'text-amber-500'),
                      )}
                    >
                      {Number(
                        formatUnits(BigInt(token?.allowance || 0), token?.decimals || 18),
                      ).toLocaleString()}{' '}
                      {token?.symbol}
                    </span>
                  </div>
                </div>

                {(!token || token.balance < plan.price) && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex gap-2 items-center">
                    <Info size={14} className="text-rose-500" />
                    <p className="text-[10px] text-rose-700 font-bold uppercase">
                      Insufficient balance on this network.
                    </p>
                  </div>
                )}

                {token && token.balance >= plan.price && (token.allowance || 0) < plan.price && (
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
                  selected adapter every {Math.round(plan.billingInterval / 60 / 24)} days.
                </p>
              </div>

              <div>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                {token && token?.balance >= plan.price && (token.allowance || 0) >= plan.price ? (
                  <Button
                    disabled={isPending || !token || !adapter}
                    onClick={() => handleSubscribe(plan)}
                    className="rounded-xl gap-2"
                  >
                    {isPending ? <Spinner /> : null}
                    Confirm Subscription
                  </Button>
                ) : token && token.balance >= plan.price ? (
                  <Button
                    onClick={() => setOpen(false)}
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
      </Dialog>
    </>
  );
};

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
        {merchants.map(merchant => {
          const metadata = parseJsonOrUndefined(
            hexToString(merchant.metadataUri as `0x${string}`),
          ) as Record<string, string>;
          return (
            <Card key={merchant.id} className="overflow-hidden border-neutral-100">
              <div className="p-8 border-b border-neutral-50 bg-neutral-50/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center text-xl font-black">
                      {merchant.id[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold tracking-tight">
                          {metadata?.title ?? ''}
                        </h3>
                        <ul className="flex items-center">
                          {metadata.industry.split(',').map(tag => (
                            <li key={tag}>
                              <Badge variant="default" className="text-[10px] capitalize">
                                {tag.trim()}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <p className="text-sm text-neutral-500 mt-1 max-w-xl">
                        {metadata.description || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-right">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                        Billing Window
                      </p>
                      <p className="text-sm font-bold">{formatDuration(merchant.billingWindow)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                        Grace Period
                      </p>
                      <p className="text-sm font-bold">{formatDuration(merchant.grace)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {merchant.plans.map(plan => {
                  const metadata = parseJsonOrUndefined(
                    hexToString(plan.metadataUri as `0x${string}`),
                  ) as Record<string, string>;

                  return (
                    <div
                      key={plan.id}
                      className="p-6 bg-white rounded-2xl border border-neutral-100 hover:border-black/10 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-lg">{metadata.name}</h4>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            ${Number(formatUnits(BigInt(plan.price), 18))}
                            <span className="text-[10px] text-neutral-400 font-bold uppercase">
                              / {formatDuration(plan.billingInterval)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-2 mb-6 h-8">
                        {metadata.description || 'N/A'}
                      </p>
                      <div className="flex gap-2">
                        <SubscribeToPlan plan={plan} adapters={adapters} merchant={merchant} />

                        <ViewPlanDetailsModal plan={plan} merchant={merchant} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
