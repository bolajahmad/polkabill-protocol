// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerchantRegistryModule = buildModule("MerchantRegistryMod", (m) => {
    const chainReg = "0x1de3062E63F7dB84789Ef25E17EC863D14cE67C9";
    const subManager = "0x062F3Dcf2D3584a0095a52Ccec29975bfCf3A7a1";

  const merchantReg = m.contract("MerchantRegistry", [chainReg, subManager]);

  return { merchant: merchantReg };
});

export default MerchantRegistryModule;
