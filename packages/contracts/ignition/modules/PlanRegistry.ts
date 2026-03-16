// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PlanRegistryModule = buildModule("PlanRegistryMod", (m) => {
    const merchantReg = "0xb3eb7F0E852F1aea9219daDd4bf070359351E22d";

  const planReg = m.contract("PlanRegistry", [merchantReg]);

  return { plan: planReg };
});

export default PlanRegistryModule;
