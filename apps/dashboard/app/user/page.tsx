'use client';

import { useUserAdapterBalance } from '@/lib/hooks/use-user-adapter-balance';
import { IAdapter } from '@/lib/models/chains';
import { IUser } from '@/lib/models/user';
import { cn } from '@/lib/utils';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { useQuery } from '@tanstack/react-query';
import { zeroAddress } from 'viem';
import { useConnection } from 'wagmi';
import { UserExploreSubscriptionsView } from './components/explore-subscriptions';
import { UserSubscriptionsList } from './components/user-subscriptions';
import { UserWalletView } from './components/wallet-balances';

export default function LandingPage() {
  const { isConnected, address, isConnecting } = useConnection();
  const { data, isLoading } = useQuery<{ data: IAdapter[] }>({
    queryKey: ['chain-list'],
    queryFn: async () => fetch('/api/admin/chains').then(res => res.json()),
  });
  const adapters = data?.data || [];
  const adapterBalances = useUserAdapterBalance(address as `0x${string}`, adapters);
  console.log({ adapterBalances });

  const { data: user, isLoading: fetchingUser } = useQuery<IUser>({
    queryKey: ['user-information', address],
    queryFn: async () => fetch(`/api/users/${address}`).then(res => res.json()),
    enabled: isConnected && !!address,
  });
  const subscriptions = user?.subscriptions || [];

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 p-6 md:p-12">
      <TabGroup>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Subscriber Portal</h1>
              <p className="text-neutral-500 mt-1">
                Manage your subscriptions and cross-chain balances.
              </p>
            </div>
          </div>
          <TabList className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl">
            {['my-subs', 'explore', 'wallet'].map(tab => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  cn(
                    'px-6 py-2 rounded-xl text-sm font-bold transition-all capitalize',
                    selected
                      ? 'bg-white shadow-sm text-black'
                      : 'text-neutral-500 hover:text-black',
                  )
                }
              >
                {tab.split('-').join(' ')}
              </Tab>
            ))}
          </TabList>
        </div>

        <TabPanels className="pt-4">
          <TabPanel>
            {user ? (
              <UserSubscriptionsList
                adapters={adapterBalances.adaptersWithBalance}
                subscriptions={subscriptions}
                userId={user?.id}
              />
            ) : (
              <div>No User Exists</div>
            )}
          </TabPanel>
          <TabPanel>
            <UserExploreSubscriptionsView adapters={adapterBalances.adaptersWithBalance} />
          </TabPanel>
          <TabPanel>
            <UserWalletView
              address={address ?? zeroAddress}
              totalAdapters={adapters.length}
              adapters={adapterBalances.adaptersWithBalance}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
