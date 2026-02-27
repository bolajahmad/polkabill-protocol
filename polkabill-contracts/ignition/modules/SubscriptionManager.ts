// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionManagerModule = buildModule("SubscriptionManagerModule", (m) => {
  const merchantAddr = "0x8499CBBCf79239Bf38E1056580C2020CA12C1cBa"
  const planAddr = "0x39BBAAF9c319f5416FD83c0982d406b9DFf2c910";
  const controller = "0xFa0DD45434E310daC6932b92A1B78fFD0Ed19285";
  const chain = "0x509b31A3868D90A02ee65331290fAaDE59adD951";

  const subManager = m.contract("SubscriptionManager", [merchantAddr, planAddr, controller, chain]);

  return { subManager };
});

export default SubscriptionManagerModule;
