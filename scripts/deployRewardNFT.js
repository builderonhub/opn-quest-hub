const { ethers } = require("hardhat");

async function main() {
  const POINTS_ADDRESS = "0xd8aFD8Ff043a0d2e364E991B9ef2df50d44aFB18";
  const OPN_STAKING_ADDRESS = "0x4f107f185D670C28280972b34291A37bbBf9ca4A";
  const OQH_TOKEN_ADDRESS = "0xC88Fd59E170e3e27AF12427b1b461A4Dd2337aCd";

  const RewardNFT = await ethers.getContractFactory("OPNRewardNFT");

  const rewardNFT = await RewardNFT.deploy(
    POINTS_ADDRESS,
    OPN_STAKING_ADDRESS,
    OQH_TOKEN_ADDRESS
  );

  await rewardNFT.waitForDeployment();

  console.log("Reward NFT V6 deployed to:", await rewardNFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});