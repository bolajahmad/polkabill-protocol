// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionsControllerModule = buildModule(
  "SubscriptionsControllerMod",
  (m) => {
    const host = "0xD198c01839dd4843918617AfD1e4DDf44Cc3BB4a";
    const feeToken = "0xA801da100bF16D07F668F4A49E1f71fc54D05177";
    const chainReg = "0x4691e2EAc5fbAdA85a0aDAC7d607E149ff83b363";
    const subManager = "0xEABBa27579dC4bCf61cCFdcccBC75E8C89d65b0E";
    const merchantReg = "0xB99e6b15f1962385a13C040384D8B73a18EFF975";

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
