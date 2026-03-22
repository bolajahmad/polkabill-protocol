import { EmptyState } from '@/components/misc/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { ISubscription, SubscriptionStatus } from '@/lib/models/subscriptions';
import {
  cn,
  formatCurrency,
  formatDuration,
  handleContractError,
  parseJsonOrUndefined,
  truncateAddress,
} from '@/lib/utils';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Clock, CreditCard, Globe, Info, Search, ShieldCheck, Zap } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { erc20Abi, formatUnits, hexToString, parseUnits } from 'viem';
import { baseSepolia } from 'viem/chains';
import { useChains, useConnection, useSwitchChain, useWriteContract } from 'wagmi';
dayjs.extend(relativeTime);

type Props = {
  subscriptions: ISubscription[];
  userId: string;
  adapters: IAdapterWithBalance[];
};
export const UserSubscriptionsList = ({ subscriptions, userId, adapters }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAllowance, setNewAllowance] = useState('');
  const chains = useChains();
  const { mutate: switchChain } = useSwitchChain({
    mutation: {
      onSettled: () => setIsSubmitting(false),
    },
  });
  const { chain } = useConnection();
  const [selectedSub, setSelectedSub] = useState<ISubscription>();
  const [paymentChain, setPaymentChain] = useState('');
  const [paymentToken, setPaymentToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState<'charge' | 'approve' | 'cancel' | false>(false);
  const { mutate: writeContract } = useWriteContract({
    mutation: {
      onError: error => {
        const message = handleContractError(error);
        toast.error(message || 'Transaction failed!');
        console.log({ error });
      },
      onSettled: () => setIsSubmitting(false),
    },
  });

  const handleManage = (sub: ISubscription) => {
    setSelectedSub(sub);
    setIsModalOpen(true);
  };

  const canBillUser = (sub: ISubscription) => {
    const now = Date.now();
    const window = sub.nextBillingTime - (sub.plan.merchant?.billingWindow || 0);
    const grace =
      ((sub.plan.grace ? sub.plan.grace : sub.plan.merchant?.grace) || 0) + sub.nextBillingTime;

    return now >= window && now <= grace;
  };
  const { adapter, token } = useMemo(() => {
    const adapter = adapters.find(({ id }) => id == Number(paymentChain.split('/')[0]));
    const token = adapter?.tokens.find(({ address }) => address === paymentToken.split('/')[0]);

    return { adapter, token };
  }, [paymentChain, adapters, paymentToken]);

  const payForSubscription = () => {
    if (!selectedSub || !adapter || !token) return;

    setIsSubmitting('charge');

    if (chain?.id !== BASE_CHAIN.id) {
      switchChain({ chainId: BASE_CHAIN.id });
    }

    writeContract(
      {
        abi: SubscriptionManagerContractABI,
        address: SubscriptionManagerContractAddress,
        functionName: 'requestCharge',
        args: [BigInt(selectedSub.id), BigInt(adapter.id), token.address],
        chain: BASE_CHAIN,
      },
      {
        onSuccess: () => {
          toast.success('Charge request submitted!');
        },
      },
    );
  };
  const cancelSubscription = () => {
    if (!selectedSub) return;

    setIsSubmitting('cancel');

    if (chain?.id !== BASE_CHAIN.id) {
      switchChain({ chainId: BASE_CHAIN.id });
    }

    writeContract(
      {
        abi: SubscriptionManagerContractABI,
        address: SubscriptionManagerContractAddress,
        functionName: 'cancel',
        args: [BigInt(selectedSub?.id || 0)],
        chainId: BASE_CHAIN.id,
      },
      {
        onSuccess: () => toast.success('Subscription cancelled successfully'),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptions?.length ? (
          subscriptions.map(sub => {
            const merchant = sub.plan.merchant;
            const merchantMetadata = parseJsonOrUndefined(
              hexToString(merchant?.metadataUri as `0x${string}`),
            ) as Record<string, string>;
            const price = Number(formatUnits(BigInt(sub.plan.price), 18));
            const metadata = parseJsonOrUndefined(
              hexToString(sub.plan.metadataUri as `0x${string}`),
            ) as Record<string, string>;
            const nextBilling = sub.nextBillingTime - (sub.plan.merchant?.billingWindow || 0);
            const status =
              nextBilling * 1000 - Date.now() > 0
                ? sub.status
                : canBillUser(sub)
                  ? SubscriptionStatus.PAST_DUE
                  : SubscriptionStatus.CANCELLED;

            return (
              <Card key={sub.id} className="group hover:border-black/10 transition-all">
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center font-bold text-neutral-600">
                        {sub.id}
                      </div>
                      <div>
                        <h3 className="font-bold">{merchantMetadata.title || 'N/A'}</h3>
                        <p className="text-xs text-neutral-500 uppercase font-bold tracking-wider">
                          {metadata.name || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">{status}</Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                          Price
                        </p>
                        <p className="text-2xl font-bold">
                          ${price.toLocaleString()}
                          <span className="text-xs text-neutral-400 font-normal">
                            /{formatDuration(sub.plan.billingInterval)}
                          </span>
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                          Next Billing
                        </p>
                        <p className="text-sm font-bold flex items-center gap-1 justify-end">
                          <Clock size={12} className="text-neutral-400" />
                          {nextBilling * 1000 - Date.now() > 10 * 60000 ? (
                            <span>
                              {nextBilling
                                ? new Date(nextBilling * 1000).toLocaleDateString()
                                : 'N/A'}{' '}
                              {nextBilling
                                ? new Date(nextBilling * 1000).toLocaleTimeString()
                                : 'N/A'}
                            </span>
                          ) : (
                            <span>{dayjs().to(dayjs(nextBilling * 1000), true)}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-100">
                      <Globe size={14} className="text-neutral-400" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                        Total Paid: {sub.billingCycle > 1 ? sub.billingCycle * price : 0} USD
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handleManage(sub)}
                    className="w-full rounded-xl group-hover:bg-black group-hover:text-white transition-colors"
                  >
                    Manage Subscription
                  </Button>

                  <Dialog
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={`Manage ${selectedSub?.id} Subscription`}
                  >
                    {/* Backdrop */}
                    <DialogBackdrop className="fixed inset-0 bg-black/30" aria-hidden="true" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                      <DialogPanel className="space-y-6 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        {!!selectedSub && canBillUser(selectedSub) && (
                          <div className="space-y-4 p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Zap size={18} className="text-amber-500" />
                                <span className="text-sm font-bold">Manual Payment Trigger</span>
                              </div>
                              <Badge variant="success">Window Open</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label htmlFor="chain" className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                  Select Chain
                                </label>
                                <Select
                                  value={paymentChain || ''}
                                  onValueChange={value => {
                                    setPaymentChain(value);
                                  }}
                                >
                                  <SelectTrigger className="w-full" id="chain">
                                    <SelectValue placeholder="--- Select chain ---">
                                      {paymentChain?.split('/')[1]} ({paymentChain?.split('/')[0]})
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent position="item-aligned">
                                    {adapters.map(({ address, id, tokens }) => (
                                      <SelectItem
                                        key={address}
                                        value={`${id.toString()}/${
                                          chains.find(chain => chain.id === Number(id))?.name ||
                                          'Unknown'
                                        }`}
                                      >
                                        {tokens.length < 1 ? (
                                          <Spinner />
                                        ) : (
                                          <span className="flex flex-col gap-1">
                                            <span>
                                              {chains.find(chain => chain.id === Number(id))
                                                ?.name || 'Unknown'}
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
                                <label htmlFor="token" className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                  Select Token
                                </label>
                                <Select
                                  value={paymentToken}
                                  id="token"
                                  onValueChange={value => setPaymentToken(value)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="--- Select token ---">
                                      {paymentToken?.split('/')[1]} ({paymentToken?.split('/')[0]})
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent position="item-aligned">
                                    {adapters
                                      .find(({ id }) => id == Number(paymentChain.split('/')[0]))
                                      ?.tokens.map(({ address, symbol }) => (
                                        <SelectItem
                                          key={address}
                                          value={`${address.toString()}/${symbol}`}
                                        >
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

                            {token && (
                              <div className="p-4 bg-white rounded-xl border border-neutral-100 space-y-3 shadow-sm">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-neutral-500">Available Balance</span>
                                  <span
                                    className={cn(
                                      'font-bold',
                                      token?.balance < selectedSub.plan.price && 'text-rose-500',
                                    )}
                                  >
                                    {Number(
                                      formatUnits(token.balance, token.decimals),
                                    ).toLocaleString()}{' '}
                                    {token.symbol}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-neutral-500">Current Allowance</span>
                                  <span
                                    className={cn(
                                      'font-bold',
                                      (token.allowance || 0) < selectedSub.plan.price &&
                                        'text-amber-500',
                                    )}
                                  >
                                    {Number(
                                      formatUnits(token.allowance || 0n, token.decimals),
                                    ).toLocaleString()}{' '}
                                    {token.symbol}
                                  </span>
                                </div>
                                <div className="pt-2 border-t border-neutral-50 flex justify-between items-center">
                                  <span className="text-xs font-bold uppercase text-neutral-400">
                                    Payment Due
                                  </span>
                                  <span className="text-lg font-bold">{formatCurrency(price)}</span>
                                </div>
                              </div>
                            )}

                            {token && token.balance < selectedSub.plan.price ? (
                              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex gap-2 items-center">
                                <Info size={14} className="text-rose-500" />
                                <p className="text-[10px] text-rose-700 font-bold uppercase">
                                  Insufficient Balance. Please choose another token.
                                </p>
                              </div>
                            ) : token && (token.allowance || 0) < selectedSub.plan.price ? (
                              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-2 items-center">
                                <ShieldCheck size={14} className="text-amber-500" />
                                <p className="text-[10px] text-amber-700 font-bold uppercase">
                                  Allowance required to proceed.
                                </p>
                              </div>
                            ) : null}

                            <div className="flex gap-2">
                              {token && token.balance < selectedSub.plan.price ? (
                                <Button
                                  className="w-full rounded-xl opacity-50 cursor-not-allowed"
                                  disabled
                                >
                                  Insufficient Funds
                                </Button>
                              ) : token && (token.allowance || 0) < selectedSub.plan.price ? (
                                <Button className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white border-none gap-2">
                                  <ShieldCheck size={16} />
                                  Approve & Pay
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => payForSubscription()}
                                  className="w-full rounded-xl gap-2"
                                >
                                  {isSubmitting == 'charge' ? <Spinner /> : <Zap size={16} />}
                                  Trigger Payment Now
                                </Button>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                              Allowance Settings
                            </h4>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 border border-neutral-100 rounded-xl">
                              <div>
                                <p className="text-sm font-bold">Current Allowance</p>
                                <p className="text-xs text-neutral-500">
                                  {chains.find(({ id }) => id == adapter?.id)?.name || 'Unknown'} (
                                  {token?.symbol})
                                </p>
                              </div>
                              <p className="font-mono font-bold">
                                {Number(
                                  formatUnits(token?.allowance || 0n, token?.decimals || 18),
                                ).toLocaleString()}{' '}
                                {token?.symbol}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <label htmlFor="allowance" className="text-xs font-bold text-neutral-500 uppercase">
                                Update Allowance
                              </label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  value={newAllowance}
                                  id="allowance"
                                  onChange={e => {
                                    if (paymentChain.length) {
                                      const cid = Number(paymentChain.split('/')[0]) as any;
                                      if (cid !== chain?.id) switchChain({ chainId: cid });
                                    }
                                    setNewAllowance(e.target.value);
                                  }}
                                  placeholder="New Amount"
                                  className="flex-1"
                                />
                                <Button
                                  onClick={() => {
                                    writeContract({
                                      abi: erc20Abi,
                                      address: token?.address as `0x${string}`,
                                      functionName: 'approve',
                                      args: [
                                        adapter?.address as `0x${string}`,
                                        parseUnits(newAllowance, token?.decimals || 18),
                                      ],
                                      chainId: Number(adapter?.id) as any,
                                    });
                                  }}
                                  variant="secondary"
                                >
                                  {isSubmitting == 'approve' ? <Spinner /> : 'Update'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full flex items-center">
                          <Button
                            variant="danger"
                            onClick={() => cancelSubscription()}
                            className="mr-auto rounded-xl"
                          >
                            {isSubmitting == 'cancel' ? <Spinner /> : null}
                            Cancel Subscription
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              switchChain({ chainId: baseSepolia.id as any });
                              setIsModalOpen(false);
                            }}
                          >
                            Close
                          </Button>
                          <Button onClick={() => setIsModalOpen(false)} className="rounded-xl">
                            Update Settings
                          </Button>
                        </div>
                      </DialogPanel>
                    </div>
                  </Dialog>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full">
            <EmptyState
              icon={CreditCard}
              title="No Active Subscriptions"
              description="You haven't subscribed to any services yet. Explore the marketplace to find and subscribe to merchants."
              footer={
                <Button onClick={() => {}} className="gap-2 rounded-xl">
                  <Search size={18} />
                  Explore Marketplace
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
