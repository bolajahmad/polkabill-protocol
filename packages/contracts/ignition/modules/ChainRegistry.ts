// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ChainRegistryModule = buildModule("ChainRegistryMod", (m) => {
  const chainReg = m.contract("ChainRegistry", []);

  // Register one billing adapter for Base Sepolia (84532) - this is needed for the SubscriptionManager to work properly
  // m.call(
  //   chainReg,
  //   "registerChain",
  //   [84532n, "0xc053dF1730941Be37Fe828aD17e241a59A986EA9"]
  // );

  return { chain: chainReg };
});

export default ChainRegistryModule;
