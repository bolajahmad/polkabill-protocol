// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionsControllerModule = buildModule(
  "SubscriptionsControllerMod",
  (m) => {
    const host = "0x2EdB74C269948b60ec1000040E104cef0eABaae8";
    const feeToken = "0xA801da100bF16D07F668F4A49E1f71fc54D05177";
    const chainReg = "0xb0f7C69ed9F4910ce38cAbD1f03827C0943076c1";
    const subManager = "0x7AFa0299E063333453a6d8cac6045a09a4F26505";
    const merchantReg = "0xbF35A9083c86b6F7c1b3CA441e05CDFf11a1d4f1";

    const subscriptionsController = m.contract("SubscriptionsController", [
      host,
      feeToken,
      chainReg,
      subManager,
      merchantReg,
    ]);

    return { subscriptionsController };
  },
);

export default SubscriptionsControllerModule;
