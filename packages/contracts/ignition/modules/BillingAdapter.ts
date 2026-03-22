// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BillingAdapterModule = buildModule("BillingAdapterMod", (m) => {
  const billingAdapter = m.contract("BillingAdapter", []);

  // Call Initialize
  const host = "0x9a2840D050e64Db89c90Ac5857536E4ec66641DE";
  const hub = "0x1fabb39966D694cE09095724B12BDd8c42aD8808";
  const feeToken = "0x693b854d6965ffeaae21c74049dea644b56fcacb";

  m.call(billingAdapter, "initialize", [
    host,
    hub,
    feeToken
  ]);

  return { billingAdapter };
});

export default BillingAdapterModule;
