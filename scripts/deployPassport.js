const hre = require("hardhat");

async function main() {
  const [deployer] =
    await hre.ethers.getSigners();

  console.log("Deployer:", deployer.address);

  const Passport =
    await hre.ethers.getContractFactory(
      "OPNQuestPassport"
    );

  const passport = await Passport.deploy(
    deployer.address,
    deployer.address,
    ""
  );

  await passport.waitForDeployment();

  const passportAddress =
    await passport.getAddress();

  console.log(
    "OPNQuestPassport:",
    passportAddress
  );

  const LevelNFT =
    await hre.ethers.getContractFactory(
      "OPNPassportLevelNFT"
    );

  const levelNFT = await LevelNFT.deploy(
    deployer.address,
    passportAddress,
    ""
  );

  await levelNFT.waitForDeployment();

  const levelNFTAddress =
    await levelNFT.getAddress();

  console.log(
    "OPNPassportLevelNFT:",
    levelNFTAddress
  );

  console.log("");
  console.log("Deployment completed");
  console.log("Passport:", passportAddress);
  console.log("Level NFT:", levelNFTAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});