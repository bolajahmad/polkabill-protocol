// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://v2.hardhat.org/ignition

import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const PlanRegistryModule = buildModule('PlanRegistryMod', m => {
  const merchantReg = '0x81854B479c4657E92D52dE54BdE06E0Ed28586F9';

  const planReg = m.contract('PlanRegistry', [merchantReg]);


  return { plan: planReg };
});

export default PlanRegistryModule;
