const hre = require("hardhat");

async function main() {
  const passportAddress =
    process.env.PASSPORT_ADDRESS;

  const walletAddress =
    process.env.PASSPORT_USER;

  const newScore =
    Number(process.env.PASSPORT_SCORE);

  if (!passportAddress) {
    throw new Error("Missing PASSPORT_ADDRESS");
  }

  if (!walletAddress) {
    throw new Error("Missing PASSPORT_USER");
  }

  if (
    !Number.isInteger(newScore) ||
    newScore < 0 ||
    newScore > 1000
  ) {
    throw new Error(
      "PASSPORT_SCORE must be an integer from 0 to 1000"
    );
  }

  const passport = await hre.ethers.getContractAt(
    "OPNQuestPassport",
    passportAddress
  );

  const tx = await passport.updateTrustScore(
    walletAddress,
    newScore
  );

  console.log("Transaction:", tx.hash);

  await tx.wait();

  console.log(
    `Updated ${walletAddress} to score ${newScore}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});