// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionsControllerModule = buildModule(
  "SubscriptionsControllerMod",
  (m) => {
    const host = "0xD198c01839dd4843918617AfD1e4DDf44Cc3BB4a";
    const feeToken = "0xA801da100bF16D07F668F4A49E1f71fc54D05177";
    const chainReg = "0xD4e3363741d2e2A034A3F0B2004a90aDD62968bf";
    const subManager = "0x221AA534015a9260c10d183B087dDd2447d2058f";
    const merchantReg = "0x55eF99F40f8674034e192BC90407f2284B11C3EF";

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
