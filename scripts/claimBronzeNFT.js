const hre = require("hardhat");

async function main() {
  const NFT_ADDRESS = "0xd61AFE6565D70e32Ca5C0f16D15156186E5490A6";

  const [user] = await hre.ethers.getSigners();

  const nft = await hre.ethers.getContractAt("OPNRewardNFT", NFT_ADDRESS);

  console.log("Wallet:", user.address);

  const total = await nft.totalPoints(user.address);
  console.log("Total Points:", total.toString());

  const claimed = await nft.hasClaimedNFT(user.address, 1);
  console.log("Bronze already claimed:", claimed);

  if (claimed) {
    console.log("Bronze already claimed. Skip.");
    return;
  }

  const tx = await nft.claimNFT(1);
  await tx.wait();

  console.log("Bronze NFT claimed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});