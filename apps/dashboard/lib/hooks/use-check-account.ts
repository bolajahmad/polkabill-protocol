'use client';

import { useMemo } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import {
  BASE_CHAIN,
  ChainRegistryContractAddress,
  MerchantContractAddress,
  SubscriptionManagerContractAddress,
} from '../contracts';
import { ChainRegistryContractABI } from '../contracts/abi/chain-registry.abi';
import { MerchantContractABI } from '../contracts/abi/merchant.abi';
import { SubscriptionManagerContractABI } from '../contracts/abi/subscription-manager.abi';

export const useCheckIsMerchantProfile = (address: `0x${string}`) => {
  const { data: merchantData, isLoading } = useReadContract({
    address: MerchantContractAddress,
    abi: MerchantContractABI,
    functionName: 'getMerchant',
    args: [address],
    query: {
      enabled: !!address,
    },
  });
  console.log({ merchantData });

  const merchant = {
    address,
    billingWindow: Number(merchantData?.window || 0),
    gracePeriod: Number(merchantData?.grace || 0),
    isActive: !!merchantData?.active,
    metadata: merchantData?.metadata,
  };

  return {
    hasMerchant: !!merchantData?.window,
    merchant,
    isLoading,
  };
};

export const useContractAdminsInfo = () => {
  const { data: chainAdmins } = useReadContracts({
    contracts: [
      {
        abi: ChainRegistryContractABI,
        address: ChainRegistryContractAddress,
        functionName: 'owner',
        chainId: BASE_CHAIN.id
      },
      {
        abi: SubscriptionManagerContractABI,
        address: SubscriptionManagerContractAddress,
        functionName: 'owner',
        chainId: BASE_CHAIN.id
      },
    ],
  });
  
  const admins = useMemo(() => {
    return chainAdmins && chainAdmins.length > 0
      ? [
          {
            address: chainAdmins?.[0].result as `0x${string}`,
            role: 'Chain Admin',
            id: 'CHAIN_REGISTRY',
          },
          {
            address: chainAdmins?.[1].result as `0x${string}`,
            role: 'Subscription Manager',
            id: 'SUBSCRIPTION_MANAGER',
          }
        ]
      : [];
  }, [chainAdmins]);

  return {
    admins: admins,
  };
};
