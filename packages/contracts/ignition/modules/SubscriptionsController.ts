// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionsControllerModule = buildModule(
  "SubscriptionsControllerMod",
  (m) => {
    const host = "0x2EdB74C269948b60ec1000040E104cef0eABaae8";
    const feeToken = "0xA801da100bF16D07F668F4A49E1f71fc54D05177";
    const chainReg = "0x46A6cbc0Fd15936F4F67aABBc554f4CAf80281F9";
    const subManager = "0xBfdbA4E11De8B3b82F910Dd3AE8e517Ce60b0bB2";
    const merchantReg = "0x81854B479c4657E92D52dE54BdE06E0Ed28586F9";

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
