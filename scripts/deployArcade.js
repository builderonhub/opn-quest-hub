const { ethers } = require("hardhat");

async function main() {
  const OQH_TOKEN = "0xC88Fd59E170e3e27AF12427b1b461A4Dd2337aCd";

  const Arcade = await ethers.getContractFactory("OPNArcade");
  const arcade = await Arcade.deploy(OQH_TOKEN);

  await arcade.waitForDeployment();

  console.log("OPNArcade deployed to:", await arcade.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});