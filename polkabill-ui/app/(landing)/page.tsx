"use client";

import { ComponentExample } from "@/components/component-example";
import { FeatureCard, RoleCard } from "@/components/misc/stat-card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CreditCard,
  Globe,
  Loader2,
  ShieldCheck,
  UserPlus,
  Zap,
} from "lucide-react";
import { useConnection } from "wagmi";
import { RegisterMerchantModal } from "./(components)/register-merchant";
import { useCheckIsMerchantProfile } from "@/lib/hooks/use-check-account";
import Link from "next/link";

export default function LandingPage() {
  const { isConnected, address, isConnecting } = useConnection();
  const { hasMerchant, isLoading, merchant } = useCheckIsMerchantProfile(
    address!,
  );

  const onSelectRole = (role: string) => {
    console.log({ role });
  };
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-sm font-medium"
        >
          <Zap size={14} className="text-black" />
          The Future of Recurring Web3 Payments
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-7xl font-bold tracking-tight text-black leading-[1.1]"
        >
          Stablecoin Billing <br />
          <span className="text-neutral-400">Simplified.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed"
        >
          PolkaBill allows merchants to accept recurring stablecoin
          subscriptions across multiple chains with zero friction. Secure,
          transparent, and fully automated.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          {isConnecting ? (
            <Button size="lg" disabled className="rounded-2xl px-8 gap-2">
              <Loader2 size={18} className="animate-spin" />
              Checking Account...
            </Button>
          ) : !isConnected ? (
            <Button size="lg" className="rounded-2xl px-8 gap-2">
              Connect Wallet to Start
              <ArrowRight size={18} />
            </Button>
          ) : !hasMerchant ? (
            <RegisterMerchantModal />
          ) : (
            <Link href="/merchant">
              <Button size="lg" className="rounded-2xl px-8 gap-2">
                Enter Merchant Portal
                <ArrowRight size={18} />
              </Button>
            </Link>
          )}
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-neutral-50/50 border-y border-neutral-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Globe}
            title="Cross-Chain Native"
            description="Subscribe on one chain, pay from another. Our billing adapters handle the complexity."
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Non-Custodial"
            description="You always maintain control of your funds. PolkaBill only executes approved allowances."
          />
          <FeatureCard
            icon={CreditCard}
            title="Stablecoin Only"
            description="Avoid volatility. All payments are settled in trusted stablecoins like USDC and USDT."
          />
        </div>
      </section>

      {/* Role Selection (Simplified) */}
      <section className="py-20 px-6 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-12">
          Choose your portal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RoleCard
            title="Merchant"
            description="Register your business, create subscription plans, and manage your payouts."
            onClick={() => onSelectRole("merchant")}
            features={[
              "Custom Plans",
              "Revenue Analytics",
              "Multi-token Support",
            ]}
            disabled={isConnected && status === "no-account"}
          />
          <RoleCard
            title="Subscriber"
            description="Manage your active subscriptions, grant allowances, and track your history."
            onClick={() => onSelectRole("user")}
            features={[
              "One-click Subscribe",
              "Allowance Control",
              "Cross-chain Balances",
            ]}
            disabled={isConnected && status === "no-account"}
          />
          <RoleCard
            title="Protocol Admin"
            description="Configure chain parameters, manage roles, and monitor protocol health."
            onClick={() => onSelectRole("admin")}
            features={["Chain Config", "Fee Management", "Global Insights"]}
          />
        </div>
      </section>
    </div>
  );
}
