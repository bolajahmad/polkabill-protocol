import { artifacts } from "hardhat";
import { keccak256 } from "viem";

async function main() {
  const artifact = await artifacts.readArtifact("BillingAdapter");
  const bytecode = artifact.deployedBytecode;
  const hash = keccak256(bytecode);
  console.log(hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
