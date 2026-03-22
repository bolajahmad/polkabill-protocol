// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerchantRegistryModule = buildModule("MerchantRegistryMod", (m) => {
    const chainReg = "0x46A6cbc0Fd15936F4F67aABBc554f4CAf80281F9";
    const subManager = "0xBfdbA4E11De8B3b82F910Dd3AE8e517Ce60b0bB2";

  const merchantReg = m.contract("MerchantRegistry", [chainReg, subManager]);

  return { merchant: merchantReg };
});

export default MerchantRegistryModule;
