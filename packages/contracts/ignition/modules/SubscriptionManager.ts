// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionManagerModule = buildModule("SubscriptionManagerModule", (m) => {
  const chain = "0x4691e2EAc5fbAdA85a0aDAC7d607E149ff83b363";

  const subManager = m.contract("SubscriptionManager", [chain]);

  return { subManager };
});

export default SubscriptionManagerModule;
