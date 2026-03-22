'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AdminChargeHistoryList } from './components/admin-charge-history-view';
import { AdminSubscriptionsList } from './components/admin-subscriptions-list';
import { AdminConfig } from './components/confiigs';
import { AdminInsights } from './components/insights';

export default function AdminPortal({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto w-full space-y-8 p-6 md:p-12">
      <div className="max-w-7xl mx-auto w-full space-y-8 p-6 md:p-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Protocol Admin</h1>
            <p className="text-neutral-500 mt-1">
              Monitor protocol health and manage global configurations.
            </p>
          </div>
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                'px-6 py-2 rounded-xl text-sm font-bold transition-all',
                activeTab === 'overview'
                  ? 'bg-white shadow-sm text-black'
                  : 'text-neutral-500 hover:text-black',
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={cn(
                'px-6 py-2 rounded-xl text-sm font-bold transition-all',
                activeTab === 'subscriptions'
                  ? 'bg-white shadow-sm text-black'
                  : 'text-neutral-500 hover:text-black',
              )}
            >
              Subscriptions
            </button>
            <button
              onClick={() => setActiveTab('charges')}
              className={cn(
                'px-6 py-2 rounded-xl text-sm font-bold transition-all',
                activeTab === 'charges'
                  ? 'bg-white shadow-sm text-black'
                  : 'text-neutral-500 hover:text-black',
              )}
            >
              Charge History
            </button>
          </div>
        </div>

        <div className="pt-4">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <AdminInsights />
              <AdminConfig />
            </div>
          )}
          {activeTab === "subscriptions" && (
            <AdminSubscriptionsList />
          )}
          {activeTab === 'charges' && <AdminChargeHistoryList />}
        </div>
      </div>
    </div>
  );
}