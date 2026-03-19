// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BillingAdapterModule = buildModule("BillingAdapterMod", (m) => {
  const billingAdapter = m.contract("BillingAdapter", []);

  // Call Initialize
  // const host = "0x9a2840D050e64Db89c90Ac5857536E4ec66641DE";
  // const hub = "0x75704c73bdD5Ce0dd843ea4AAa375099c133E669";
  // const feeToken = "0x693b854d6965ffeaae21c74049dea644b56fcacb";

  // m.call(billingAdapter, "initialize", [
  //   host,
  //   hub,
  //   feeToken
  // ]);

  return { billingAdapter };
});

export default BillingAdapterModule;
