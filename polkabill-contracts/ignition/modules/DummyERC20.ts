import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DummyERC20Module", (m) => {
  const dummyERC20 = m.contract("DummyERC20", [
    "Dummy ERC20", "DUMMY", 18
  ]);

  return { dummyERC20 };
});
