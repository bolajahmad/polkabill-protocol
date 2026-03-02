"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { AdminInsights } from "./components/insights";
import { AdminConfig } from "./components/confiigs";

export default function AdminPortal({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState("insights");

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Protocol Admin</h1>
          <p className="text-neutral-500 mt-1">Monitor protocol health and manage global configurations.</p>
        </div>
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab("insights")}
            className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", activeTab === "insights" ? "bg-white shadow-sm text-black" : "text-neutral-500 hover:text-black")}
          >
            Insights
          </button>
          <button 
            onClick={() => setActiveTab("config")}
            className={cn("px-6 py-2 rounded-xl text-sm font-bold transition-all", activeTab === "config" ? "bg-white shadow-sm text-black" : "text-neutral-500 hover:text-black")}
          >
            Config
          </button>
        </div>
      </div>

      <div className="pt-4">
        {activeTab === "insights" && <AdminInsights />}
        {activeTab === "config" && <AdminConfig />}
      </div>
    </div>
  );
};