// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerchantRegistryModule = buildModule("MerchantRegistryMod", (m) => {
    const chainReg = "0x97e4b7577e4B3Db2F603054a6Aa4a9E2d6f14a00";
    const subManager = "0x845589dbb1271BE563D768e93F5f59cdaA0fd192";

  const merchantReg = m.contract("MerchantRegistry", [chainReg, subManager]);

    // Update the subscription manager with the expected MerchantRegistry address
    // const subManagerContract = m.contractAt("SubscriptionManager", subManager);
    // m.call(subManagerContract, "updateMerchantRegistry", [merchantReg]);

  return { merchant: merchantReg };
});

export default MerchantRegistryModule;
