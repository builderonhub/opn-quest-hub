import { ethers } from "ethers";
import "./passport.css";

const IOPN_RPC =
  "https://testnet-rpc2.iopn.tech";

const IOPN_EXPLORER =
  "https://testnet.iopn.tech";

const IOPN_EXPLORER_API =
  `${IOPN_EXPLORER}/api/v2`;

const PASSPORT_ADDRESS =
  "0xE1ab0048207B3384121E753Ff04B853c70A8E7a0";

  const LEVEL_NFT_ADDRESS =
  "0xb0d3D6EB88262A89bD32a6AbF39e99eCa96Daa19";

const POINTS_ADDRESS =
  "0xd8aFD8Ff043a0d2e364E991B9ef2df50d44aFB18";

const OPN_STAKING_ADDRESS =
  "0x4f107f185D670C28280972b34291A37bbBf9ca4A";

const REWARD_NFT_ADDRESS =
  "0x363Cb9894Ea393d4f5B08640537bcCEfbd090680";

const PASSPORT_ABI = [
  "function passportOf(address wallet) view returns (uint256)",
  "function hasPassport(address wallet) view returns (bool)",
  "function getPassport(address wallet) view returns (uint256 tokenId, uint16 trustScore, uint8 level, uint64 issuedAt, uint64 updatedAt, uint64 displayId, bool active)",
];

const POINTS_ABI = [
  "function getPoints(address user) view returns (uint256)",
  "function getCheckInStreak(address user) view returns (uint256)",
];

const STAKING_ABI = [
  "function claimedPoints(address user) view returns (uint256)",
  "function stakedAmount(address user) view returns (uint256)",
];

const REWARD_NFT_ABI = [
  "function hasClaimedNFT(address user, uint256 tier) view returns (bool)",
];

const PASSPORT_LEVELS = [
  {
    level: 1,
    name: "New Identity",
    minimumScore: 0,
    image: "/levels/level1.png",
  },
  {
    level: 2,
    name: "Verified Wallet",
    minimumScore: 150,
    image: "/levels/level2.png",
  },
  {
    level: 3,
    name: "Explorer",
    minimumScore: 300,
    image: "/levels/level3.png",
  },
  {
    level: 4,
    name: "Active Explorer",
    minimumScore: 450,
    image: "/levels/level4.png",
  },
  {
    level: 5,
    name: "Contributor",
    minimumScore: 550,
    image: "/levels/level5.png",
  },
  {
    level: 6,
    name: "Trusted Contributor",
    minimumScore: 650,
    image: "/levels/level6.png",
  },
  {
    level: 7,
    name: "Network Citizen",
    minimumScore: 750,
    image: "/levels/level7.png",
  },
  {
    level: 8,
    name: "Senior Citizen",
    minimumScore: 830,
    image: "/levels/level8.png",
  },
  {
    level: 9,
    name: "Guardian",
    minimumScore: 900,
    image: "/levels/level9.png",
  },
  {
    level: 10,
    name: "OPN Citizen",
    minimumScore: 980,
    image: "/levels/level10.png",
  },
];

const LEVEL_NAMES = Object.fromEntries(
  PASSPORT_LEVELS.map((item) => [
    item.level,
    item.name,
  ])
);

const app = document.getElementById("passportApp");

