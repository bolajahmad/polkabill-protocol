// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionsControllerModule = buildModule(
  "SubscriptionsControllerMod",
  (m) => {
    const host = "0xbb26e04a71e7c12093e82b83ba310163eac186fa";
    const feeToken = "0x0dc440cf87830f0af564eb8b62b454b7e0c68a4b";
    const chainReg = "0xD1BB4F0e0ae5178b35e2AF4A9ab21432a82FA248";
    const subManager = "0x3cc6dE0F20F93Cc8f84fF22524816ecC6EEc87aE";
    const merchantReg = "0x97990b090231112677315f707976b4bDa436689A";

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
