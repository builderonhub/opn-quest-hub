const hre = require("hardhat");

async function main() {
  const POINTS_CONTRACT = "0x143538DC00D3C15bE393358Af029D8Ccc6323708";
  const OPN_STAKING = "0x4f107f185D670C28280972b34291A37bbBf9ca4A";

  const OPNRewardNFT = await hre.ethers.getContractFactory("OPNRewardNFT");

  const nft = await OPNRewardNFT.deploy(
    POINTS_CONTRACT,
    OPN_STAKING
  );

  await nft.waitForDeployment();

  console.log("OPNRewardNFT deployed to:", await nft.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});