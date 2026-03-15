// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionManagerModule = buildModule("SubscriptionManagerModule", (m) => {
  const chain = "0xD4e3363741d2e2A034A3F0B2004a90aDD62968bf";

  const subManager = m.contract("SubscriptionManager", [chain]);

  return { subManager };
});

export default SubscriptionManagerModule;
