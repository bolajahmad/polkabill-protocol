// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PlanRegistryModule = buildModule("PlanRegistryMod", (m) => {
    const merchantReg = "0x55eF99F40f8674034e192BC90407f2284B11C3EF";

  const planReg = m.contract("PlanRegistry", [merchantReg]);

  return { plan: planReg };
});

export default PlanRegistryModule;
