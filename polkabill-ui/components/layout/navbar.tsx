"use client";

import { Wallet, ChevronDown, Bell, Menu, Globe, Circle } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Menu as HeadlessMenu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  injected,
  useChains,
  useConnect,
  useConnection,
  useDisconnect,
  useSwitchChain,
} from "wagmi";

const userRole: string = "merchant";

export const Navbar = () => {
  const chains = useChains();
  const { isConnected, connector, chain } = useConnection();
  const { mutate: switchChain } = useSwitchChain();
  const { mutate: connect, isPending: isConnecting } = useConnect();
  const { mutate: disconnect, isPending: isDisconnecting } = useDisconnect();

  console.log({ chains });

  return (
    <nav className="h-16 border-b border-neutral-100 bg-white/80 backdrop-blur-md sticky top-0 z-[90] px-6 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => disconnect({ connector })}
        >
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">
            P
          </div>
          <span className="font-bold text-xl tracking-tight">PolkaBill</span>
        </div>

        {userRole !== "none" && (
          <div className="hidden md:flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg px-4 bg-white shadow-sm text-black"
            >
              Dashboard
            </Button>
            <Button variant="ghost" size="sm" className="rounded-lg px-4">
              History
            </Button>
            <Button variant="ghost" size="sm" className="rounded-lg px-4">
              Settings
            </Button>
          </div>
        )}
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
                    className={cn("transition-transform", open && "rotate-180")}
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
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                            focus ? "bg-neutral-50" : "",
                          )}
                        >
                          {name}
                          {id === chain?.id && (
                            <Circle size={6} fill="black" className="ml-auto" />
                          )}
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
            <>
              <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider leading-none mb-1">
                  Balance
                </span>
                <span className="text-sm font-bold leading-none">
                  1,240.50 USDC
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="gap-2 rounded-xl"
              >
                <Wallet size={14} />
                <span className="hidden sm:inline">0x71C...3E21</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={() => connect({ connector: injected() })}
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
