export const MOCK_PLANS = [
  {
    id: '1',
    name: 'Starter',
    price: 9.99,
    features: ['Up to 5 projects', 'Basic analytics', 'Community support'],
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    id: '2',
    name: 'Professional',
    price: 29.99,
    features: ['Unlimited projects', 'Advanced analytics', 'Priority support', 'Custom domains'],
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    popular: true,
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 99.99,
    features: [
      'Custom solutions',
      'Dedicated account manager',
      'SLA guarantees',
      'On-premise options',
    ],
    color: 'bg-purple-50 text-purple-600 border-purple-100',
  },
];

export const SUPPORTED_CHAINS = [
  {
    id: 11155111,
    name: 'Sepolia',
    tokens: [
      '0xA801da100bF16D07F668F4A49E1f71fc54D05177',
      '0xb2Ff79C688c71696d2B9c4b96908F40d15038691',
      '0xd077A400968890Eacc75cdc901F0356c943e4fDb',
    ],
    icon: 'Ξ',
  },
  {
    id: 84532,
    name: 'Base Sepolia',
    icon: 'P',
    tokens: [
      '0xA801da100bF16D07F668F4A49E1f71fc54D05177',
      '0x52B6df3c98225F040b9B89A07180E7Bc6ba34f87',
    ],
  },
  {
    id: 80002,
    name: 'Polygon Amoy',
    tokens: [
      '0x693B854D6965ffEAaE21C74049deA644b56FCaCB',
      '0x30ec6f8216f82A2042f35920a7DA0504bd9F470f',
    ],
    icon: 'A',
  },
  {
    id: 420420417,
    name: 'Asset Hub (Paseo)',
    icon: 'B',
    tokens: ['0x0Dc440CF87830f0aF564eB8b62b454B7e0c68a4b'],
  },
];
