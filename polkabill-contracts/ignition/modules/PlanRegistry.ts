// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PlanRegistryModule = buildModule("PlanRegistryMod", (m) => {
    const merchantReg = "0x9C9e284ce0D6ED4b034B64fD56f101edBdA63652";

  const planReg = m.contract("PlanRegistry", [merchantReg]);

  return { plan: planReg };
});

export default PlanRegistryModule;
