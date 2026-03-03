"use client";

import { StatCard } from "@/components/misc/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { MerchantContractAddress } from "@/lib/contracts";
import { MerchantContractABI } from "@/lib/contracts/abi/merchant.abi";
import { MOCK_SUBSCRIPTIONS } from "@/lib/mocks";
import { formatCurrency } from "@/lib/utils";
import { Activity, AlertCircle, ArrowUpRight, CreditCard, Plus, Settings, Wallet } from "lucide-react";
import { useWriteContract } from "wagmi";

export function MerchantsOverview() {
  const { mutate } = useWriteContract({
    mutation: {
      onError: (error) => console.log({ error }),
      onSuccess: (data) => console.log({ data }),
    }
  });
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value="$12,450.00" icon={CreditCard} />
        <StatCard label="Active Subs" value="243" icon={Activity} />
        <StatCard label="Churn Rate" value="2.1%" icon={AlertCircle} />
        <StatCard label="Avg LTV" value="$450.00" icon={ArrowUpRight} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader title="Recent Activity">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <div className="divide-y divide-neutral-50">
            {MOCK_SUBSCRIPTIONS.map((sub) => (
              <div
                key={sub.id}
                className="p-4 flex items-center justify-between hover:bg-neutral-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-600">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{sub.user}</p>
                    <p className="text-xs text-neutral-500">
                      {sub.planName} • Cycle #{sub.billingCycle}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    {formatCurrency(sub.price)}
                  </p>
                  <p className="text-[10px] text-neutral-400 uppercase font-bold">
                    2 hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Quick Actions" />
          <div className="p-6 space-y-3">
            <Button onClick={() => mutate({
              abi: MerchantContractABI,
              address: MerchantContractAddress,
              functionName: "updateController",
              args: ["0x1de3062E63F7dB84789Ef25E17EC863D14cE67C9"]
            })} className="w-full justify-start gap-3 rounded-xl">
              <Plus size={18} />
              Create New Plan
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 rounded-xl"
            >
              <Settings size={18} />
              Update Profile
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 rounded-xl"
            >
              <Wallet size={18} />
              Manage Payouts
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
