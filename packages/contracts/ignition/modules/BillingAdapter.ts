// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BillingAdapterModule = buildModule("BillingAdapterMod", (m) => {
  const billingAdapter = m.contract("BillingAdapter", []);

  // Call Initialize
  const host = "0xD198c01839dd4843918617AfD1e4DDf44Cc3BB4a";
  const hub = "0xf5B0d7c1fA5F7DC12796D919B48faCCb325e9B07";
  const feeToken = "0xA801da100bF16D07F668F4A49E1f71fc54D05177";

  m.call(billingAdapter, "initialize", [
    host,
    hub,
    feeToken
  ]);

  return { billingAdapter };
});

export default BillingAdapterModule;
