// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionManagerModule = buildModule("SubscriptionManagerModule", (m) => {
  const chain = "0x46A6cbc0Fd15936F4F67aABBc554f4CAf80281F9";

  const subManager = m.contract("SubscriptionManager", [chain]);

  return { subManager };
});

export default SubscriptionManagerModule;
