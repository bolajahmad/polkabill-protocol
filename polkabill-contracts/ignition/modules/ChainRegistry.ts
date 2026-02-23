// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ChainRegistryModule = buildModule("ChainRegistryMod", (m) => {
    const adapterCodeHash = "0x19bb87b32eeeb7040194ee9eb2efd59afe06ed92295fb1ce19848340834f257b";
    const controller = "0x0dc440cf87830f0af564eb8b62b454b7e0c68a4b"

  const chainReg = m.contract("ChainRegistry", [adapterCodeHash, controller]);

  return { chain: chainReg };
});

export default ChainRegistryModule;
