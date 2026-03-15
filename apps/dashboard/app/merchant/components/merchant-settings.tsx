import { TokenDisplayBadge } from '@/components/misc/tokens-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { IMerchant } from '@/lib/models/merchants';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { Globe, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useChains } from 'wagmi';
import { RegisterMerchantPayoutAddress } from './register-payout-address';
import { UpdateMerchantSupportedToken } from './register-payout-tokens';

type Props = {
  payouts: IMerchant['payout'];
  merchantId: `0x${string}`;
};

export function MerchantSettingsView({ payouts, merchantId }: Props) {
  const chains = useChains();
  const [openModal, setOpenModal] = useState<'payout' | 'token' | null>(null);
  const [chainId, setChainId] = useState<number>();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Merchant Settings</h2>
          <p className="text-sm text-neutral-500">
            Configure your payout destinations and allowed payment tokens.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payout Addresses */}
        <Card>
          <CardHeader title="Payout Addresses">
            <div>
              <h2>Where your revenue is settled</h2>

              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenModal('payout')}
                  className="gap-2"
                >
                  <Plus size={14} />
                  Add Chain
                </Button>
              </div>
            </div>
          </CardHeader>
          <div className="p-0">
            <div className="divide-y divide-neutral-50">
              {payouts.length ? (
                payouts.map(p => (
                  <div key={p.chainId} className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Globe size={16} className="text-neutral-400" />
                        <span className="font-semibold text-md">
                          {chains.find(({ id }) => id == p.chainId)?.name || 'Unknown'}
                        </span>
                        <span className="font-normal italic">({p.chainId})</span>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                        Address
                      </p>
                      <div className="flex items-center justify-between bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <p className="text-sm font-mono font-bold truncate mr-4">{p.address}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-neutral-400 hover:text-black"
                        >
                          <RefreshCw size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Globe size={32} className="text-neutral-200 mb-3" />
                    <h3 className="text-sm font-bold text-neutral-700 mb-1">
                      No payout addresses configured
                    </h3>
                    <p className="text-xs text-neutral-500 mb-4">
                      Add a chain to start receiving payouts
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpenModal('payout')}
                      className="gap-2"
                    >
                      <Plus size={14} />
                      Add First Chain
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Allowed Tokens */}
        <Card>
          <CardHeader title="Allowed Tokens">
            <div className="space-y-4">
              <h4>Tokens you accept for payments</h4>

              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenModal('token')}
                  className="gap-2"
                >
                  <Plus size={14} />
                  Manage
                </Button>
              </div>
            </div>
          </CardHeader>
          <div className="p-6 space-y-6">
            {payouts.map(p => (
              <div key={p.chainId} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-400 capitalize tracking-wider">
                    <span className="font-semibold text-md">
                      {chains.find(({ id }) => id == p.chainId)?.name || 'Unknown'}
                    </span>
                    <span className="font-normal italic">({p.chainId})</span>
                  </span>
                  <div className="flex-1 h-px bg-neutral-50" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.tokens.map(t => (
                    <div
                      key={t}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-100 rounded-xl text-sm font-bold shadow-sm"
                    >
                      <TokenDisplayBadge address={t as `0x${string}`} chainId={p.chainId} />
                      <button className="text-neutral-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setChainId(p.chainId);
                      setOpenModal('token');
                    }}
                    className="w-8 h-8 rounded-xl border border-dashed border-neutral-200 flex items-center justify-center text-neutral-400 hover:border-black hover:text-black transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {!!openModal && (
        <Dialog open={!!openModal} onClose={() => setOpenModal(null)} className="relative z-50">
          {/* Backdrop */}
          <DialogBackdrop className="fixed inset-0 bg-black/30" aria-hidden="true" />

          {/* Full-screen container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {openModal == 'payout' ? (
              // Display the Token update modal also
              <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <RegisterMerchantPayoutAddress
                  mid={merchantId}
                  onCancel={() => setOpenModal(null)}
                  onComplete={cid => {
                    if (cid) setChainId(cid);
                    setOpenModal('token');
                  }}
                />
              </DialogPanel>
            ) : (
              <DialogPanel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <UpdateMerchantSupportedToken
                  mid={merchantId}
                  cid={chainId}
                  payouts={payouts}
                  onCancel={() => setOpenModal(null)}
                  onComplete={() => setOpenModal(null)}
                />
              </DialogPanel>
            )}
          </div>
        </Dialog>
      )}
    </div>
  );
}
