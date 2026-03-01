export const MerchantContractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_chain",
        type: "address",
      },
      {
        internalType: "address",
        name: "_mgr",
        type: "address",
      },
      {
        internalType: "address",
        name: "_controller",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "MerchantNotUnique",
    type: "error",
  },
  {
    inputs: [],
    name: "MissingMerchant",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "UnregisteredChain",
    type: "error",
  },
  {
    inputs: [],
    name: "UnsupportedChain",
    type: "error",
  },
  {
    inputs: [],
    name: "UnsupportedToken",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "mId",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
    ],
    name: "MerchantCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "mId",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    name: "MerchantStatusUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "mid",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_grace",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "window",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
    ],
    name: "MerchantUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "mId",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "chainId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "payoutAddr",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "old",
        type: "address",
      },
    ],
    name: "PayoutAddressSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "mid",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "cid",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "isAdding",
        type: "bool",
      },
    ],
    name: "TokensAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_grace",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_window",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_meta",
        type: "bytes",
      },
    ],
    name: "createMerchant",
    outputs: [
      {
        internalType: "address",
        name: "mId",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mid",
        type: "address",
      },
    ],
    name: "getMerchant",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "grace",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "window",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
          {
            internalType: "bytes",
            name: "metadata",
            type: "bytes",
          },
        ],
        internalType: "struct Merchant",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mid",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_cid",
        type: "uint256",
      },
    ],
    name: "getPayoutAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mid",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_cid",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "isApprovedToken",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mid",
        type: "address",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    name: "setMerchantStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mid",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_cid",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_payout",
        type: "address",
      },
    ],
    name: "setPayoutAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mgr",
        type: "address",
      },
    ],
    name: "setSubscriptionManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "subManager",
    outputs: [
      {
        internalType: "contract ISubscriptionManager",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "subsController",
    outputs: [
      {
        internalType: "contract ISubscriptionsController",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mid",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_cid",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "_tokens",
        type: "address[]",
      },
      {
        internalType: "bool",
        name: "_adding",
        type: "bool",
      },
    ],
    name: "updateAllowedToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_controller",
        type: "address",
      },
    ],
    name: "updateController",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_mid",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_grace",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_window",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_metadata",
        type: "bytes",
      },
    ],
    name: "updateMerchantConfig",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
