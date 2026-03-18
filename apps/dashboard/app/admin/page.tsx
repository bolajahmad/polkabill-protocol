"use client";

import { AdminConfig } from "./components/confiigs";
import { AdminInsights } from "./components/insights";

export default function AdminPortal({ onLogout }: { onLogout: () => void }) {

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 p-6 md:p-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Protocol Admin</h1>
          <p className="text-neutral-500 mt-1">Monitor protocol health and manage global configurations.</p>
        </div>
      </div>

      <div className="pt-4 space-y-10">
        <AdminInsights />
        <AdminConfig />
      </div>
    </div>
  );
};