// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionManagerModule = buildModule("SubscriptionManagerModule", (m) => {
  const chain = "0x406E9a8f32B5bD57Bd3fE9BB65884f2305d3E0d9";

  const subManager = m.contract("SubscriptionManager", [chain]);

  return { subManager };
});

export default SubscriptionManagerModule;
