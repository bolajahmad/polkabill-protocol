import { EmptyState } from '@/components/misc/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ICharge } from '@/lib/models/chains';
import { formatCurrency, parseJsonOrUndefined, truncateAddress } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Download, ExternalLink } from 'lucide-react';
import { Activity, useState } from 'react';
import { formatUnits, hexToString } from 'viem';
import { useChains } from 'wagmi';

export const AdminChargeHistoryList = () => {
  const chains = useChains();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = 1;

  const { data } = useQuery({
    queryKey: ['admin-charge-history-list'],
    queryFn: async () => {
      const response = await fetch('/api/charges');
      return response.json();
    },
  });
  const charges = (data || []) as ICharge[];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Charge History</h2>
          <p className="text-sm text-neutral-500">
            Log of all subscription charges processed by the protocol.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-xl">
            <Download size={14} />
            Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-50 text-[10px] uppercase font-bold text-neutral-400">
                <th className="p-4">Subscriber</th>
                <th className="p-4">Merchant</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tx Hash</th>
                <th className="p-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {charges.length > 0 ? (
                charges.map(charge => {
                  const merchantData = parseJsonOrUndefined(
                    hexToString(charge.subscription.plan.merchant?.metadataUri as `0x${string}`),
                  ) as Record<string, string>;
                  
                    return (
                  <tr key={charge.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4">
                      <p className="text-sm font-bold font-mono">{truncateAddress(charge.subscription.user.id)}</p>
                      <p className="text-[10px] text-neutral-400 uppercase font-bold">
                        {chains.find(({ id }) => id == charge.chainId)?.name ?? "N/A"}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold">{merchantData.title}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-emerald-600">
                        {formatCurrency(Number(formatUnits(BigInt(charge.amount), 18)))}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge variant={charge.success ? 'success' : 'destructive'}>
                        {charge.success ? "Completed" : "Pending"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <a
                        href={`https://etherscan.io/tx/${charge.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-blue-600 hover:underline flex items-center gap-1"
                      >
                        {charge.txHash.slice(0, 10)}...{charge.txHash.slice(-8)}
                        <ExternalLink size={10} />
                      </a>
                    </td>
                    <td className="p-4 text-right text-xs text-neutral-500">
                      {new Date(charge.createdAt).toLocaleString()}
                    </td>
                  </tr>
                )})
              ) : (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      icon={Activity}
                      title="No History Found"
                      description="No charge history has been recorded yet."
                      className="border-0 bg-transparent p-12"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-4 border-t border-neutral-50 flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Showing {0} of {charges.length} records
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
