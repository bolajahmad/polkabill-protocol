"use client";

import { StatCard } from "@/components/misc/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { MOCK_SUBSCRIPTIONS } from "@/lib/mocks";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CreditCard,
  Plus,
  Settings,
  Wallet,
} from "lucide-react";
import { MerchantsOverview } from "./components/merchants-overview";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";

export default function MerchantsPortalPage() {
  return (
    <div className="max-w-7xl mx-auto w-full space-y-8">
      <TabGroup>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Merchant Portal
            </h1>
            <p className="text-neutral-500 mt-1">
              Manage your business registry and subscription plans.
            </p>
          </div>
          <TabList className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl">
            {["overview", "plans", "subscriptions", "settings"].map((tab) => (
              <Tab
              key={tab}
                className={({ selected }) =>
                  cn(
                    "px-6 py-2 rounded-xl text-sm font-bold transition-all capitalize",
                    selected
                      ? "bg-white shadow-sm text-black"
                      : "text-neutral-500 hover:text-black",
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </TabList>
        </div>

        <TabPanels className="pt-4">
          <TabPanel>
            <MerchantsOverview />
          </TabPanel>
          <TabPanel>Merchant Plans</TabPanel>
          <TabPanel>Merchant Payouts</TabPanel>
          <TabPanel>Merchant Settings</TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
