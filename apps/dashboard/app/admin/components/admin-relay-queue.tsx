import { DisplayRelayStatusBadge } from '@/components/misc/relay-badge';
import { TokenDisplayBadge } from '@/components/misc/tokens-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Spinner } from '@/components/ui/spinner';
import { BillingAdapterContractABI } from '@/lib/contracts/abi/adapter.abi';
import { useAdminRelayActions } from '@/lib/hooks/use-admin-relay-logic';
import { IRelayRequest } from '@/lib/models/chains';
import {
  cn,
  formatCurrency,
  getDomain,
  handleContractError,
  MerchantSignatureTypes,
  parseJsonOrUndefined,
  TokenSignatureTypes,
  truncateAddress,
} from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Layers, RefreshCw, Send, Store, Zap } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { encodePacked, hexToString, keccak256, recoverTypedDataAddress } from 'viem';
import {
  useChains,
  useConnection,
  useSignTypedData,
  useSwitchChain,
  useWriteContract,
} from 'wagmi';

export const AdminRelayQueue = () => {
  const { chain } = useConnection();
  const { mutateAsync: switchChain } = useSwitchChain();
  const chains = useChains();
  const [isSubmitting, setIsSubmitting] = useState<string>();
  const { mutate: writeContract } = useWriteContract({
    mutation: {
      onError: error => {
        const message = handleContractError(error);
        toast.error(message ?? 'Transaction Failed!');
      },
      onSettled: () => setIsSubmitting(undefined),
    },
  });

  const { data } = useQuery({
    queryKey: ['admin-relay-actions'],
    queryFn: async () => fetch('/api/admin/relays').then(res => res.json()),
  });
  const relays = (data?.data || []) as IRelayRequest[];
  console.log({ relays });
  const { refreshQueue } = useAdminRelayActions();
  const { mutateAsync: signTypedData } = useSignTypedData();

  const handleRelay = async (action: IRelayRequest) => {
    if (!action?.adapter) return;
    setIsSubmitting(action.id);
    if (chain?.id != Number(action.adapter.id)) {
      await switchChain({ chainId: Number(action.adapter.id) as any });

      await new Promise(r => setTimeout(r, 1500));
    }
    if (action.type == 'TOKEN_SUPPORT') {
      const signature = await signTypedData({
        domain: getDomain(action.adapter?.id, action.adapter?.address as `0x${string}`),
        types: TokenSignatureTypes,
        primaryType: 'TokenUpdate',
        message: {
          token: action.token,
          allowed: action.allow,
          nonce: BigInt(action.nonce),
        },
      });
      console.log({ signature });
      const recovered = await recoverTypedDataAddress({
        domain: getDomain(action.adapter?.id, action.adapter?.address as `0x${string}`),
        types: TokenSignatureTypes,
        primaryType: 'TokenUpdate',
        message: {
          token: action.token,
          allowed: action.allow,
          nonce: BigInt(action.nonce),
        },
        signature,
      });

      console.log('Recovered:', recovered);

      writeContract({
        abi: BillingAdapterContractABI,
        address: action.adapter.address as `0x${string}`,
        functionName: 'setTokenWithSig',
        args: [action.token as `0x${string}`, action.allow, BigInt(action.nonce), signature],
        chainId: Number(action.adapter.id) as any,
      });
    } else {
      const payout = action.merchant?.payout.find(
        ({ chainId }) => action.adapter?.id == chainId,
      )?.address;
      const signature = await signTypedData({
        domain: getDomain(action.adapter?.id, action.adapter?.address as `0x${string}`),
        types: MerchantSignatureTypes,
        primaryType: 'MerchantUpdate',
        message: {
          merchant: action.merchant?.id,
          payout: payout,
          nonce: BigInt(action.nonce),
        },
      });
      console.log({ signature });

      writeContract({
        abi: BillingAdapterContractABI,
        address: action.adapter.address as `0x${string}`,
        functionName: 'setMerchantWithSig',
        args: [
          action.merchant?.id as `0x${string}`,
          payout as `0x${string}`,
          BigInt(action.nonce),
          signature,
        ],
        chainId: Number(action.adapter.id) as any,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Relay Queue</h2>
          <p className="text-sm text-neutral-500">Pending cross-chain message deliveries</p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl" onClick={refreshQueue}>
          <RefreshCw size={16} />
          Refresh Queue
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-50 text-[10px] uppercase font-bold text-neutral-400">
                <th className="p-4">Action Type</th>
                <th className="p-4">Target Chain</th>
                <th className="p-4">Payload Details</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {relays.length > 0 ? (
                relays.map(action => {
                  const merchant = action.merchant
                    ? (parseJsonOrUndefined(
                        hexToString(action.merchant?.metadataUri as `0x${string}`),
                      ) as Record<string, string>)
                    : undefined;
                  const payout = action.merchant?.payout.find(
                    ({ chainId }) => action.adapter?.id == chainId,
                  )?.address;

                  return (
                    <tr key={action.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {action.type === 'TOKEN_SUPPORT' && (
                            <Layers size={16} className="text-indigo-500" />
                          )}
                          {action.type === 'MERCHANT_PAYOUT' && (
                            <Store size={16} className="text-emerald-500" />
                          )}
                          {action.type === 'CHARGE_REQUEST' && (
                            <Zap size={16} className="text-amber-500" />
                          )}
                          <span className="text-sm font-bold">{action.type.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge variant="ghost">
                          {chains.find(({ id }) => id == action.adapter?.id)?.name || 'N/A'}
                        </Badge>
                        <p className="text-[10px] text-neutral-400 font-mono mt-1">
                          {truncateAddress(action.adapter?.address || '')}
                        </p>
                      </td>
                      <td className="p-4">
                        {action.type === 'TOKEN_SUPPORT' && (
                          <div className="text-[10px] font-mono">
                            <p>
                              Token:{' '}
                              {action.adapter && action.token ? (
                                <TokenDisplayBadge
                                  chainId={Number(action.adapter.id)}
                                  variant="ghost"
                                  address={action.token as `0x${string}`}
                                />
                              ) : (
                                'N/A'
                              )}
                            </p>
                            <p>
                              Allowed:{' '}
                              <em className="not-italic">{action.allow ? 'TRUE' : 'FALSE'}</em>
                            </p>
                          </div>
                        )}
                        {action.type === 'MERCHANT_PAYOUT' && (
                          <div className="text-[10px] font-mono">
                            <p>Merchant: {merchant ? merchant.title : 'N/A'}</p>
                            <p>Payout: {truncateAddress(payout || 'N/A')}</p>
                          </div>
                        )}
                        {action.type === 'CHARGE_REQUEST' && (
                          <div className="text-[10px] font-mono">
                            <p>Sub ID: 1</p>
                            <p>Amount: {formatCurrency(0 / 1e6)}</p>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {action ? (
                          <DisplayRelayStatusBadge
                            id={keccak256(
                              action.type == 'MERCHANT_PAYOUT'
                                ? encodePacked(
                                    ['address', 'address', 'uint256'],
                                    [
                                      action.merchant?.id as `0x${string}`,
                                      payout as `0x${string}`,
                                      BigInt(action.nonce),
                                    ],
                                  )
                                : encodePacked(
                                    ['address', 'bool', 'uint256'],
                                    [
                                      action.token as `0x${string}`,
                                      action.allow as boolean,
                                      BigInt(action.nonce),
                                    ],
                                  ),
                            )}
                            chainId={Number(action.adapter?.id)}
                            address={action.adapter?.address as `0x${string}`}
                          />
                        ) : null}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          className="gap-2 rounded-xl"
                          disabled={isSubmitting == action.id}
                          onClick={() => handleRelay(action)}
                        >
                          {isSubmitting == action.id ? <Spinner /> : <Send size={14} />}
                          Relay Message
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>
                    <Empty
                      className={cn(
                        'border-0 bg-transparent p-12 flex flex-col items-center justify-center text-center space-y-4 rounded-3xl border-dashed border-neutral-200',
                      )}
                    >
                      <EmptyHeader>
                        <EmptyMedia
                          variant="icon"
                          className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center text-neutral-400 mb-2"
                        >
                          <Send size={32} />
                        </EmptyMedia>
                      </EmptyHeader>

                      <EmptyContent className="max-w-xs space-y-1">
                        <EmptyTitle className="text-lg font-bold tracking-tight">
                          Queue is Empty
                        </EmptyTitle>
                        <EmptyDescription className="text-sm text-neutral-500 leading-relaxed">
                          All cross-chain messages have been successfully delivered.
                        </EmptyDescription>
                      </EmptyContent>
                    </Empty>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
