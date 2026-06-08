import { ethers } from "ethers";

const CONTRACT_ADDRESS =
  "0xdd4Fc486f3D40D5a0F63CB5dE83a4e46609482B1";

const ABI = [
  "function addPoints(uint256 amount) public",
  "function getPoints(address user) public view returns(uint256)"
];

document.querySelector("#app").innerHTML = `
  <h1>OPN Points Tracker</h1>

  <button id="connectBtn">
    Connect Wallet
  </button>

  <p id="wallet">
    Not Connected
  </p>

  <p id="points">
    Points: 0
  </p>

  <button id="addBtn">
    Add 10 Points
  </button>
`;

const connectBtn = document.getElementById("connectBtn");
const addBtn = document.getElementById("addBtn");

const walletText = document.getElementById("wallet");
const pointsText = document.getElementById("points");

let signer;
let contract;
let userAddress;

connectBtn.onclick = async () => {

  const provider = new ethers.BrowserProvider(
    window.ethereum
  );

  await provider.send("eth_requestAccounts", []);

  signer = await provider.getSigner();

  userAddress = await signer.getAddress();

  contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    ABI,
    signer
  );

  walletText.innerText =
    "Connected: " + userAddress;

  const points =
    await contract.getPoints(userAddress);

  pointsText.innerText =
    "Points: " + points.toString();
};

addBtn.onclick = async () => {

  const tx =
    await contract.addPoints(10);

  await tx.wait();

  const points =
    await contract.getPoints(userAddress);

  pointsText.innerText =
    "Points: " + points.toString();
};