// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionsControllerModule = buildModule(
  "SubscriptionsControllerMod",
  (m) => {
    const host = "0xD198c01839dd4843918617AfD1e4DDf44Cc3BB4a";
    const feeToken = "0xA801da100bF16D07F668F4A49E1f71fc54D05177";
    const chainReg = "0xf77e8b132A1977fBbC893478C4Bff30Ad4C91751";
    const subManager = "0x21d4de374BF31123D9A602d2DCDeD72fC8495Bbd";
    const merchantReg = "0x9C9e284ce0D6ED4b034B64fD56f101edBdA63652";

    const subscriptionsController = m.contract("SubscriptionsController", [
      host,
      feeToken,
      chainReg,
      subManager,
      merchantReg,
    ]);

    // On Successful deploy, store the address
    // Update ChainRegistry with the expected controller address
    // const chainRegContract = m.contractAt("ChainRegistry", chainReg);
    // m.call(chainRegContract, "updateController", [subscriptionsController]);

    // // // // Update merchant registry with the expected controller address
    // const merchantRegContract = m.contractAt("MerchantRegistry", chainReg);
    // m.call(merchantRegContract, "updateController", [subscriptionsController]);
    // m.call(merchantRegContract, "setSubscriptionManager", [subManager]);

    // // // // Update the subscription manager with the expected controller address
    // const subManagerContract = m.contractAt("SubscriptionManager", subManager);
    // m.call(subManagerContract, "updateController", [subscriptionsController]);

    return { subscriptionsController };
  },
);

export default SubscriptionsControllerModule;
