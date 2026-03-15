// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerchantRegistryModule = buildModule("MerchantRegistryMod", (m) => {
    const chainReg = "0xD4e3363741d2e2A034A3F0B2004a90aDD62968bf";
    const subManager = "0x221AA534015a9260c10d183B087dDd2447d2058f";

  const merchantReg = m.contract("MerchantRegistry", [chainReg, subManager]);

  return { merchant: merchantReg };
});

export default MerchantRegistryModule;
