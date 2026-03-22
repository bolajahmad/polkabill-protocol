import { baseSepolia } from 'viem/chains';
import { BASE_CHAIN, SubscriptionManagerContractAddress } from '../contracts';
import { SubscriptionManagerContractABI } from '../contracts/abi/subscription-manager.abi';
import { PolkabillConfig, SubscribeParams } from '../types';

export async function subscribe(config: PolkabillConfig, params: SubscribeParams) {
  if (!config.walletClient) {
    throw new Error('Wallet client is required!');
  }

  const { walletClient } = config;
  const [account] = await walletClient.getAddresses();
  console.log({ account, config, chain: baseSepolia });

  return params.chainId && params.token
    ? walletClient.writeContract({
        account,
        address: SubscriptionManagerContractAddress,
        abi: SubscriptionManagerContractABI,
        functionName: 'subscribe',
        args: [params.planId, params.chainId, params.token],
        chain: BASE_CHAIN,
      })
    : walletClient.writeContract({
        account,
        address: SubscriptionManagerContractAddress,
        abi: SubscriptionManagerContractABI,
        chain: BASE_CHAIN,
        functionName: 'subscribe',
        args: [params.planId],
      });
}
