const hre = require("hardhat");

async function main() {
  const NFT_ADDRESS = "0xd61AFE6565D70e32Ca5C0f16D15156186E5490A6";

  const [user] = await hre.ethers.getSigners();

  const nft = await hre.ethers.getContractAt("OPNRewardNFT", NFT_ADDRESS);

  const total = await nft.totalPoints(user.address);
  const bronzeClaimed = await nft.hasClaimedNFT(user.address, 1);
  const silverClaimed = await nft.hasClaimedNFT(user.address, 2);
  const goldClaimed = await nft.hasClaimedNFT(user.address, 3);

  console.log("Wallet:", user.address);
  console.log("Total Points:", total.toString());
  console.log("Bronze claimed:", bronzeClaimed);
  console.log("Silver claimed:", silverClaimed);
  console.log("Gold claimed:", goldClaimed);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});