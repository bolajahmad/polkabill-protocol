export const MOCK_PLANS = [
  {
    id: "101",
    name: "Basic Tier",
    price: 19.99,
    interval: 30,
    grace: 3,
    subscribers: 142,
    status: true,
    metadata: "Standard access to platform",
  },
  {
    id: "102",
    name: "Pro Tier",
    price: 49.99,
    interval: 30,
    grace: 5,
    subscribers: 89,
    status: true,
    metadata: "Advanced analytics and support",
  },
  {
    id: "103",
    name: "Enterprise",
    price: 299.99,
    interval: 365,
    grace: 7,
    subscribers: 12,
    status: true,
    metadata: "Custom solutions for large teams",
  },
];

export const MOCK_PAYOUTS = [
  {
    chain: "Ethereum",
    address: "0x71C...3E21",
    tokens: ["USDC", "USDT"],
    status: "active",
  },
  {
    chain: "Polygon",
    address: "0x71C...3E21",
    tokens: ["USDC", "USDT", "DAI"],
    status: "active",
  },
  {
    chain: "Arbitrum",
    address: "0x71C...3E21",
    tokens: ["USDC"],
    status: "active",
  },
];

export const MOCK_SUBSCRIPTIONS = [
  {
    id: "8821",
    planName: "Pro Tier",
    user: "0xAcme...F321",
    price: 49.99,
    billingCycle: 4,
    nextBilling: "2024-04-15",
    status: "active",
  },
  {
    id: "9912",
    planName: "Basic Tier",
    user: "0xNebula...A112",
    price: 19.99,
    billingCycle: 12,
    nextBilling: "2024-04-10",
    status: "active",
  },
  {
    id: "7765",
    planName: "Enterprise",
    user: "0xEcho...B882",
    price: 299.99,
    billingCycle: 1,
    nextBilling: "2024-03-28",
    status: "cancelled",
  },
];

export const MOCK_MERCHANT_PERFORMANCE = [
  { id: "m1", name: "Acme Cloud", subs: 1242, revenue: 45901.50, churn: "1.2%", status: "active" },
  { id: "m2", name: "Nebula VPN", subs: 840, revenue: 12400.00, churn: "2.5%", status: "active" },
  { id: "m3", name: "Echo Music", subs: 450, revenue: 8210.00, churn: "3.1%", status: "active" },
];

export const MOCK_CHAIN_CONFIGS = [
  { id: 1, name: "Ethereum", adapter: "0x882...F112", fees: 1240.50, status: "active" },
  { id: 137, name: "Polygon", adapter: "0x991...A882", fees: 450.00, status: "active" },
  { id: 42161, name: "Arbitrum", adapter: "0x112...B991", fees: 820.00, status: "active" },
];