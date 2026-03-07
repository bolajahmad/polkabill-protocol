'use client';

import { cn, truncateAddress } from '@/lib/utils';
import { Menu as HeadlessMenu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bell, ChevronDown, Circle, LogOut, RefreshCw, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import {
  injected,
  useChains,
  useConnect,
  useConnection,
  useDisconnect,
  useSwitchChain,
} from 'wagmi';
import { Button } from '../ui/button';

const userRole: string = 'merchant';

export const Navbar = () => {
  const chains = useChains();
  const { isConnected, connector, address, chain } = useConnection();
  const { mutate: switchChain } = useSwitchChain();
  const { mutate: connect, isPending: isConnecting } = useConnect();
  const { mutate: disconnect, isPending: isDisconnecting } = useDisconnect();

  useEffect(() => {
    if (!chain) {
      switchChain({ chainId: 420420417 });
    }
  }, [chain, switchChain]);

  return (
    <nav className="h-16 border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-[90] px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">
              P
            </div>
            <span className="font-bold text-xl tracking-tight">PolkaBill</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {/* Chain Switcher */}
        {chain && (
          <HeadlessMenu as="div" className="relative">
            {({ open }) => (
              <>
                <MenuButton className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors text-sm font-medium">
                  {chain?.name}
                  <ChevronDown
                    size={14}
                    className={cn('transition-transform', open && 'rotate-180')}
                  />
                </MenuButton>

                <MenuItems className="absolute top-full mt-2 right-0 w-48 bg-white border border-neutral-100 rounded-2xl shadow-xl p-2 z-[100]">
                  {chains.map(({ id, name }) => (
                    <MenuItem key={id}>
                      {({ focus }) => (
                        <button
                          type="button"
                          onClick={() => switchChain({ chainId: id })}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                            focus ? 'bg-neutral-50' : '',
                          )}
                        >
                          {name}
                          {id === chain?.id && <Circle size={6} fill="black" className="ml-auto" />}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </MenuItems>
              </>
            )}
          </HeadlessMenu>
        )}

        {/* Wallet & Balance */}
        <div className="flex items-center gap-2 pl-2 border-l border-neutral-100">
          {isConnected ? (
            <HeadlessMenu as="div" className="relative">
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
            </HeadlessMenu>
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

        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell size={18} />
        </Button>
      </div>
    </nav>
  );
};
