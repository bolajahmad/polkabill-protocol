// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PlanRegistryModule = buildModule("PlanRegistryMod", (m) => {
    const merchantReg = "0x97990b090231112677315f707976b4bDa436689A";

  const planReg = m.contract("PlanRegistry", [merchantReg]);

  return { plan: planReg };
});

export default PlanRegistryModule;
