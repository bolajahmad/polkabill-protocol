// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerchantRegistryModule = buildModule("MerchantRegistryMod", (m) => {
    const chainReg = "0xf77e8b132A1977fBbC893478C4Bff30Ad4C91751";
    const subManager = "0x21d4de374BF31123D9A602d2DCDeD72fC8495Bbd";

  const merchantReg = m.contract("MerchantRegistry", [chainReg, subManager]);

  return { merchant: merchantReg };
});

export default MerchantRegistryModule;
