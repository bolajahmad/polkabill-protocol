// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerchantRegistryModule = buildModule("MerchantRegistryMod", (m) => {
    const chainReg = "0xD1BB4F0e0ae5178b35e2AF4A9ab21432a82FA248";
    const subManager = "0x9C72abD08280Ba646889fd293232c3d8f60038D5";
    const controller = "0x0dc440cf87830f0af564eb8b62b454b7e0c68a4b"

  const merchantReg = m.contract("MerchantRegistry", [chainReg, subManager, controller]);

  return { merchant: merchantReg };
});

export default MerchantRegistryModule;
