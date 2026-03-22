// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerchantRegistryModule = buildModule("MerchantRegistryMod", (m) => {
    const chainReg = "0xb0f7C69ed9F4910ce38cAbD1f03827C0943076c1";
    const subManager = "0x7AFa0299E063333453a6d8cac6045a09a4F26505";

  const merchantReg = m.contract("MerchantRegistry", [chainReg, subManager]);

  return { merchant: merchantReg };
});

export default MerchantRegistryModule;
