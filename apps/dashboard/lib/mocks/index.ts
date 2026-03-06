export const MOCK_PLANS = [
  {
    id: '101',
    name: 'Basic Tier',
    price: 19.99,
    interval: 30,
    grace: 3,
    subscribers: 142,
    status: true,
    metadata: 'Standard access to platform',
  },
  {
    id: '102',
    name: 'Pro Tier',
    price: 49.99,
    interval: 30,
    grace: 5,
    subscribers: 89,
    status: true,
    metadata: 'Advanced analytics and support',
  },
  {
    id: '103',
    name: 'Enterprise',
    price: 299.99,
    interval: 365,
    grace: 7,
    subscribers: 12,
    status: true,
    metadata: 'Custom solutions for large teams',
  },
];

export const MOCK_PAYOUTS = [
  {
    chain: 'Ethereum',
    address: '0x71C...3E21',
    tokens: ['USDC', 'USDT'],
    status: 'active',
  },
  {
    chain: 'Polygon',
    address: '0x71C...3E21',
    tokens: ['USDC', 'USDT', 'DAI'],
    status: 'active',
  },
  {
    chain: 'Arbitrum',
    address: '0x71C...3E21',
    tokens: ['USDC'],
    status: 'active',
  },
];

export const MOCK_SUBSCRIPTIONS = [
  {
    id: '8821',
    planName: 'Pro Tier',
    user: '0xAcme...F321',
    price: 49.99,
    billingCycle: 4,
    nextBilling: '2024-04-15',
    status: 'active',
  },
  {
    id: '9912',
    planName: 'Basic Tier',
    user: '0xNebula...A112',
    price: 19.99,
    billingCycle: 12,
    nextBilling: '2024-04-10',
    status: 'active',
  },
  {
    id: '7765',
    planName: 'Enterprise',
    user: '0xEcho...B882',
    price: 299.99,
    billingCycle: 1,
    nextBilling: '2024-03-28',
    status: 'cancelled',
  },
];

export const MOCK_MERCHANT_PERFORMANCE = [
  {
    id: 'm1',
    name: 'Acme Cloud',
    subs: 1242,
    revenue: 45901.5,
    churn: '1.2%',
    status: 'active',
  },
  {
    id: 'm2',
    name: 'Nebula VPN',
    subs: 840,
    revenue: 12400.0,
    churn: '2.5%',
    status: 'active',
  },
  {
    id: 'm3',
    name: 'Echo Music',
    subs: 450,
    revenue: 8210.0,
    churn: '3.1%',
    status: 'active',
  },
];

export const MOCK_CHAIN_CONFIGS = [
  {
    id: 1,
    name: 'Ethereum',
    adapter: '0x882...F112',
    fees: 1240.5,
    status: 'active',
    tokens: ['USDC', 'USDT'],
  },
  {
    id: 137,
    name: 'Polygon',
    adapter: '0x991...A882',
    fees: 450.0,
    status: 'active',
    tokens: ['USDC', 'DAI'],
  },
  {
    id: 42161,
    name: 'Arbitrum',
    adapter: '0x112...B991',
    fees: 820.0,
    status: 'active',
    tokens: ['USDT'],
  },
];

export const MAP_CHAIN_ID_TO_ICON = { 11155111: 'Ξ', 80002: 'P', 84532: 'A', 420420417: 'B' };

export 
const MOCK_MERCHANTS = [
  { 
    id: "m1", 
    name: "Acme Cloud Services", 
    description: "Enterprise-grade cloud infrastructure and storage solutions.",
    category: "Infrastructure",
    window: "24h",
    grace: "7d",
    plans: [
      { id: "p1", name: "Pro Tier", price: 49.99, interval: 30, description: "Full access to all cloud features, 1TB storage, and priority support." },
      { id: "p2", name: "Basic Tier", price: 9.99, interval: 30, description: "Standard cloud features with 100GB storage." },
    ]
  },
  { 
    id: "m2", 
    name: "Nebula VPN", 
    description: "Ultra-fast, secure, and private global network access.",
    category: "Security",
    window: "12h",
    grace: "3d",
    plans: [
      { id: "p3", name: "Premium VPN", price: 14.99, interval: 30, description: "Access to 500+ servers worldwide with dedicated IP." },
      { id: "p4", name: "Basic VPN", price: 4.99, interval: 30, description: "Standard security with access to 10 global servers." },
    ]
  },
  { 
    id: "m3", 
    name: "Echo Music", 
    description: "High-fidelity music streaming with millions of tracks.",
    category: "Entertainment",
    window: "48h",
    grace: "14d",
    plans: [
      { id: "p5", name: "Family Premium", price: 19.99, interval: 30, description: "Up to 6 accounts with offline listening and no ads." },
      { id: "p6", name: "Individual", price: 9.99, interval: 30, description: "Single account with high-quality streaming." },
    ]
  },
];