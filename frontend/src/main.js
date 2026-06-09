import { ethers } from "ethers";
import "./style.css";

const CONTRACT_ADDRESS = "0xD1950036C186CA9F68293e616e0703026269114C";
const CHAIN_ID = "0x3d8";

const ABI = [
  "function addPoints(uint256 amount) public",
  "function getPoints(address user) public view returns(uint256)"
];

document.querySelector("#app").innerHTML = `
  <main class="container">
    <div class="card">
      <p class="badge">IOPN Testnet • Chain ID 984</p>
      <h1>OPN Points Tracker</h1>
      <p class="subtitle">Daily check-in and earn on-chain OPN points.</p>

      <button id="connectBtn">Connect OKX or MetaMask Wallet</button>

      <div class="info">
        <p><span>Wallet</span><b id="wallet">Not Connected</b></p>
        <p><span>Points</span><b id="points">0</b></p>
        <p><span>Badge</span><b id="userBadge">No Badge</b></p>
        <p><span>Contract</span><b class="mono">${CONTRACT_ADDRESS}</b></p>
      </div>

      <button id="checkInBtn">Daily Check-In</button>

      <p id="status"></p>
    </div>
  </main>
`;

const connectBtn = document.getElementById("connectBtn");
const checkInBtn = document.getElementById("checkInBtn");
const walletText = document.getElementById("wallet");
const pointsText = document.getElementById("points");
const userBadge = document.getElementById("userBadge");
const statusText = document.getElementById("status");

let signer;
let contract;
let userAddress;

function randomPoints() {
  const rewards = [10, 20, 30, 40, 50];
  return rewards[Math.floor(Math.random() * rewards.length)];
}

function getBadge(points) {
  if (points >= 1000) return "🥇 Gold Member";
  if (points >= 500) return "🥈 Silver Member";
  if (points >= 100) return "🥉 Bronze Member";
  return "New Explorer";
}

function getTodayKey() {
  const today = new Date().toISOString().slice(0, 10);
  return `opn_last_checkin_${userAddress}_${today}`;
}

function hasCheckedInToday() {
  if (!userAddress) return false;
  return localStorage.getItem(getTodayKey()) === "true";
}

function saveTodayCheckIn() {
  localStorage.setItem(getTodayKey(), "true");
}

function updateCheckInButton() {
  if (!userAddress) {
    checkInBtn.disabled = false;
    checkInBtn.innerText = "Daily Check-In";
    return;
  }

  if (hasCheckedInToday()) {
    checkInBtn.disabled = true;
    checkInBtn.innerText = "Already Checked-In Today";
  } else {
    checkInBtn.disabled = false;
    checkInBtn.innerText = "Daily Check-In";
  }
}

function getWalletProvider() {
  if (window.okxwallet) return window.okxwallet;

  if (window.ethereum && window.ethereum.providers) {
    const okx = window.ethereum.providers.find(
      (p) => p.isOkxWallet || p.isOKExWallet
    );
    if (okx) return okx;

    const metamask = window.ethereum.providers.find(
      (p) => p.isMetaMask
    );
    if (metamask) return metamask;
  }

  if (window.ethereum) return window.ethereum;

  return null;
}

async function switchToIOPN(walletProvider) {
  await walletProvider.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: CHAIN_ID }]
  });
}

async function refreshPoints() {
  const points = await contract.getPoints(userAddress);
  const pointNumber = Number(points);

  pointsText.innerText = pointNumber.toString();
  userBadge.innerText = getBadge(pointNumber);
}

connectBtn.onclick = async () => {
  try {
    const walletProvider = getWalletProvider();

    if (!walletProvider) {
      alert("Please install OKX Wallet or MetaMask.");
      return;
    }

    statusText.innerText = "Connecting wallet...";

    await switchToIOPN(walletProvider);

    const provider = new ethers.BrowserProvider(walletProvider);

    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();
    userAddress = await signer.getAddress();

    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    walletText.innerText =
      userAddress.slice(0, 6) + "..." + userAddress.slice(-4);

    await refreshPoints();

    connectBtn.innerText = "Connected";
    connectBtn.disabled = true;

    updateCheckInButton();

    statusText.innerText = "Wallet connected successfully.";
  } catch (error) {
    console.error(error);
    statusText.innerText = "Connection failed. Please check wallet/network.";
  }
};

checkInBtn.onclick = async () => {
  try {
    if (!contract || !userAddress) {
      alert("Connect wallet first.");
      return;
    }

    if (hasCheckedInToday()) {
      statusText.innerText = "You have already checked in today.";
      updateCheckInButton();
      return;
    }

    const reward = randomPoints();

    checkInBtn.disabled = true;
    checkInBtn.innerText = "Checking in...";

    statusText.innerText =
      `Daily reward: +${reward} points. Waiting for wallet signature...`;

    const tx = await contract.addPoints(reward);

    statusText.innerText =
      "Transaction sent: " + tx.hash.slice(0, 18) + "...";

    await tx.wait();

    saveTodayCheckIn();

    await refreshPoints();

    updateCheckInButton();

    statusText.innerText =
      `Check-in successful! You earned +${reward} points.`;
  } catch (error) {
    console.error(error);
    statusText.innerText = "Check-in failed or rejected.";
    updateCheckInButton();
  }
};