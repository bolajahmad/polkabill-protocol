// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionsControllerModule = buildModule(
  "SubscriptionsControllerMod",
  (m) => {
    const host = "0xbb26e04a71e7c12093e82b83ba310163eac186fa";
    const feeToken = "0x0dc440cf87830f0af564eb8b62b454b7e0c68a4b";
    const chainReg = "0xbBa26e6278D6eD710f881633E780A9C3b23a3BAb";
    const subManager = "0xc1c8c9b92AB6083609E29193929852883c66D32a";
    const merchantReg = "0x6D73534191353E714F607D6b3C08425987131C19";

    const subscriptionsController = m.contract("SubscriptionsController", [
      host,
      feeToken,
      chainReg,
      subManager,
      merchantReg,
    ]);

    // Update ChainRegistry with the expected SubscriptionController address
    // const chainRegContract = m.contractAt("ChainRegistry", chainReg);
    // m.call(chainRegContract, "updateController", [subscriptionsController]);

    // // Update MerchantRegistry with the expected SubscriptionController address
    // const merchantRegContract = m.contractAt("MerchantRegistry", merchantReg);
    // m.call(merchantRegContract, "updateController", [subscriptionsController]);

    // // Update the SubscriptionManager with the expected SubscritionController address
    // const subManagerContract = m.contractAt("SubscriptionManager", subManager);
    // m.call(subManagerContract, "updateController", [subscriptionsController]);

    return { subscriptionsController };
  },
);

export default SubscriptionsControllerModule;