app.innerHTML = `
  <main class="passport-page">
    <header class="passport-page-header">
      <button
        id="backToQuestHub"
        class="passport-back-button"
        type="button"
      >
        ← Back to Quest Hub
      </button>

        <div class="passport-header-actions">
        <div class="passport-network-card">
            <span class="passport-network-status">
            <i></i>
            Network Active
            </span>

            <strong>IOPN Testnet</strong>

            <small>Chain ID 984</small>
        </div>
        </div>
    </header>

    <section id="passportLoading" class="passport-state">
      <div class="passport-loader"></div>
      <h1>Loading Passport</h1>
      <p>Reading identity and Quest Hub data from IOPN.</p>
    </section>

    <section
      id="passportError"
      class="passport-state passport-error"
      hidden
    >
      <h1>Passport unavailable</h1>
      <p id="passportErrorMessage">
        Unable to load this Passport.
      </p>

      <button
        type="button"
        onclick="window.location.href='/'"
      >
        Return to Quest Hub
      </button>
    </section>

    <section
      id="passportContent"
      class="passport-content"
      hidden
    >
      <article class="passport-identity-card">
        <div class="passport-card-stars"></div>

        <div class="passport-card-emblem">
          <div class="passport-card-emblem-inner">
            <span>OPN</span>
          </div>
        </div>

        <div class="passport-card-content">
          <p class="passport-card-brand">
            OPN Quest Passport
          </p>

          <div class="passport-card-field">
            <span>Passport ID</span>
            <strong id="passportId">—</strong>
          </div>

          <div class="passport-card-field">
            <span>Identity Level</span>

            <h1 id="passportLevel">
              L1 New Identity
            </h1>
          </div>

          <div class="passport-card-field">
            <span>Trust Score</span>

            <div class="passport-trust-row">
              <strong id="passportTrustScore">0</strong>

              <div class="passport-progress-track">
                <div id="passportProgressFill"></div>
              </div>

              <small>/1000</small>
            </div>
          </div>

          <div class="passport-card-field">
            <span>Quest Points</span>

            <div class="passport-quest-points">
              <strong id="passportQuestPoints">0</strong>
              <small>On-chain progression</small>
            </div>
          </div>

          <div class="passport-card-footer">
            <span id="passportWallet">
              0x0000...0000
            </span>

            <span>
              Soulbound Identity · IOPN Testnet
            </span>
          </div>
        </div>
      </article>

      <section class="passport-information">
        <div class="passport-page-title">
          <div>
            <span>On-chain Identity</span>
            <h2 id="passportOwnerTitle">
              Wallet Passport
            </h2>
          </div>

          <span
            id="passportActiveStatus"
            class="passport-active-status"
          >
            Active
          </span>
        </div>

        <div class="passport-metric-grid">
          <article>
            <span>Wallet Age</span>
            <strong id="walletAge">0 days</strong>
          </article>

          <article>
            <span>Active Days</span>
            <strong id="activeDays">0</strong>
          </article>

          <article>
            <span>Transactions</span>
            <strong id="transactionCount">0</strong>
          </article>

          <article>
            <span>Destinations Used</span>
            <strong id="contractsUsed">0</strong>
          </article>

          <article>
            <span>Gas Spent</span>
            <strong id="gasSpent">0 OPN</strong>
          </article>

          <article>
            <span>Total Volume</span>
            <strong id="totalVolume">0 OPN</strong>
          </article>
        </div>

        <article class="passport-panel">
          <div class="passport-panel-heading">
            <div>
              <span>Trust Score</span>
              <h3>Score Breakdown</h3>
            </div>

            <strong id="breakdownTotal">0 / 1000</strong>
          </div>

          <div class="score-category">
            <div>
              <span>Identity</span>
              <b id="identityScoreText">0 / 250</b>
            </div>

            <div class="score-category-track">
              <i id="identityScoreFill"></i>
            </div>
          </div>

          <div class="score-category">
            <div>
              <span>Activity</span>
              <b id="activityScoreText">0 / 350</b>
            </div>

            <div class="score-category-track">
              <i id="activityScoreFill"></i>
            </div>
          </div>

          <div class="score-category">
            <div>
              <span>Economic</span>
              <b id="economicScoreText">0 / 300</b>
            </div>

            <div class="score-category-track">
              <i id="economicScoreFill"></i>
            </div>
          </div>

          <div class="score-category">
            <div>
              <span>Diversity</span>
              <b id="diversityScoreText">0 / 100</b>
            </div>

            <div class="score-category-track">
              <i id="diversityScoreFill"></i>
            </div>
          </div>
        </article>

        <section class="passport-level-section">
        <div class="passport-level-heading">
            <div>
            <span>Identity Progression</span>
            <h2>Passport Levels</h2>

            <p>
                Your Passport Level is calculated automatically
                from your Trust Score.
            </p>
            </div>

            <div class="passport-current-level-summary">
            <span>Current Level</span>
            <strong id="currentLevelSummary">L1</strong>
            <small id="nextLevelSummary">
                150 points to L2
            </small>
            </div>
        </div>

        <div
            id="passportLevelGrid"
            class="passport-level-grid"
        ></div>
        </section>

        <article class="passport-panel">
          <div class="passport-panel-heading">
            <div>
              <span>Quest Hub</span>
              <h3>Quest Progression</h3>
            </div>
          </div>

          <div class="quest-stat-grid">
            <div>
              <span>Base Quest Points</span>
              <strong id="baseQuestPoints">0</strong>
            </div>

            <div>
              <span>Staking Points</span>
              <strong id="stakingPoints">0</strong>
            </div>

            <div>
              <span>Check-in Streak</span>
              <strong id="checkInStreak">0 days</strong>
            </div>

            <div>
              <span>Native OPN Staked</span>
              <strong id="nativeOPNStaked">0 OPN</strong>
            </div>
          </div>
        </article>

        <article class="passport-panel">
          <div class="passport-panel-heading">
            <div>
              <span>On-chain Achievements</span>
              <h3>Quest Reward NFTs</h3>
            </div>
          </div>

          <div class="passport-achievement-grid">
            <div id="bronzeAchievement">
              <span>Bronze</span>
              <strong>Locked</strong>
              <small>100 Quest Points</small>
            </div>

            <div id="silverAchievement">
              <span>Silver</span>
              <strong>Locked</strong>
              <small>500 Quest Points</small>
            </div>

            <div id="goldAchievement">
              <span>Gold</span>
              <strong>Locked</strong>
              <small>1,000 Quest Points</small>
            </div>
          </div>
        </article>

        <footer class="passport-page-footer">
          <span id="passportIssuedAt">
            Issued —
          </span>

          <a
            id="passportExplorerLink"
            href="#"
            target="_blank"
            rel="noreferrer"
          >
            View contract on Explorer →
          </a>
        </footer>
      </section>
    </section>
  </main>
`;

