export const SubscriptionManagerContractABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_chain",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "MerchantNotActive",
    type: "error",
  },
  {
    inputs: [],
    name: "NotSubscriber",
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
    name: "PlanNotActive",
    type: "error",
  },
  {
    inputs: [],
    name: "SubscriptionCancelled",
    type: "error",
  },
  {
    inputs: [],
    name: "SubscriptionMissing",
    type: "error",
  },
  {
    inputs: [],
    name: "UnregisteredChain",
    type: "error",
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
        internalType: "uint256",
        name: "subId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "subscriber",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "planId",
        type: "uint256",
      },
    ],
    name: "Subscribed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "subscriptionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "billingCycle",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_nextCharge",
        type: "uint256",
      },
    ],
    name: "SubscriptionPaid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "subscriptionId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "enum Status",
        name: "status",
        type: "uint8",
      },
      {
        indexed: false,
        internalType: "address",
        name: "by",
        type: "address",
      },
    ],
    name: "SubscriptionUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_subId",
        type: "uint256",
      },
    ],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_subId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_cycle",
        type: "uint256",
      },
    ],
    name: "confirmCharge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_subId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_cycle",
        type: "uint256",
      },
    ],
    name: "confirmPayment",
    outputs: [
      {
        internalType: "bool",
        name: "_paid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_subId",
        type: "uint256",
      },
    ],
    name: "getSubscription",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "planId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "subscriber",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nextChargeAt",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "billingCycle",
            type: "uint256",
          },
          {
            internalType: "enum Status",
            name: "status",
            type: "uint8",
          },
        ],
        internalType: "struct Subscription",
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
        internalType: "uint256",
        name: "_subId",
        type: "uint256",
      },
    ],
    name: "isChargeAllowed",
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
    inputs: [
      {
        internalType: "uint256",
        name: "_subId",
        type: "uint256",
      },
    ],
    name: "isChargeAllowedMut",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
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
        internalType: "uint256",
        name: "_subId",
        type: "uint256",
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
    name: "requestCharge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_pId",
        type: "uint256",
      },
    ],
    name: "subscribe",
    outputs: [
      {
        internalType: "uint256",
        name: "_nextSubId",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
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
        name: "_merchant",
        type: "address",
      },
    ],
    name: "updateMerchantRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_plan",
        type: "address",
      },
    ],
    name: "updatePlanRegistry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
