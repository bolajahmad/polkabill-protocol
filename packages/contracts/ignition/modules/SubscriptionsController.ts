// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionsControllerModule = buildModule(
  "SubscriptionsControllerMod",
  (m) => {
    const host = "0x2EdB74C269948b60ec1000040E104cef0eABaae8";
    const feeToken = "0xA801da100bF16D07F668F4A49E1f71fc54D05177";
    const chainReg = "0x406E9a8f32B5bD57Bd3fE9BB65884f2305d3E0d9";
    const subManager = "0x482F03F0F2F0DE177B4aEE0EC26Cb40556824E60";
    const merchantReg = "0xb3eb7F0E852F1aea9219daDd4bf070359351E22d";

    const subscriptionsController = m.contract("SubscriptionsController", [
      host,
      feeToken,
      chainReg,
      subManager,
      merchantReg,
    ]);

    // Update ChainRegistry with the expected SubscriptionController address
    const chainRegContract = m.contractAt("ChainRegistry", chainReg);
    m.call(chainRegContract, "updateController", [subscriptionsController]);

    // Update MerchantRegistry with the expected SubscriptionController address
    const merchantRegContract = m.contractAt("MerchantRegistry", merchantReg);
    m.call(merchantRegContract, "updateController", [subscriptionsController]);

    // Update the SubscriptionManager with the expected SubscritionController address
    const subManagerContract = m.contractAt("SubscriptionManager", subManager);
    m.call(subManagerContract, "updateController", [subscriptionsController]);

    return { subscriptionsController };
  },
);

export default SubscriptionsControllerModule;