const provider = new ethers.JsonRpcProvider(IOPN_RPC);

const passportContract = new ethers.Contract(
  PASSPORT_ADDRESS,
  PASSPORT_ABI,
  provider
);

const pointsContract = new ethers.Contract(
  POINTS_ADDRESS,
  POINTS_ABI,
  provider
);

const stakingContract = new ethers.Contract(
  OPN_STAKING_ADDRESS,
  STAKING_ABI,
  provider
);

const rewardNFTContract = new ethers.Contract(
  REWARD_NFT_ADDRESS,
  REWARD_NFT_ABI,
  provider
);
async function readPassport(wallet) {
  const passportInterfaceV7 = new ethers.Interface([
    "function getPassport(address wallet) view returns (uint256 tokenId, uint16 trustScore, uint8 level, uint64 issuedAt, uint64 updatedAt, uint64 displayId, bool active)",
  ]);

  const passportInterfaceV6 = new ethers.Interface([
    "function getPassport(address wallet) view returns (uint256 tokenId, uint16 trustScore, uint8 level, uint64 issuedAt, uint64 updatedAt, bool active)",
  ]);

  const callData =
    passportInterfaceV7.encodeFunctionData(
      "getPassport",
      [wallet]
    );

  const rawResult = await provider.call({
    to: PASSPORT_ADDRESS,
    data: callData,
  });

  try {
    const result =
      passportInterfaceV7.decodeFunctionResult(
        "getPassport",
        rawResult
      );

    return {
      tokenId: Number(result.tokenId),
      trustScore: Number(result.trustScore),
      level: Number(result.level),
      issuedAt: Number(result.issuedAt),
      updatedAt: Number(result.updatedAt),
      displayId: Number(result.displayId),
      active: result.active,
    };
  } catch (error) {
    const result =
      passportInterfaceV6.decodeFunctionResult(
        "getPassport",
        rawResult
      );

    const tokenId = Number(result.tokenId);

    return {
      tokenId,
      trustScore: Number(result.trustScore),
      level: Number(result.level),
      issuedAt: Number(result.issuedAt),
      updatedAt: Number(result.updatedAt),
      displayId: tokenId,
      active: result.active,
    };
  }
}
function setText(id, value) {
  const element = document.getElementById(id);

  if (element) {
    element.innerText = value;
  }
}

