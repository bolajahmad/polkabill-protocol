import { StatCard } from "@/components/misc/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { MOCK_MERCHANT_PERFORMANCE } from "@/lib/mocks";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, Layers, Store, TrendingUp, Users } from "lucide-react";

export const AdminInsights = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatCard label="Total TVL" value="$12.4M" icon={Layers} />
      <StatCard label="Protocol Fees" value="$8,210.00" icon={TrendingUp} />
      <StatCard label="Active Merchants" value="1,242" icon={Store} />
      <StatCard label="Total Subs" value="45,901" icon={Users} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-2">
        <CardHeader title="Merchant Performance">Top performing businesses</CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-50 text-[10px] uppercase font-bold text-neutral-400">
                <th className="p-4">Merchant</th>
                <th className="p-4">Subscribers</th>
                <th className="p-4">Revenue</th>
                <th className="p-4">Churn</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {MOCK_MERCHANT_PERFORMANCE.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="p-4 font-bold">{m.name}</td>
                  <td className="p-4 text-sm">{m.subs}</td>
                  <td className="p-4 text-sm font-mono">{formatCurrency(m.revenue)}</td>
                  <td className="p-4 text-sm text-rose-500">{m.churn}</td>
                  <td className="p-4 text-right">
                    <Badge variant="secondary">Active</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardHeader title="Protocol Health" />
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500">Adapter Uptime</span>
              <span className="text-sm font-bold">99.99%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500">Successful Charges</span>
              <span className="text-sm font-bold">98.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500">Avg. Gas Cost</span>
              <span className="text-sm font-bold">$0.45</span>
            </div>
          </div>
          <div className="pt-4 border-t border-neutral-50">
            <Button variant="outline" className="w-full gap-2 rounded-xl">
              <BarChart3 size={18} />
              Detailed Reports
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
);