// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BillingAdapterModule = buildModule("BillingAdapterMod", (m) => {
  const billingAdapter = m.contract("BillingAdapter", []);

  // Call Initialize
  const host = "0x2EdB74C269948b60ec1000040E104cef0eABaae8";
  const hub = "0x21d4de374BF31123D9A602d2DCDeD72fC8495Bbd";
  const feeToken = "0xA801da100bF16D07F668F4A49E1f71fc54D05177";

  m.call(billingAdapter, "initialize", [
    host,
    hub,
    feeToken
  ]);

  return { billingAdapter };
});

export default BillingAdapterModule;
