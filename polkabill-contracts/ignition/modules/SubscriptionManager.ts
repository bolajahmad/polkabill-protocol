// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionManagerModule = buildModule("SubscriptionManagerModule", (m) => {
  const chain = "0xf77e8b132a1977fbbc893478c4bff30ad4c91751";

  const subManager = m.contract("SubscriptionManager", [chain]);

  return { subManager };
});

export default SubscriptionManagerModule;
