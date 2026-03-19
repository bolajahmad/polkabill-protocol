// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionsControllerModule = buildModule(
  "SubscriptionsControllerMod",
  (m) => {
    const subManager = "0x845589dbb1271BE563D768e93F5f59cdaA0fd192";

    const subscriptionsController = m.contract("SubscriptionsController", [
      subManager,
    ]);

    return { subscriptionsController };
  },
);

export default SubscriptionsControllerModule;
