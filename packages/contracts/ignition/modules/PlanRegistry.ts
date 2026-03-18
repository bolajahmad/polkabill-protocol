// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const PlanRegistryModule = buildModule('PlanRegistryMod', m => {
  const merchantReg = '0x6D73534191353E714F607D6b3C08425987131C19';

  const planReg = m.contract('PlanRegistry', [merchantReg]);

  const subManager = '0xc1c8c9b92AB6083609E29193929852883c66D32a';
  // Update the subscription manager with the expected MerchantRegistry address
  const subManagerContract = m.contractAt('SubscriptionManager', subManager);
  m.call(subManagerContract, 'updatePlanRegistry', [merchantReg]);

  return { plan: planReg };
});

export default PlanRegistryModule;
