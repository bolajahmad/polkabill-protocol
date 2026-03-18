// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerchantRegistryModule = buildModule("MerchantRegistryMod", (m) => {
    const chainReg = "0xbBa26e6278D6eD710f881633E780A9C3b23a3BAb";
    const subManager = "0xc1c8c9b92AB6083609E29193929852883c66D32a";

  const merchantReg = m.contract("MerchantRegistry", [chainReg, subManager]);

    // Update the subscription manager with the expected MerchantRegistry address
    const subManagerContract = m.contractAt("SubscriptionManager", subManager);
    m.call(subManagerContract, "updateMerchantRegistry", [merchantReg]);

  return { merchant: merchantReg };
});

export default MerchantRegistryModule;
