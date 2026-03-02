// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionManagerModule = buildModule("SubscriptionManagerModule", (m) => {
  const merchantAddr = "0x97990b090231112677315f707976b4bDa436689A"
  const planAddr = "0x45a33501380787989D6ec89908C89D109cAC0806";
  const controller = "0xFa0DD45434E310daC6932b92A1B78fFD0Ed19285";
  const chain = "0xD1BB4F0e0ae5178b35e2AF4A9ab21432a82FA248";

  const subManager = m.contract("SubscriptionManager", [merchantAddr, planAddr, controller, chain]);

  return { subManager };
});

export default SubscriptionManagerModule;
