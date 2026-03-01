// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionsControllerModule = buildModule(
  "SubscriptionsControllerMod",
  (m) => {
    const host = "0xbb26e04a71e7c12093e82b83ba310163eac186fa";
    const feeToken = "0x0dc440cf87830f0af564eb8b62b454b7e0c68a4b";
    const chainReg = "0x24B2876672969270eCb57e1B4B2620Fc65Ec8C94";
    const subManager = "0x18A1e425C762A37fc4c78Dd327D9d7823193046D";
    const merchantReg = "0x1f98772C698FEb08cCF2364B83599908c93BaDA9";

    const subscriptionsController = m.contract("SubscriptionsController", [
      host,
      feeToken,
      chainReg,
      subManager,
      merchantReg,
    ]);

    // On Successful deploy, store the address
    // Update ChainRegistry with the expected controller address
    const chainRegContract = m.contractAt("ChainRegistry", chainReg);
    m.call(chainRegContract, "updateController", [subscriptionsController]);

    // // // Update merchant registry with the expected controller address
    const merchantRegContract = m.contractAt("MerchantRegistry", chainReg);
    m.call(merchantRegContract, "updateController", [subscriptionsController]);
    m.call(merchantRegContract, "setSubscriptionManager", [subManager]);

    // // // Update the subscription manager with the expected controller address
    const subManagerContract = m.contractAt("SubscriptionManager", subManager);
    m.call(subManagerContract, "updateController", [subscriptionsController]);

    return { subscriptionsController };
  },
);

export default SubscriptionsControllerModule;
