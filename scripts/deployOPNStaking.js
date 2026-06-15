const hre = require("hardhat");

async function main() {
  const OPNStaking = await hre.ethers.getContractFactory("OPNNativeStaking");

  const staking = await OPNStaking.deploy();

  await staking.waitForDeployment();

  console.log("OPNNativeStaking deployed to:", await staking.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});