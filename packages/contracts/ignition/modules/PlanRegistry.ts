// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PlanRegistryModule = buildModule("PlanRegistryMod", (m) => {
    const merchantReg = "0xB99e6b15f1962385a13C040384D8B73a18EFF975";

  const planReg = m.contract("PlanRegistry", [merchantReg]);

  return { plan: planReg };
});

export default PlanRegistryModule;
