// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionManagerModule = buildModule("SubscriptionManagerModule", (m) => {
  const merchantAddr = "0x5c34bBc08b951427aF65cc2608F6BE5852d3f037"
  const planAddr = "0xFa0DD45434E310daC6932b92A1B78fFD0Ed19285";
  const controller = "0xFa0DD45434E310daC6932b92A1B78fFD0Ed19285";

  const subManager = m.contract("SubscriptionManager", [merchantAddr, planAddr, controller]);

  return { subManager };
});

export default SubscriptionManagerModule;
