import * as CONTRACTS from "../ignition/deployments/chain-420420417/deployed_addresses.json";

export const ChainRegistryContractAddress = (CONTRACTS["ChainRegistryMod#ChainRegistry"] || "0x1f98772C698FEb08cCF2364B83599908c93BaDA9") as `0x${string}`;

export const MerchantRegistryContractAddress = (CONTRACTS["MerchantRegistryMod#MerchantRegistry"] || "0x5Fd5fC2a89F7eF867bB977E9848F0f90EF42E678") as `0x${string}`;

export const PlanRegistryContractAddress = (CONTRACTS["PlanRegistryMod#PlanRegistry"] || "0xca35BAFFd15B593Fa7379A1ADb9e21145B813622") as `0x${string}`;

export const SubscriptionManagerContractAddress = (CONTRACTS["SubscriptionManagerModule#SubscriptionManager"] || "0x9C72abD08280Ba646889fd293232c3d8f60038D5") as `0x${string}`;

export const SubscriptionsControllerContractAddress = (CONTRACTS["SubscriptionsControllerMod#SubscriptionsController"] || "0x1EE246cB1CeCCbcB5945D3B53c7aB6B200DCbF19") as `0x${string}`;

export const BillingAdapterCodeHash= "0x19bb87b32eeeb7040194ee9eb2efd59afe06ed92295fb1ce19848340834f257b" as `0x${string}`;