// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionsControllerModule = buildModule(
  "SubscriptionsControllerMod",
  (m) => {
    const host = "0xbb26e04a71e7c12093e82b83ba310163eac186fa";
    const feeToken = "0x0dc440cf87830f0af564eb8b62b454b7e0c68a4b";
    const chainReg = "0x5e58936DdFA55A9a5115446B02689874261eD34A";
    const subManager = "0x23a92444BC4a9Cf639B54732eD33A55A9ae0ba15";
    const merchantReg = "0x43408C22242fa6A59DE28ab7128Ea4aC121C5569";

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
