import { PolkabillProvider } from '@polkabill/react';
import { PolkabillClient } from '@polkabill/sdk-core';
import { useEffect, useMemo, type ReactNode } from 'react';
import { baseSepolia } from 'viem/chains';
import { useChains, useConnection, usePublicClient, useSwitchChain, useWalletClient } from 'wagmi';

export const RootContext = ({ children }: { children: ReactNode }) => {
  const { chain } = useConnection();
  const { mutate: switchChain } = useSwitchChain();
  const chains = useChains();
  const pubClient = usePublicClient();
  const {
    data: walletClient,
  } = useWalletClient({
    chainId: chain?.id,
  });

  // Only create PolkabillClient when walletClient is ready
  const polkabill = useMemo(() => {
    if (!walletClient) return null; // not ready yet
    return new PolkabillClient({
      publicClient: pubClient as any,
      walletClient,
    });
  }, [pubClient, walletClient]);

  // Auto-switch chain if no chain selected
  useEffect(() => {
    if (!chain) {
      switchChain({ chainId: chains.find(c => c.id === baseSepolia.id)?.id || 84532 });
    }
  }, [chain, chains, switchChain]);

  // Don't render children until PolkabillClient is ready
  if (!polkabill) return <div>Connecting wallet...</div>;

  return <PolkabillProvider client={polkabill}>{children}</PolkabillProvider>;
};
