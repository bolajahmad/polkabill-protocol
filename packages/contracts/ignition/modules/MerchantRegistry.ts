// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerchantRegistryModule = buildModule("MerchantRegistryMod", (m) => {
    const chainReg = "0x406E9a8f32B5bD57Bd3fE9BB65884f2305d3E0d9";
    const subManager = "0x482F03F0F2F0DE177B4aEE0EC26Cb40556824E60";

  const merchantReg = m.contract("MerchantRegistry", [chainReg, subManager]);

    // Update the subscription manager with the expected MerchantRegistry address
    const subManagerContract = m.contractAt("SubscriptionManager", subManager);
    m.call(subManagerContract, "updateMerchantRegistry", [merchantReg]);

  return { merchant: merchantReg };
});

export default MerchantRegistryModule;
