import { Dialog, DialogBackdrop, DialogPanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { SubscribeButton } from '@polkabill/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronDown,
  CreditCard,
  ExternalLink,
  Loader2,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Wallet,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { erc20Abi, formatUnits, parseUnits, zeroAddress } from 'viem';
import { injected, useConnect, useConnection, useDisconnect, useSwitchChain, useWriteContract } from 'wagmi';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { useUserAdapterBalance } from './hooks/use-wallet-stables-balances';
import { cn, formatCurrency, truncateAddress } from './utils';
import { MOCK_PLANS, SUPPORTED_CHAINS } from './utils/mocks';

export const App = () => {
  const { mutate: connect } = useConnect();
  const { mutate: disconnect } = useDisconnect();
  const { mutate: switchChain } = useSwitchChain()
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [step, setStep] = useState<'select' | 'approve' | 'confirm' | 'success'>('select');
  const [selectedChain, setSelectedChain] = useState('');
  const [selectedToken, setSelectedToken] = useState('');
  const { address, isConnected, chainId } = useConnection();
  const {
    mutate: writeApproveAllowance,
    isError,
    error,
    isPending: isApproving,
    data: txHash,
  } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setStep('success');
      },
    },
  });

  const { adaptersWithBalance: adapters } = useUserAdapterBalance(address ?? zeroAddress);

  const handleSubscribeClick = async (plan: any) => {
    setSelectedPlan(plan);
    setStep('confirm'); // Start with confirmation of intent
  };

  const { token, adapter } = useMemo(() => {
    if (selectedChain) {
      const adapter = adapters.find(({ id }) => id == Number(selectedChain));

      const token = adapter?.tokens.find(({ address }) => address == selectedToken);

      return {
        adapter,
        token,
      };
    } else {
      return {
        token: undefined,
        adapter: undefined,
      };
    }
  }, [adapters, selectedChain, selectedToken]);

  const hasAllowance =
    Number(formatUnits(BigInt(token?.allowance ?? 0n), token?.decimals || 18)) >=
    Number(selectedPlan?.price || 0);
  const hasBalance =
    Number(formatUnits(BigInt(token?.balance ?? 0n), token?.decimals || 18)) >=
    Number(selectedPlan?.price || 0);

  const handleApprove = async () => {
    if (!adapter || !token) {
      alert('Please select a Chain and Token address');
    } else {
      if (chainId !== adapter.id) {
        switchChain({ chainId: adapter.id as any });
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      writeApproveAllowance({
        abi: erc20Abi,
        address: adapter.address as `0x${string}`,
        functionName: 'approve',
        args: [
          adapter.address as `0x${string}`,
          parseUnits(selectedPlan.price.toString(), token.decimals),
        ],
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      {/* Merchant Header */}
      <header className="bg-white border-b border-neutral-200 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-bold text-lg tracking-tight">SaaSFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-500">
            <span className="hover:text-black transition-colors">Features</span>
            <span className="text-black">Pricing</span>
            <span className="hover:text-black transition-colors">Docs</span>
          </nav>

          <div className="flex items-center gap-2 pl-2 border-l border-neutral-100">
            {isConnected ? (
              <Menu as="div" className="relative">
                {({ open }) => (
                  <>
                    <MenuButton className="gap-2 rounded-xl" as="div">
                      <Button variant="secondary" size="sm">
                        <Wallet size={14} />
                        <span className="hidden sm:inline">{truncateAddress(address ?? '')}</span>
                        <ChevronDown
                          size={14}
                          className={cn('transition-transform', open && 'rotate-180')}
                        />
                      </Button>
                    </MenuButton>

                    <MenuItems className="absolute top-full mt-2 right-0 w-48 bg-white border border-neutral-100 rounded-2xl shadow-xl p-2 z-100">
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            onClick={() => connect({ connector: injected() })}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left font-medium',
                              focus ? 'bg-neutral-50' : '',
                            )}
                          >
                            <RefreshCw size={14} className="text-neutral-400" />
                            Switch Wallet
                          </button>
                        )}
                      </MenuItem>
                      <div className="h-px bg-neutral-50 my-1" />
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            onClick={() => disconnect()}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-600 text-sm transition-colors text-left font-medium',
                              focus ? 'bg-rose-50' : '',
                            )}
                          >
                            <LogOut size={14} />
                            Disconnect
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </>
                )}
              </Menu>
            ) : (
              <Button
                onClick={() => connect({ connector: injected() })}
                variant="default"
                size="sm"
                className="gap-2 rounded-xl"
              >
                <Wallet size={14} />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-16">
          <Badge
            variant="ghost"
            className="rounded-full px-4 py-1 border-neutral-200 text-neutral-500 bg-transparent border"
          >
            Simple Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Choose the right plan for your team
          </h1>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Join over 10,000 teams using SaaSFlow to accelerate their development workflow.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {MOCK_PLANS.map(plan => (
            <Card
              key={plan.id}
              className={cn(
                'p-8 flex flex-col h-full relative transition-all hover:shadow-xl hover:-translate-y-1',
                plan.popular ? 'border-black ring-1 ring-black' : 'border-neutral-200',
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-neutral-400 text-sm">/mo</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-neutral-600">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribeClick(plan)}
                className={cn(
                  'w-full rounded-xl py-6 font-bold text-base transition-all',
                  plan.popular
                    ? 'bg-black text-white hover:bg-neutral-800'
                    : 'bg-white text-black border border-neutral-200 hover:bg-neutral-50',
                )}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>

        {/* SDK Integration Note */}
        <div className="mt-20 max-w-3xl mx-auto p-8 bg-white rounded-3xl border border-neutral-200 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg">Powered by PolkaBill SDK</h4>
              <p className="text-sm text-neutral-500">
                Seamless Web3 recurring payments integrated in minutes.
              </p>
            </div>
          </div>
          <div className="bg-neutral-900 rounded-xl p-4 font-mono text-xs text-neutral-400 overflow-x-auto">
            <pre>{`import { usePolkaBill } from "@polkabill/sdk-react";

const MyComponent = () => {
  const { subscribe } = usePolkaBill();

  return (
    <button onClick={() => subscribe({ planId: "plan_pro" })}>
      Subscribe Now
    </button>
  );
};`}</pre>
          </div>
        </div>
      </main>

      {/* Subscription Modal (Simulating SDK UI) */}
      <Dialog
        open={!!selectedPlan}
        onClose={() => {}}
        title={step === 'success' ? 'Subscription Confirmed' : `Subscribe to ${selectedPlan?.name}`}
      >
        <DialogBackdrop className="fixed inset-0 bg-black/50" />

        <AnimatePresence mode="wait">
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="bg-white rounded-lg shadow-lg max-w-md w-full space-y-4 p-6">
              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 py-4"
                >
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard size={32} />
                    </div>
                    <h3 className="text-xl font-bold">Confirm Subscription</h3>
                    <p className="text-sm text-neutral-500">
                      You are about to subscribe to the {selectedPlan?.name} plan.
                    </p>
                  </div>

                  <Card className="p-4 bg-neutral-50 border-neutral-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">
                          Plan
                        </span>
                        <span className="text-sm font-bold">{selectedPlan?.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">
                          Amount
                        </span>
                        <span className="text-sm font-bold">
                          {formatCurrency(selectedPlan?.price)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">
                          Frequency
                        </span>
                        <span className="text-sm font-bold">1 hr</span>
                      </div>
                    </div>
                  </Card>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                        Payment Network
                      </label>
                      <Select
                        value={selectedChain}
                        onValueChange={value => setSelectedChain(value)}
                      >
                        <SelectTrigger id="form-rhf-select-token" className="w-full">
                          <SelectValue placeholder="--- Select chain ---" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {SUPPORTED_CHAINS.map(p => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
                        Token
                      </label>
                      <Select
                        value={selectedToken}
                        onValueChange={value => setSelectedToken(value)}
                      >
                        <SelectTrigger id="form-rhf-select-token" className="w-full">
                          <SelectValue placeholder="--- Select token ---" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {(
                            SUPPORTED_CHAINS.find(({ id }) => id.toString() == selectedChain)
                              ?.tokens || []
                          )?.map(p => (
                            <SelectItem key={p} value={p.toString()}>
                              {truncateAddress(p)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-4 border border-neutral-100 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-500">Current Balance</span>
                      <span
                        className={cn('font-bold', hasBalance ? 'text-black' : 'text-rose-500')}
                      >
                        {formatCurrency(
                          Number(formatUnits(BigInt(token?.balance || 0), token?.decimals || 18)),
                        )}{' '}
                        {token?.symbol}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-500">Current Allowance</span>
                      <span
                        className={cn(
                          'font-bold',
                          hasAllowance ? 'text-emerald-600' : 'text-amber-500',
                        )}
                      >
                        {hasAllowance
                          ? formatCurrency(
                              Number(
                                formatUnits(BigInt(token?.allowance || 0), token?.decimals || 18),
                              ),
                            )
                          : '0'}{' '}
                        {token?.symbol}
                      </span>
                    </div>
                  </div>

                  <SubscribeButton
                    planId={Number(selectedPlan.id)}
                    chainId={Number(selectedChain)}
                    token={selectedToken}
                    onComplete={() => {
                      if (
                        Number(formatUnits(BigInt(token?.allowance || 0), token?.decimals || 18)) <
                        Number(selectedPlan?.price || 0)
                      ) {
                        setStep('approve');
                      } else {
                        setStep('success');
                      }
                    }}
                  />
                </motion.div>
              )}

              {step === 'approve' && (
                <motion.div
                  key="approve"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 py-4"
                >
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-amber-900">Subscription Registered!</p>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Your subscription is active, but you need to grant a spending allowance for{' '}
                        {selectedToken} to enable automatic billing.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border border-neutral-100 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-500">Allowance Amount</span>
                      <span className="font-bold text-emerald-600">Unlimited</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-neutral-500">Status</span>
                      <Badge variant="secondary">Awaiting Approval</Badge>
                    </div>
                  </div>

                  {isError ? (
                    <div className="text-red-600 font-bold text-sm">
                      {error.message || 'An error occurred while submitting the transaction.'}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      onClick={handleApprove}
                      // disabled={isApproving}
                      className="w-full py-6 rounded-2xl font-bold gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isApproving ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          Grant Approval Now
                          <ShieldCheck size={18} />
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setStep('success')}
                      className="text-neutral-400 hover:text-black"
                    >
                      I'll approve later
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-8"
                >
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Welcome to {selectedPlan?.name}!</h3>
                    <p className="text-neutral-500">
                      Your subscription has been successfully activated.
                    </p>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2">
                    <p className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest">
                      Transaction Hash
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-600">
                      {txHash ? `${txHash.slice(0, 12)}...${txHash.slice(-10)}` : 'N/A'}
                      <ExternalLink size={12} className="text-neutral-400" />
                    </div>
                  </div>

                  <Button
                    onClick={() => setSelectedPlan(null)}
                    className="w-full py-4 rounded-xl font-bold"
                  >
                    Go to Dashboard
                  </Button>
                </motion.div>
              )}
            </DialogPanel>
          </div>
        </AnimatePresence>
      </Dialog>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">
                S
              </div>
              <span className="font-bold text-lg tracking-tight">SaaSFlow</span>
            </div>
            <p className="text-sm text-neutral-500 max-w-xs">
              The ultimate platform for teams to build, deploy, and scale their applications with
              ease.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-sm">Product</h5>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li>
                <span className="hover:text-black transition-colors">Features</span>
              </li>
              <li>
                <span className="hover:text-black transition-colors">Pricing</span>
              </li>
              <li>
                <span className="hover:text-black transition-colors">Security</span>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold text-sm">Company</h5>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li>
                <span className="hover:text-black transition-colors">About</span>
              </li>
              <li>
                <span className="hover:text-black transition-colors">Blog</span>
              </li>
              <li>
                <span className="hover:text-black transition-colors">Careers</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neutral-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
          <p>© 2024 SaaSFlow Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-black transition-colors">Privacy Policy</span>
            <span className="hover:text-black transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
