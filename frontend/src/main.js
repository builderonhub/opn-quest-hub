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
      <p class="subtitle">Track your on-chain points on IOPN Testnet.</p>

      <button id="connectBtn">Connect Wallet</button>

      <div class="info">
        <p><span>Wallet</span><b id="wallet">Not Connected</b></p>
        <p><span>Points</span><b id="points">0</b></p>
        <p><span>Contract</span><b class="mono">${CONTRACT_ADDRESS}</b></p>
      </div>

      <button id="addBtn">Random Add Points</button>

      <p id="status"></p>
    </div>
  </main>
`;

const connectBtn = document.getElementById("connectBtn");
const addBtn = document.getElementById("addBtn");
const walletText = document.getElementById("wallet");
const pointsText = document.getElementById("points");
const statusText = document.getElementById("status");

let signer;
let contract;
let userAddress;

function randomPoints() {
  const rewards = [10, 20, 30, 40, 50];
  return rewards[Math.floor(Math.random() * rewards.length)];
}

async function switchToIOPN() {
  await window.ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: CHAIN_ID }],
  });
}

connectBtn.onclick = async () => {
  try {
    if (!window.ethereum) {
      alert("Please install MetaMask or OKX Wallet.");
      return;
    }

    statusText.innerText = "Connecting wallet...";

    await switchToIOPN();

    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();
    userAddress = await signer.getAddress();

    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    walletText.innerText =
      userAddress.slice(0, 6) + "..." + userAddress.slice(-4);

    const points = await contract.getPoints(userAddress);
    pointsText.innerText = points.toString();

    connectBtn.innerText = "Connected";
    connectBtn.disabled = true;

    statusText.innerText = "Wallet connected successfully.";
  } catch (error) {
    console.error(error);
    statusText.innerText = "Connection failed. Please check wallet/network.";
  }
};

addBtn.onclick = async () => {
  try {
    if (!contract) {
      alert("Connect wallet first.");
      return;
    }

    const reward = randomPoints();

    addBtn.innerText = "Rolling reward...";
    addBtn.disabled = true;

    statusText.innerText = `You rolled ${reward} points. Waiting for wallet signature...`;

    const tx = await contract.addPoints(reward);

    statusText.innerText = "Transaction sent: " + tx.hash.slice(0, 18) + "...";

    await tx.wait();

    const points = await contract.getPoints(userAddress);
    pointsText.innerText = points.toString();

    statusText.innerText = `Success! +${reward} points added on-chain.`;

    addBtn.innerText = "Random Add Points";
    addBtn.disabled = false;
  } catch (error) {
    console.error(error);
    statusText.innerText = "Transaction failed or rejected.";
    addBtn.innerText = "Random Add Points";
    addBtn.disabled = false;
  }
};