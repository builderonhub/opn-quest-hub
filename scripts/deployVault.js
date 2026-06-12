const hre = require("hardhat");

async function main() {
  const OQH_TOKEN_ADDRESS = "0xC88Fd59E170e3e27AF12427b1b461A4Dd2337aCd";
  const OPN_POINTS_ADDRESS = "0x45C277439298AAF0952bC92236C78Aa138313a51";

  const Vault = await ethers.getContractFactory("OQHVault");

  const vault = await Vault.deploy(
    OQH_TOKEN_ADDRESS,
    OPN_POINTS_ADDRESS
  );

  await vault.waitForDeployment();

  console.log(
    "OPNStakingVault deployed to:",
    await vault.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});