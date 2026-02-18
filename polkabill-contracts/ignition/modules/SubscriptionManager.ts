// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther, zeroAddress } from "viem";

const MERCHANT_REG_ADDRESS = zeroAddress;
const PLAN_REG_ADDRESS = zeroAddress;

const LockModule = buildModule("SubManagerModule", (m) => {
  const merchantddr = m.getParameter("merchant", MERCHANT_REG_ADDRESS);
  const planAddr = m.getParameter("plan", PLAN_REG_ADDRESS);

  const lock = m.contract("SubscriptionManager", [merchantddr, planAddr]);

  return { lock };
});

export default LockModule;
