import { useMemo } from 'react';
import { erc20Abi, formatUnits, type Address } from 'viem';
import { useReadContracts } from 'wagmi';
import { SUPPORTED_CHAINS } from '../utils/mocks';

interface Token {
  address: `0x${string}`;
  balance: bigint;
  decimals: number;
  allowance?: bigint;
  symbol?: string;
}

export interface IAdapterWithBalance {
  address: `0x${string}`;
  id: number;
  tokens: Token[];
  totalBalance: number;
  totalAllowance: number;
}

export function useUserAdapterBalance(userAddress: Address) {
  const adapters = SUPPORTED_CHAINS;
  /**
   * Build all contract calls
   */
  const contracts = useMemo(() => {
    return adapters.flatMap(adapter =>
      adapter.tokens.flatMap(token => [
        {
          address: token,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [userAddress],
          chainId: Number(adapter.id),
        },
        {
          address: token,
          abi: erc20Abi,
          functionName: 'decimals',
          chainId: Number(adapter.id),
        },
        {
          address: token,
          abi: erc20Abi,
          functionName: 'symbol',
          chainId: Number(adapter.id),
        },
        {
          address: token,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [userAddress, adapter.address as `0x${string}`],
          chainId: Number(adapter.id),
        },
      ]),
    );
  }, [adapters, userAddress]);

  const { data, isLoading: fetchingContracts } = useReadContracts({
    contracts: contracts as any,
    allowFailure: true,
  });

  /**
   * Build adapters with balances
   */
  const adaptersWithBalance = useMemo(() => {
    if (!data) return [];

    let cursor = 0;

    return adapters.map(adapter => {
      const tokens: Token[] = adapter.tokens.map(addr => {
        const balance = (data[cursor++]?.result ?? 0n) as bigint;
        const decimals = (data[cursor++]?.result ?? 18) as number;
        const symbol = (data[cursor++]?.result ?? '') as string;
        const allowance = (data[cursor++]?.result ?? 0n) as bigint;

        return {
          address: addr as `0x${string}`,
          balance,
          decimals,
          symbol,
          allowance,
        };
      });

      const totalBalance = tokens.reduce((acc, token) => {
        const formatted = Number(formatUnits(token.balance, token.decimals));
        return acc + formatted;
      }, 0);
      const totalAllowance = tokens.reduce((acc, token) => {
        const formatted = Number(formatUnits(token.allowance ?? 0n, token.decimals));
        return acc + formatted;
      }, 0);

      return {
        ...adapter,
        tokens,
        totalBalance,
        totalAllowance,
      };
    });
  }, [data, adapters]);

  return {
    adaptersWithBalance,
    isLoading: fetchingContracts,
  };
}
