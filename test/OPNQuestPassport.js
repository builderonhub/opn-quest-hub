const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OPNQuestPassport", function () {
  async function deployFixture() {
    const [admin, scorer, user, other] =
      await ethers.getSigners();

    const Factory = await ethers.getContractFactory(
      "OPNQuestPassport"
    );

    const passport = await Factory.deploy(
      admin.address,
      scorer.address,
      "https://example.com/passport/"
    );

    await passport.waitForDeployment();

    const LevelFactory = await ethers.getContractFactory(
      "OPNPassportLevelNFT"
    );

    const levelNFT = await LevelFactory.deploy(
      admin.address,
      await passport.getAddress(),
      "https://example.com/levels/{id}.json"
    );

    await levelNFT.waitForDeployment();

    return {
      passport,
      levelNFT,
      admin,
      scorer,
      user,
      other,
    };
  }

  it("allows one Passport per wallet", async function () {
    const { passport, user } = await deployFixture();

    await passport.connect(user).mintPassport();

    await expect(
      passport.connect(user).mintPassport()
    ).to.be.revertedWith("Passport already exists");

    expect(await passport.passportOf(user.address)).to.equal(1);
  });

  it("blocks Passport transfer", async function () {
    const { passport, user, other } = await deployFixture();

    await passport.connect(user).mintPassport();

    await expect(
      passport
        .connect(user)
        .transferFrom(user.address, other.address, 1)
    ).to.be.revertedWith("Passport is soulbound");
  });

  it("blocks approval", async function () {
    const { passport, user, other } = await deployFixture();

    await passport.connect(user).mintPassport();

    await expect(
      passport.connect(user).approve(other.address, 1)
    ).to.be.revertedWith("Passport approval disabled");
  });

  it("only lets scorer update Trust Score", async function () {
    const { passport, scorer, user, other } =
      await deployFixture();

    await passport.connect(user).mintPassport();

    await expect(
      passport.connect(other).updateTrustScore(user.address, 500)
    ).to.be.reverted;

    await passport
      .connect(scorer)
      .updateTrustScore(user.address, 500);

    const result = await passport.getPassport(user.address);

    expect(result.trustScore).to.equal(500);
    expect(result.level).to.equal(4);
  });

  it("enforces score and sequential Level NFT claims", async function () {
    const { passport, levelNFT, scorer, user } =
      await deployFixture();

    await passport.connect(user).mintPassport();

    await expect(
      levelNFT.connect(user).claimLevel(2)
    ).to.be.revertedWith("Trust Score too low");

    await passport
      .connect(scorer)
      .updateTrustScore(user.address, 200);

    await expect(
      levelNFT.connect(user).claimLevel(2)
    ).to.be.revertedWith("Claim previous level first");

    await levelNFT.connect(user).claimLevel(1);
    await levelNFT.connect(user).claimLevel(2);

    expect(
      await levelNFT.hasClaimedLevel(user.address, 1)
    ).to.equal(true);

    expect(
      await levelNFT.hasClaimedLevel(user.address, 2)
    ).to.equal(true);

    await expect(
      levelNFT.connect(user).claimLevel(3)
    ).to.be.revertedWith("Trust Score too low");
  });

  it("rejects scores above 1000", async function () {
    const { passport, scorer, user } = await deployFixture();

    await passport.connect(user).mintPassport();

    await expect(
      passport
        .connect(scorer)
        .updateTrustScore(user.address, 1001)
    ).to.be.revertedWith("Score exceeds maximum");
  });
});
