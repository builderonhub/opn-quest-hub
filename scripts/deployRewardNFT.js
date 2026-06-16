const hre = require("hardhat");

async function main() {
  const POINTS_CONTRACT =
    "0x143538DC00D3C15bE393358Af029D8Ccc6323708";

  const OPN_STAKING =
    "0x4f107f185D670C28280972b34291A37bbBf9ca4A";

  const OQH_TOKEN =
    "0xC88Fd59E170e3e27AF12427b1b461A4Dd2337aCd";

  const OPNRewardNFT =
    await hre.ethers.getContractFactory("OPNRewardNFT");

  console.log("Deploying OPNRewardNFT...");

  const nft = await OPNRewardNFT.deploy(
    POINTS_CONTRACT,
    OPN_STAKING,
    OQH_TOKEN
  );

  console.log(
    "Deploy tx:",
    nft.deploymentTransaction().hash
  );

  await nft.waitForDeployment();

  console.log(
    "OPNRewardNFT deployed to:",
    await nft.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});