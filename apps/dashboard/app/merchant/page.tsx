"use client";

import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Status } from "@/lib/models/chains";
import { IMerchant } from "@/lib/models/merchants";
import { cn } from "@/lib/utils";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { useConnection } from "wagmi";
import { MerchantPlansView } from "./components/merchant-plans-view";
import { MerchantSettingsView } from "./components/merchant-settings";
import { MerchantSubscriptions } from "./components/merchant-subscriptions";
import { MerchantsOverview } from "./components/merchants-overview";

export default function MerchantsPortalPage() {
  const { address } = useConnection();
  const { data: merchant, isLoading } = useQuery<IMerchant>({
    queryKey: ["merchantinformation", address],
    queryFn: async () =>
      fetch(`/api/merchant/${address}`).then((res) => res.json()),
    enabled: !!address,
  });

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 p-6 md:p-12">
      <TabGroup>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight items-center inline-flex gap-2">
              Merchant Portal
              {isLoading ? (
                <Spinner />
              ) : (
                <Badge
                  variant={
                    merchant?.status === Status.ACTIVE
                      ? "success"
                      : "destructive"
                  }
                  className="ml-2"
                >
                  {merchant?.status === Status.ACTIVE ? "Active" : "Inactive"}
                </Badge>
              )}
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
            <MerchantsOverview mid={merchant?.id as `0x${string}`} />
          </TabPanel>
          <TabPanel>
            <MerchantPlansView
              mid={merchant?.id as `0x${string}`}
              window={merchant?.billingWindow || 0}
              plans={merchant?.plans || []}
            />
          </TabPanel>
          <TabPanel>
            <MerchantSubscriptions mid={merchant?.id as `0x${string}`} />
          </TabPanel>
          <TabPanel>
            <MerchantSettingsView
              merchantId={merchant?.id as `0x${string}`}
              payouts={merchant?.payout || []}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
}
