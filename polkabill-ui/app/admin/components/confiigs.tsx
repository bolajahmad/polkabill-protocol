import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCK_CHAIN_CONFIGS } from "@/lib/mocks";
import { formatCurrency } from "@/lib/utils";
import { Dialog } from "@headlessui/react";
import { AlertCircle, Settings } from "lucide-react";
import { useState } from "react";
import { UpdateAdapterConfig } from "./create-adapter";

export const AdminConfig = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Protocol Configuration</h2>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="gap-2 rounded-xl"
        >
          <Settings size={18} />
          Update Global Config
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader title="Chain Adapters">
            Registry of deployed adapters
          </CardHeader>
          <div className="divide-y divide-neutral-50">
            {MOCK_CHAIN_CONFIGS.map((c) => (
              <div key={c.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">{c.name}</p>
                  <p className="text-xs font-mono text-neutral-400">
                    {c.adapter}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold">{formatCurrency(c.fees)}</p>
                  <p className="text-[10px] text-neutral-400 uppercase font-bold">
                    Accrued Fees
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-neutral-50/50">
           <UpdateAdapterConfig />
          </div>
        </Card>

        <Card>
          <CardHeader title="Role Management">
            Protocol administrators
          </CardHeader>
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {[
                { addr: "0x71C...3E21", role: "Super Admin" },
                { addr: "0x12A...9F82", role: "Operator" },
              ].map((admin) => (
                <div
                  key={admin.addr}
                  className="flex items-center justify-between p-3 border border-neutral-100 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-mono font-bold">{admin.addr}</p>
                    <p className="text-[10px] text-neutral-400 uppercase font-bold">
                      {admin.role}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-500 hover:bg-rose-50"
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Input placeholder="Enter address to grant role..." />
              <Button className="w-full rounded-xl">Grant Operator Role</Button>
            </div>
          </div>
        </Card>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Protocol Config"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              Protocol Fee (%)
            </label>
            <Input type="number" placeholder="0.5" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              Withdrawal Threshold
            </label>
            <Input type="number" placeholder="1000" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-neutral-500">
              Global Pause
            </label>
            <div className="flex items-center gap-3 p-4 border border-neutral-100 rounded-xl bg-rose-50/30">
              <AlertCircle className="text-rose-500" />
              <div className="flex-1">
                <p className="text-sm font-bold text-rose-700">
                  Emergency Protocol Pause
                </p>
                <p className="text-xs text-rose-600">
                  Disables all charges and subscriptions immediately.
                </p>
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-rose-300"
              />
            </div>
          </div>
        </div>
        <div>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setIsModalOpen(false)}>Save Changes</Button>
        </div>
      </Dialog>
    </div>
  );
};
