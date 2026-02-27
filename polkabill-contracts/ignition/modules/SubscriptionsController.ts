// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionsControllerModule = buildModule(
  "SubscriptionsControllerMod",
  (m) => {
    const host = "0xD198c01839dd4843918617AfD1e4DDf44Cc3BB4a";
    const feeToken = "0xA801da100bF16D07F668F4A49E1f71fc54D05177";
    const chainReg = "0x509b31A3868D90A02ee65331290fAaDE59adD951";
    const subManager = "0x42B11dB9c5D31e8bd214516aED5293aFB806b28c";
    const merchantReg = "0x8499CBBCf79239Bf38E1056580C2020CA12C1cBa";

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

    // // // Update merchant registry with the expected controller address
    // const merchantRegContract = m.contractAt("MerchantRegistry", chainReg);
    // m.call(merchantRegContract, "updateController", [subscriptionsController]);
    // m.call(merchantRegContract, "setSubscriptionManager", [subManager]);

    // // // Update the subscription manager with the expected controller address
    // const subManagerContract = m.contractAt("SubscriptionManager", subManager);
    // m.call(subManagerContract, "updateController", [subscriptionsController]);

    return { subscriptionsController };
  },
);

export default SubscriptionsControllerModule;
