// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ChainRegistryModule = buildModule("ChainRegistryMod", (m) => {
  const chainReg = m.contract("ChainRegistry", []);

  return { chain: chainReg };
});

export default ChainRegistryModule;