function shortWallet(wallet) {
  return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
}

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(value, maximum));
}

function logScore(value, maximumInput, maximumScore) {
  if (!value || value <= 0) {
    return 0;
  }

  const normalized =
    Math.log10(value + 1) /
    Math.log10(maximumInput + 1);

  return Math.pow(normalized, 1.7) * maximumScore;
}

function getPassportLevel(score) {
  if (score >= 980) return 10;
  if (score >= 900) return 9;
  if (score >= 830) return 8;
  if (score >= 750) return 7;
  if (score >= 650) return 6;
  if (score >= 550) return 5;
  if (score >= 450) return 4;
  if (score >= 300) return 3;
  if (score >= 150) return 2;

  return 1;
}
function renderPassportLevels(trustScore) {
  const grid =
    document.getElementById("passportLevelGrid");

  if (!grid) return;

  const currentLevelNumber =
    getPassportLevel(trustScore);

  const nextLevel =
    PASSPORT_LEVELS.find(
      (item) => item.minimumScore > trustScore
    );

  setText(
    "currentLevelSummary",
    `L${currentLevelNumber}`
  );

  if (nextLevel) {
    const pointsNeeded =
      nextLevel.minimumScore - trustScore;

    setText(
      "nextLevelSummary",
      `${pointsNeeded} points to L${nextLevel.level}`
    );
  } else {
    setText(
      "nextLevelSummary",
      "Maximum level reached"
    );
  }

  grid.innerHTML = PASSPORT_LEVELS
    .map((item) => {
      const isCurrent =
        item.level === currentLevelNumber;

      const isAchieved =
        trustScore >= item.minimumScore;

      let stateClass = "locked";
      let stateText =
        `${item.minimumScore - trustScore} points needed`;

      if (isCurrent) {
        stateClass = "current";
        stateText = "Current Level";
      } else if (isAchieved) {
        stateClass = "achieved";
        stateText = "Achieved";
      }

      return `
        <article
          class="passport-level-card ${stateClass}"
        >
          <div class="passport-level-number">
            L${item.level}
          </div>

          <div class="passport-level-image">
            <img
              src="${item.image}"
              alt="${item.name}"
              loading="lazy"
            />
          </div>

          <div class="passport-level-card-content">
            <h3>${item.name}</h3>

            <p>
              ${item.minimumScore.toLocaleString()}
              Trust Score
            </p>

            <div class="passport-level-state">
              ${stateText}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}
async function fetchAllTransactions(wallet) {
  let transactions = [];
  let nextPageParams = null;
  let pageCount = 0;

  const maxPages = 200;

  while (pageCount < maxPages) {
    let url =
      `${IOPN_EXPLORER_API}/addresses/${wallet}/transactions`;

    if (nextPageParams) {
      const params =
        new URLSearchParams(nextPageParams).toString();

      url += `?${params}`;
    }

    const response =
      await fetch(url);

    if (!response.ok) {
      console.warn(
        "Explorer request failed:",
        response.status
      );

      break;
    }

    const data =
      await response.json();

    const items =
      Array.isArray(data.items)
        ? data.items
        : [];

    transactions =
      transactions.concat(items);

    if (!data.next_page_params) {
      break;
    }

    nextPageParams =
      data.next_page_params;

    pageCount++;
  }

  return transactions;
}

async function calculateTrustScore(wallet) {
  const txs =
    await fetchAllTransactions(wallet);

  if (!txs.length) {
    return {
      trustScore: 0,
      level: 1,
      walletAgeDays: 0,
      activeDays: 0,
      transactionCount: 0,
      contractsUsed: 0,
      gasSpent: 0,
      totalVolume: 0,
      identityScore: 0,
      activityScore: 0,
      economicScore: 0,
      diversityScore: 0,
      transactions: [],
    };
  }

  const timestamps = txs
    .map((tx) => tx.timestamp)
    .filter(Boolean)
    .map((timestamp) => new Date(timestamp))
    .filter((date) => !Number.isNaN(date.getTime()));

  if (!timestamps.length) {
    return {
      trustScore: 0,
      level: 1,
      walletAgeDays: 0,
      activeDays: 0,
      transactionCount: 0,
      contractsUsed: 0,
      gasSpent: 0,
      totalVolume: 0,
      identityScore: 0,
      activityScore: 0,
      economicScore: 0,
      diversityScore: 0,
      transactions: txs,
    };
  }

  const firstTxDate =
    new Date(
      Math.min(
        ...timestamps.map((date) => date.getTime())
      )
    );

  const walletAgeDays =
    Math.floor(
      (Date.now() - firstTxDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

  const activeDateSet =
    new Set(
      timestamps.map((date) =>
        date.toISOString().split("T")[0]
      )
    );

  const activeDays =
    activeDateSet.size;

  const transactionCount =
    txs.length;

  const contractSet =
    new Set();

  let gasSpent = 0;
  let totalVolume = 0;

  for (const tx of txs) {
    if (tx.to?.hash) {
      contractSet.add(
        tx.to.hash.toLowerCase()
      );
    }

    if (tx.fee?.value) {
      gasSpent +=
        Number(tx.fee.value) / 1e18;
    }

    if (tx.value) {
      totalVolume +=
        Number(tx.value) / 1e18;
    }
  }

  const contractsUsed =
    contractSet.size;

  const walletAgeScore =
    logScore(walletAgeDays, 365, 180);

  const consistencyScore =
    logScore(activeDays, 180, 70);

  const identityScore =
    clamp(
      Math.round(
        walletAgeScore + consistencyScore
      ),
      0,
      250
    );

  const activeDaysScore =
    logScore(activeDays, 300, 200);

  const transactionScore =
    logScore(transactionCount, 1000, 150);

  const activityScore =
    clamp(
      Math.round(
        activeDaysScore + transactionScore
      ),
      0,
      350
    );

  const volumeScore =
    logScore(totalVolume, 5000, 180);

  const gasScore =
    logScore(gasSpent, 10, 120);

  const economicScore =
    clamp(
      Math.round(volumeScore + gasScore),
      0,
      300
    );

  const diversityScore =
    clamp(
      Math.round(
        logScore(contractsUsed, 60, 100)
      ),
      0,
      100
    );

  const trustScore =
    clamp(
      identityScore +
        activityScore +
        economicScore +
        diversityScore,
      0,
      1000
    );

  return {
    trustScore,
    level: getPassportLevel(trustScore),
    walletAgeDays,
    activeDays,
    transactionCount,
    contractsUsed,
    gasSpent,
    totalVolume,
    identityScore,
    activityScore,
    economicScore,
    diversityScore,
    transactions: txs,
  };
}

function renderAchievement(
  id,
  claimed,
  eligible
) {
  const element = document.getElementById(id);

  if (!element) return;

  const status = element.querySelector("strong");

  element.classList.remove(
    "claimed",
    "eligible",
    "locked"
  );

  if (claimed) {
    element.classList.add("claimed");
    status.innerText = "Claimed";
    return;
  }

  if (eligible) {
    element.classList.add("eligible");
    status.innerText = "Eligible";
    return;
  }

  element.classList.add("locked");
  status.innerText = "Locked";
}

function renderScoreCategory(
  textId,
  fillId,
  score,
  maximum
) {
  setText(textId, `${score} / ${maximum}`);

  const fill = document.getElementById(fillId);

  if (fill) {
    fill.style.width =
      `${Math.min((score / maximum) * 100, 100)}%`;
  }
}
function loadSavedTrustData(wallet) {
  try {
    const raw =
      sessionStorage.getItem(
        "questPassportTrustData"
      );

    if (!raw) return null;

    const saved =
      JSON.parse(raw);

    if (
      !saved.wallet ||
      saved.wallet.toLowerCase() !==
        wallet.toLowerCase()
    ) {
      return null;
    }

    if (
      !saved.savedAt ||
      Date.now() - saved.savedAt > 5 * 60 * 1000
    ) {
      return null;
    }

    return saved.data || null;
  } catch (error) {
    console.warn(
      "Load saved Trust Data failed:",
      error
    );

    return null;
  }
}

async function loadPassportPage() {
  const parameters =
    new URLSearchParams(window.location.search);

  const walletParameter =
    parameters.get("wallet");

  if (
    !walletParameter ||
    !ethers.isAddress(walletParameter)
  ) {
    showError(
      "The Passport URL contains an invalid wallet."
    );
    return;
  }

  const wallet =
    ethers.getAddress(walletParameter);

  try {
    const passport =
      await readPassport(wallet);

    const tokenId =
      Number(passport.tokenId);

    if (tokenId === 0) {
      showError(
        "This wallet has not minted a Passport."
      );
      return;
    }

    const savedTrustData =
      loadSavedTrustData(wallet);

    const [
      trustData,
      baseQuestPointsRaw,
      stakingPointsRaw,
      checkInStreakRaw,
      stakedAmountRaw,
      bronzeClaimed,
      silverClaimed,
      goldClaimed,
    ] = await Promise.all([
      (
        savedTrustData
          ? Promise.resolve(savedTrustData)
          : calculateTrustScore(wallet)
      ).catch((error) => {
        console.warn(
          "Trust Score fallback:",
          error
        );

        const fallbackScore =
          Number(passport.trustScore) || 0;

        return {
          trustScore: fallbackScore,
          level:
            getPassportLevel(
              fallbackScore
            ),
          walletAgeDays: 0,
          activeDays: 0,
          transactionCount: 0,
          contractsUsed: 0,
          gasSpent: 0,
          totalVolume: 0,
          identityScore: 0,
          activityScore: 0,
          economicScore: 0,
          diversityScore: 0,
        };
      }),

      pointsContract.getPoints(wallet),
      stakingContract.claimedPoints(wallet),
      pointsContract.getCheckInStreak(wallet),
      stakingContract.stakedAmount(wallet),

      rewardNFTContract.hasClaimedNFT(
        wallet,
        1
      ),

      rewardNFTContract.hasClaimedNFT(
        wallet,
        2
      ),

      rewardNFTContract.hasClaimedNFT(
        wallet,
        3
      ),
    ]);

    const baseQuestPoints =
      Number(baseQuestPointsRaw);

    const stakingPoints =
      Number(stakingPointsRaw);

    const totalQuestPoints =
      baseQuestPoints + stakingPoints;

    const passportId =
      `OPN-${String(
        passport.displayId ||
        passport.tokenId
      ).padStart(8, "0")}`;

    const levelName =
      LEVEL_NAMES[trustData.level] || "New Identity";

    setText("passportId", passportId);

    setText(
      "passportLevel",
      `L${trustData.level} ${levelName}`
    );

    setText(
      "passportTrustScore",
      trustData.trustScore
    );

    setText(
      "passportQuestPoints",
      totalQuestPoints.toLocaleString()
    );

    setText("passportWallet", shortWallet(wallet));

    setText(
      "passportOwnerTitle",
      `${shortWallet(wallet)} Passport`
    );

    setText(
      "passportActiveStatus",
      passport.active ? "Active" : "Inactive"
    );

    setText(
      "walletAge",
      `${trustData.walletAgeDays} days`
    );

    setText("activeDays", trustData.activeDays);

    setText(
      "transactionCount",
      trustData.transactionCount.toLocaleString()
    );

    setText(
      "contractsUsed",
      trustData.contractsUsed
    );

    setText(
      "gasSpent",
      `${trustData.gasSpent.toFixed(6)} OPN`
    );

    setText(
      "totalVolume",
      `${trustData.totalVolume.toFixed(4)} OPN`
    );

    setText(
      "breakdownTotal",
      `${trustData.trustScore} / 1000`
    );

    setText(
      "baseQuestPoints",
      baseQuestPoints.toLocaleString()
    );

    setText(
      "stakingPoints",
      stakingPoints.toLocaleString()
    );

    setText(
      "checkInStreak",
      `${Number(checkInStreakRaw)} days`
    );

    setText(
      "nativeOPNStaked",
      `${Number(
        ethers.formatEther(stakedAmountRaw)
      ).toLocaleString()} OPN`
    );

    const issuedDate =
      Number(passport.issuedAt) > 0
        ? new Date(
            Number(passport.issuedAt) * 1000
          ).toLocaleDateString()
        : "—";

    setText(
      "passportIssuedAt",
      `Issued ${issuedDate}`
    );

    renderScoreCategory(
      "identityScoreText",
      "identityScoreFill",
      trustData.identityScore,
      250
    );

    renderScoreCategory(
      "activityScoreText",
      "activityScoreFill",
      trustData.activityScore,
      350
    );

    renderScoreCategory(
      "economicScoreText",
      "economicScoreFill",
      trustData.economicScore,
      300
    );

    renderScoreCategory(
      "diversityScoreText",
      "diversityScoreFill",
      trustData.diversityScore,
      100
    );
    renderPassportLevels(trustData.trustScore);
    const progressFill =
      document.getElementById("passportProgressFill");

    if (progressFill) {
      progressFill.style.width =
        `${Math.min(trustData.trustScore / 10, 100)}%`;
    }

    renderAchievement(
      "bronzeAchievement",
      bronzeClaimed,
      totalQuestPoints >= 100
    );

    renderAchievement(
      "silverAchievement",
      silverClaimed,
      totalQuestPoints >= 500
    );

    renderAchievement(
      "goldAchievement",
      goldClaimed,
      totalQuestPoints >= 1000
    );

    const statusElement =
      document.getElementById("passportActiveStatus");

    if (statusElement) {
      statusElement.classList.toggle(
        "inactive",
        !passport.active
      );
    }

    const explorerLink =
      document.getElementById("passportExplorerLink");

    if (explorerLink) {
      explorerLink.href =
        `${IOPN_EXPLORER}/address/${PASSPORT_ADDRESS}`;
    }

    document.getElementById(
      "passportLoading"
    ).hidden = true;

    document.getElementById(
      "passportContent"
    ).hidden = false;
  } catch (error) {
    console.error("Load Passport page failed:", error);

    showError(
      error?.message || "Unable to load Passport data."
    );
  }
}

function showError(message) {
  document.getElementById(
    "passportLoading"
  ).hidden = true;

  document.getElementById(
    "passportContent"
  ).hidden = true;

  document.getElementById(
    "passportError"
  ).hidden = false;

  setText("passportErrorMessage", message);
}

const backToQuestHubButton =
  document.getElementById("backToQuestHub");

if (backToQuestHubButton) {
  backToQuestHubButton.addEventListener(
    "click",
    () => {
      
      sessionStorage.setItem(
        "restoreQuestHubWallet",
        "true"
      );

      window.location.href = "/";
    }
  );
}


loadPassportPage();