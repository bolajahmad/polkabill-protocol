export const BillingAdapterContractABI = [
  {
    inputs: [],
    name: "InvalidInitialization",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidRequestType",
    type: "error",
  },
  {
    inputs: [],
    name: "NotInitializing",
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
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
    ],
    name: "SafeERC20FailedOperation",
    type: "error",
  },
  {
    inputs: [],
    name: "UnauthorizedCall",
    type: "error",
  },
  {
    inputs: [],
    name: "UnexpectedCall",
    type: "error",
  },
  {
    inputs: [],
    name: "UnregisteredSource",
    type: "error",
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
        indexed: true,
        internalType: "bytes32",
        name: "commitmentId",
        type: "bytes32",
      },
    ],
    name: "ChargeDispatchSent",
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
    ],
    name: "ChargeExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "oldFee",
        type: "uint256",
      },
    ],
    name: "FeeUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "version",
        type: "uint64",
      },
    ],
    name: "Initialized",
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
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "active",
        type: "bool",
      },
    ],
    name: "TokenUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "charges",
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
    name: "feeToken",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "host",
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
        name: "_h",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "_hub",
        type: "bytes",
      },
      {
        internalType: "address",
        name: "_fee",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "bytes",
                name: "source",
                type: "bytes",
              },
              {
                internalType: "bytes",
                name: "dest",
                type: "bytes",
              },
              {
                internalType: "uint64",
                name: "nonce",
                type: "uint64",
              },
              {
                internalType: "bytes",
                name: "from",
                type: "bytes",
              },
              {
                internalType: "bytes",
                name: "to",
                type: "bytes",
              },
              {
                internalType: "uint64",
                name: "timeoutTimestamp",
                type: "uint64",
              },
              {
                internalType: "bytes",
                name: "body",
                type: "bytes",
              },
            ],
            internalType: "struct PostRequest",
            name: "request",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "relayer",
            type: "address",
          },
        ],
        internalType: "struct IncomingPostRequest",
        name: "_incoming",
        type: "tuple",
      },
    ],
    name: "onAccept",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes",
                    name: "source",
                    type: "bytes",
                  },
                  {
                    internalType: "bytes",
                    name: "dest",
                    type: "bytes",
                  },
                  {
                    internalType: "uint64",
                    name: "nonce",
                    type: "uint64",
                  },
                  {
                    internalType: "address",
                    name: "from",
                    type: "address",
                  },
                  {
                    internalType: "uint64",
                    name: "timeoutTimestamp",
                    type: "uint64",
                  },
                  {
                    internalType: "bytes[]",
                    name: "keys",
                    type: "bytes[]",
                  },
                  {
                    internalType: "uint64",
                    name: "height",
                    type: "uint64",
                  },
                  {
                    internalType: "bytes",
                    name: "context",
                    type: "bytes",
                  },
                ],
                internalType: "struct GetRequest",
                name: "request",
                type: "tuple",
              },
              {
                components: [
                  {
                    internalType: "bytes",
                    name: "key",
                    type: "bytes",
                  },
                  {
                    internalType: "bytes",
                    name: "value",
                    type: "bytes",
                  },
                ],
                internalType: "struct StorageValue[]",
                name: "values",
                type: "tuple[]",
              },
            ],
            internalType: "struct GetResponse",
            name: "response",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "relayer",
            type: "address",
          },
        ],
        internalType: "struct IncomingGetResponse",
        name: "",
        type: "tuple",
      },
    ],
    name: "onGetResponse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "source",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "dest",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "nonce",
            type: "uint64",
          },
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "uint64",
            name: "timeoutTimestamp",
            type: "uint64",
          },
          {
            internalType: "bytes[]",
            name: "keys",
            type: "bytes[]",
          },
          {
            internalType: "uint64",
            name: "height",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "context",
            type: "bytes",
          },
        ],
        internalType: "struct GetRequest",
        name: "",
        type: "tuple",
      },
    ],
    name: "onGetTimeout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "source",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "dest",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "nonce",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "from",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "to",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "timeoutTimestamp",
            type: "uint64",
          },
          {
            internalType: "bytes",
            name: "body",
            type: "bytes",
          },
        ],
        internalType: "struct PostRequest",
        name: "request",
        type: "tuple",
      },
    ],
    name: "onPostRequestTimeout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    internalType: "bytes",
                    name: "source",
                    type: "bytes",
                  },
                  {
                    internalType: "bytes",
                    name: "dest",
                    type: "bytes",
                  },
                  {
                    internalType: "uint64",
                    name: "nonce",
                    type: "uint64",
                  },
                  {
                    internalType: "bytes",
                    name: "from",
                    type: "bytes",
                  },
                  {
                    internalType: "bytes",
                    name: "to",
                    type: "bytes",
                  },
                  {
                    internalType: "uint64",
                    name: "timeoutTimestamp",
                    type: "uint64",
                  },
                  {
                    internalType: "bytes",
                    name: "body",
                    type: "bytes",
                  },
                ],
                internalType: "struct PostRequest",
                name: "request",
                type: "tuple",
              },
              {
                internalType: "bytes",
                name: "response",
                type: "bytes",
              },
              {
                internalType: "uint64",
                name: "timeoutTimestamp",
                type: "uint64",
              },
            ],
            internalType: "struct PostResponse",
            name: "response",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "relayer",
            type: "address",
          },
        ],
        internalType: "struct IncomingPostResponse",
        name: "",
        type: "tuple",
      },
    ],
    name: "onPostResponse",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "bytes",
                name: "source",
                type: "bytes",
              },
              {
                internalType: "bytes",
                name: "dest",
                type: "bytes",
              },
              {
                internalType: "uint64",
                name: "nonce",
                type: "uint64",
              },
              {
                internalType: "bytes",
                name: "from",
                type: "bytes",
              },
              {
                internalType: "bytes",
                name: "to",
                type: "bytes",
              },
              {
                internalType: "uint64",
                name: "timeoutTimestamp",
                type: "uint64",
              },
              {
                internalType: "bytes",
                name: "body",
                type: "bytes",
              },
            ],
            internalType: "struct PostRequest",
            name: "request",
            type: "tuple",
          },
          {
            internalType: "bytes",
            name: "response",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "timeoutTimestamp",
            type: "uint64",
          },
        ],
        internalType: "struct PostResponse",
        name: "",
        type: "tuple",
      },
    ],
    name: "onPostResponseTimeout",
    outputs: [],
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
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "dest",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "to",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "body",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "timeout",
            type: "uint64",
          },
          {
            internalType: "uint256",
            name: "fee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "payer",
            type: "address",
          },
        ],
        internalType: "struct DispatchPost",
        name: "request",
        type: "tuple",
      },
    ],
    name: "quote",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "dest",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "height",
            type: "uint64",
          },
          {
            internalType: "bytes[]",
            name: "keys",
            type: "bytes[]",
          },
          {
            internalType: "uint64",
            name: "timeout",
            type: "uint64",
          },
          {
            internalType: "uint256",
            name: "fee",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "context",
            type: "bytes",
          },
        ],
        internalType: "struct DispatchGet",
        name: "request",
        type: "tuple",
      },
    ],
    name: "quote",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "bytes",
                name: "source",
                type: "bytes",
              },
              {
                internalType: "bytes",
                name: "dest",
                type: "bytes",
              },
              {
                internalType: "uint64",
                name: "nonce",
                type: "uint64",
              },
              {
                internalType: "bytes",
                name: "from",
                type: "bytes",
              },
              {
                internalType: "bytes",
                name: "to",
                type: "bytes",
              },
              {
                internalType: "uint64",
                name: "timeoutTimestamp",
                type: "uint64",
              },
              {
                internalType: "bytes",
                name: "body",
                type: "bytes",
              },
            ],
            internalType: "struct PostRequest",
            name: "request",
            type: "tuple",
          },
          {
            internalType: "bytes",
            name: "response",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "timeout",
            type: "uint64",
          },
          {
            internalType: "uint256",
            name: "fee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "payer",
            type: "address",
          },
        ],
        internalType: "struct DispatchPostResponse",
        name: "response",
        type: "tuple",
      },
    ],
    name: "quote",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "dest",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "to",
            type: "bytes",
          },
          {
            internalType: "bytes",
            name: "body",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "timeout",
            type: "uint64",
          },
          {
            internalType: "uint256",
            name: "fee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "payer",
            type: "address",
          },
        ],
        internalType: "struct DispatchPost",
        name: "request",
        type: "tuple",
      },
    ],
    name: "quoteNative",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "bytes",
                name: "source",
                type: "bytes",
              },
              {
                internalType: "bytes",
                name: "dest",
                type: "bytes",
              },
              {
                internalType: "uint64",
                name: "nonce",
                type: "uint64",
              },
              {
                internalType: "bytes",
                name: "from",
                type: "bytes",
              },
              {
                internalType: "bytes",
                name: "to",
                type: "bytes",
              },
              {
                internalType: "uint64",
                name: "timeoutTimestamp",
                type: "uint64",
              },
              {
                internalType: "bytes",
                name: "body",
                type: "bytes",
              },
            ],
            internalType: "struct PostRequest",
            name: "request",
            type: "tuple",
          },
          {
            internalType: "bytes",
            name: "response",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "timeout",
            type: "uint64",
          },
          {
            internalType: "uint256",
            name: "fee",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "payer",
            type: "address",
          },
        ],
        internalType: "struct DispatchPostResponse",
        name: "request",
        type: "tuple",
      },
    ],
    name: "quoteNative",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes",
            name: "dest",
            type: "bytes",
          },
          {
            internalType: "uint64",
            name: "height",
            type: "uint64",
          },
          {
            internalType: "bytes[]",
            name: "keys",
            type: "bytes[]",
          },
          {
            internalType: "uint64",
            name: "timeout",
            type: "uint64",
          },
          {
            internalType: "uint256",
            name: "fee",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "context",
            type: "bytes",
          },
        ],
        internalType: "struct DispatchGet",
        name: "request",
        type: "tuple",
      },
    ],
    name: "quoteNative",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
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
        internalType: "uint256",
        name: "_fee",
        type: "uint256",
      },
    ],
    name: "updateFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "withdrawFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
