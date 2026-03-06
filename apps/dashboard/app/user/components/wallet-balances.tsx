import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUserAdapterBalance } from '@/lib/hooks/use-user-adapter-balance';
import { MAP_CHAIN_ID_TO_ICON } from '@/lib/mocks';
import { IAdapter } from '@/lib/models/chains';
import { cn, formatCurrency, truncateAddress } from '@/lib/utils';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDown, Globe, Info, RefreshCw, ShieldCheck } from 'lucide-react';
import { formatUnits } from 'viem';
import { useChains } from 'wagmi';
import { ManageTokenAllowanceModal } from './manage-token-allowance';

type Props = {
  address: `0x${string}`;
  adapters: IAdapter[];
};

export const UserWalletView = ({ address, adapters }: Props) => {
  const chains = useChains();
  const balances = useUserAdapterBalance(address, adapters);
  console.log({ balances });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Cross-Chain Adapters</h2>
          <Badge variant="default" className="gap-1">
            <Globe size={12} />
            {adapters.length} Networks Active
          </Badge>
        </div>

        <div className="space-y-4">
          {balances.adaptersWithBalance.map(adapter => {
            const chain = chains.find(({ id }) => id === Number(adapter.id));
            const Icon =
              MAP_CHAIN_ID_TO_ICON[Number(adapter.id) as keyof typeof MAP_CHAIN_ID_TO_ICON] || '?';

            return (
              <Card key={adapter.id} className="overflow-hidden">
                <Disclosure>
                  <DisclosureButton>
                    <div
                      className="p-6 flex items-center justify-between cursor-pointer hover:bg-neutral-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-sm font-bold">
                          {Icon}
                        </div>
                        <div>
                          <h3 className="font-bold">{chain?.name ?? "Unknown"} {" "}
                            <span className="italic text-xs text-neutral-400">({adapter.id})</span></h3>
                          <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">
                            Billing Adapter
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="hidden sm:block text-right">
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">
                            Total Balance
                          </p>
                          <p className="text-lg font-bold leading-none">
                            {formatCurrency(adapter.totalBalance)}
                          </p>
                        </div>
                        <div className="hidden sm:block text-right">
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">
                            Total Approved
                          </p>
                          <p className="text-lg font-bold leading-none text-emerald-600">
                            {formatCurrency(adapter.totalAllowance)}
                          </p>
                        </div>
                        <div
                          className={cn(
                            'transition-transform duration-200 group-data-open:rotate-180'
                          )}
                        >
                          <ChevronDown size={20} className="text-neutral-400" />
                        </div>
                      </div>
                    </div>
                  </DisclosureButton>

                 <DisclosurePanel>
                    <div className="border-t border-neutral-50 bg-neutral-50/30">
                      <div className="p-4 space-y-2">
                        {adapter.tokens.map(token => (
                          <div
                            key={token.symbol}
                            className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100 shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-neutral-50 rounded-lg flex items-center justify-center text-[10px] font-bold border border-neutral-100">
                                {token?.symbol?.[0] || "US"}
                              </div>
                              <div>
                                <p className="text-sm font-bold">{token.symbol}</p>
                                <p className="text-[10px] font-mono text-neutral-400">
                                  {truncateAddress(token.address)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                  Balance
                                </p>
                                <p className="text-sm font-bold">{(Number(formatUnits(token.balance, token.decimals))).toLocaleString()} {token.symbol}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                  Allowance
                                </p>
                                <p className="text-sm font-bold text-emerald-600">
                                  {(Number(formatUnits(token.allowance ?? 0n, token.decimals))).toLocaleString()}
                                </p>
                              </div>
                             
                             <ManageTokenAllowanceModal adapter={adapter} tokenId={token.address} onComplete={() => {}}  />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                 </DisclosurePanel>
                </Disclosure>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Global Allowances</h2>
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500">Total Approved</span>
              <span className="text-lg font-bold">{("N/A")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500">Total Paid (Lifetime)</span>
              <span className="text-sm font-bold text-neutral-400">
                N/A
              </span>
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                <span>Utilization</span>
                <span>
                  {/* {Math.round((MOCK_STATS.totalApproved / MOCK_STATS.globalLimit) * 100)}% */}
                </span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-500"
                //   style={{ width: `${(MOCK_STATS.totalApproved / MOCK_STATS.globalLimit) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-neutral-400 text-center">
                {/* Against global safety limit of {formatCurrency(MOCK_STATS.globalLimit)} */}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-neutral-50">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 rounded-xl"
            //   onClick={() => setIsLimitModalOpen(true)}
            >
              <ShieldCheck size={18} />
              Manage Global Limits
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 rounded-xl"
            //   onClick={() => setIsRefillModalOpen(true)}
            >
              <RefreshCw size={18} />
              Auto-Refill Settings
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-neutral-900 text-white border-none">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Info size={16} className="text-white" />
            </div>
            <h4 className="font-bold">Security Tip</h4>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Allowances are granted directly to the Billing Adapters. You can revoke or decrease them
            at any time to secure your funds.
          </p>
        </Card>
      </div>

      {/* Allowance Management Modal */}
      {/*  */}

      {/* Global Limits Modal */}
      {/* <Modal
        isOpen={isLimitModalOpen}
        onClose={() => setIsLimitModalOpen(false)}
        title="Manage Global Safety Limits"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsLimitModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsLimitModalOpen(false)} className="rounded-xl">
              Save Limits
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <p className="text-sm text-neutral-500 leading-relaxed">
            Global limits act as an in-app safety net. The application will warn you if your total
            approved allowances exceed this threshold.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-50 uppercase tracking-wider">
                Global Allowance Cap (USD)
              </label>
              <Input type="number" defaultValue={MOCK_STATS.globalLimit} />
            </div>

            <div className="flex items-center gap-3 p-4 border border-neutral-100 rounded-xl bg-neutral-50">
              <div className="flex-1">
                <p className="text-sm font-bold">Hard Cap Enforcement</p>
                <p className="text-xs text-neutral-500">
                  Prevent new subscriptions if limit is reached.
                </p>
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-neutral-300"
                defaultChecked
              />
            </div>
          </div>
        </div>
      </Modal> */}

      {/* Auto-Refill Modal */}
      {/* <Modal
        isOpen={isRefillModalOpen}
        onClose={() => setIsRefillModalOpen(false)}
        title="Auto-Refill Settings"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsRefillModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsRefillModalOpen(false)} className="rounded-xl">
              Enable Auto-Refill
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <Zap size={24} className="text-emerald-600" />
            <div>
              <p className="text-sm font-bold text-emerald-900">Seamless Renewals</p>
              <p className="text-xs text-emerald-700">
                Auto-refill ensures your subscriptions never fail due to low allowance.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase">
                Refill Threshold
              </label>
              <div className="flex items-center gap-3">
                <Input type="number" placeholder="50" className="flex-1" />
                <span className="text-sm font-bold text-neutral-400">USD</span>
              </div>
              <p className="text-[10px] text-neutral-400">
                Trigger refill when allowance drops below this amount.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase">Refill Amount</label>
              <div className="flex items-center gap-3">
                <Input type="number" placeholder="200" className="flex-1" />
                <span className="text-sm font-bold text-neutral-400">USD</span>
              </div>
            </div>

            <div className="p-4 border border-neutral-100 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">Gas Optimization</span>
                <Badge variant="neutral">Recommended</Badge>
              </div>
              <p className="text-xs text-neutral-500">
                Batch refill transactions to save on network fees.
              </p>
            </div>
          </div>
        </div>
      </Modal> */}
    </div>
  );
};
