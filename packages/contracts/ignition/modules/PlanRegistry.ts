// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const PlanRegistryModule = buildModule('PlanRegistryMod', m => {
  const merchantReg = '0x0D0f40bb15cd1AdC996d3a5Ae6d48dd4A4746940';

  const planReg = m.contract('PlanRegistry', [merchantReg]);

  // const subManager = '0xc1c8c9b92AB6083609E29193929852883c66D32a';
  // // Update the subscription manager with the expected MerchantRegistry address
  // const subManagerContract = m.contractAt('SubscriptionManager', subManager);
  // m.call(subManagerContract, 'updatePlanRegistry', [merchantReg]);

  return { plan: planReg };
});

export default PlanRegistryModule;
