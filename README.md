# OPN Quest Hub

### Gamified DeFi Engagement Layer for the IOPN Ecosystem

OPN Quest Hub is a gamified Web3 engagement platform built on the IOPN Testnet.

The platform transforms on-chain participation into a rewarding experience by combining quests, NFT achievements, staking rewards, referral incentives, and reputation building into a unified ecosystem.

Users can complete quests, earn verifiable on-chain points, unlock achievement NFTs, stake ecosystem assets, participate in DeFi activities, and climb a transparent leaderboard where every reward is earned through activity.

---

## Why OPN Quest Hub?

Many blockchain ecosystems face the same challenge:

* Users join but do not stay active
* Community participation is difficult to measure
* Contributions are rarely rewarded transparently
* Ecosystem engagement lacks incentives

OPN Quest Hub solves these problems by creating an engagement and reward layer for the IOPN ecosystem.

The platform introduces:

* On-chain quests
* NFT achievement progression
* DeFi staking incentives
* Referral-based growth
* Activity rewards
* Public reputation tracking

Every achievement, reward, and milestone is recorded on-chain.

---

## Live Demo

Frontend:

https://opn-points-tracker.vercel.app

GitHub:

https://github.com/builderonhub/opn-quest-hub

---

## Network

* Network: IOPN Testnet
* Chain ID: 984

---

# Builder Contest Highlights

✅ Fully On-Chain Points System

✅ NFT Achievement Progression

✅ DeFi Staking Utilities

✅ Native OPN Integration

✅ Referral Reward System

✅ Activity-Based Incentives

✅ Free-To-Participate Model

✅ MetaMask + OKX Wallet Support

✅ Transparent Public Leaderboard

---

# Architecture

User Activity

↓

Quest Completion

↓

On-Chain Points

↓

NFT Achievement Unlocks

↓

DeFi Staking Benefits

↓

Leaderboard & Reputation Growth

The platform combines gamification and DeFi mechanics to encourage long-term ecosystem participation.

---

# Smart Contracts

## OPN Points Contract

Contract:

0x143538DC00D3C15bE393358Af029D8Ccc6323708

Responsibilities:

* Daily Check-In Rewards
* Quest Rewards
* Activity Rewards
* Referral Rewards
* On-Chain Points Tracking

---

## OPN Reward NFT

Contract:

0xa25f49A2b7ea4F5fB4fDB3B7aDb5ACc03051b535

Responsibilities:

* Bronze NFT
* Silver NFT
* Gold NFT
* Achievement Validation
* NFT Ownership Tracking

NFT eligibility is calculated using:

solidity
totalPoints =
    getPoints(user)
    +
    claimedPoints(user);


---

## OQH Token

Contract:

0xC88Fd59E170e3e27AF12427b1b461A4Dd2337aCd

Features:

* ERC20 Token
* Daily Faucet
* Staking Utility

---

## OQH DeFi Vault

Contract:

0x9eb231B49da7099D1F61FdF07D0e7aB084628ECF

Features:

* Stake OQH
* Earn Rewards
* Withdraw OQH
* NFT Yield Boosts

Current Reward Rate:

* 0.2% per hour

---

## Native OPN Staking

Contract:

0x4f107f185D670C28280972b34291A37bbBf9ca4A

Features:

* Stake Native OPN
* Earn Platform Points
* Claim Points
* Withdraw OPN
* Real-Time Statistics

---

# Features

## Wallet Integration

Supported Wallets:

* MetaMask
* OKX Wallet

Capabilities:

* Automatic Network Detection
* Automatic IOPN Network Switching
* Wallet Address Recognition

---

## On-Chain Points System

All points are stored and verified on-chain.

Point Sources:

* Daily Check-In
* Quests
* Referral Rewards
* Activity Rewards
* OPN Staking Rewards

Functions:

solidity
getPoints(address)


---

## Daily Check-In

Users can check in once every day.

Random Rewards:

* 10 Points
* 20 Points
* 30 Points
* 40 Points
* 50 Points

Functions:

solidity
canCheckIn(address)


---

## Quest System

Current Quests:

* Follow IOPN
* Join Discord
* Share OPN Quest Hub
* Submit Feedback

Features:

* One-Time Completion
* On-Chain Reward Distribution
* Progress Tracking

Functions:

solidity
completeQuest()
hasCompletedQuest()


---

## Activity Milestones

Users earn bonus rewards based on transaction activity.

| Transactions | Reward |
| ------------ | ------ |
| 1            | +1     |
| 10           | +5     |
| 50           | +15    |
| 100          | +30    |
| 500          | +75    |
| 1000         | +150   |
| 2000         | +300   |

Activity tracking uses:

javascript
provider.getTransactionCount(userAddress)


---

## NFT Achievement System

Users unlock achievement NFTs based on total platform participation.

### Bronze NFT

Requirement:

* 100 Points

### Silver NFT

Requirement:

* 500 Points

### Gold NFT

Requirement:

* 1000 Points

Features:

* One-Time Claim
* Permanent Achievement
* On-Chain Ownership
* DeFi Reward Boosts

---

## NFT Utility Boosts

Achievement NFTs provide staking advantages.

### Bronze NFT

+10% Reward Boost

### Silver NFT

+25% Reward Boost

### Gold NFT

+50% Reward Boost

NFT boosts are automatically applied inside the OQH Vault.

---

## OQH Faucet

Users can obtain free OQH tokens for testing and staking.

Features:

* 1000 OQH per claim
* Once per day
* Faucet Eligibility Check
* Testnet Friendly Distribution

---

## OQH DeFi Vault

Stake OQH and earn rewards.

Features:

* Stake OQH
* Claim Rewards
* Withdraw OQH
* NFT Multipliers
* Real-Time Reward Tracking
* Total OQH Staked Dashboard

DeFi Flow:

Claim OQH

↓

Stake OQH

↓

Earn Rewards

↓

Claim Rewards

↓

Withdraw OQH

---

## Native OPN Staking

Users can stake native OPN and earn platform points.

Features:

* Stake OPN
* Claim Points
* Withdraw OPN
* Personal Statistics Dashboard
* Total OPN Staked Dashboard

This mechanism connects ecosystem participation directly with platform progression.

---

## Referral System

Referral rewards are stored on-chain.

Features:

* Invite Friends
* Referral Tracking
* One-Time Referral Claims
* Referrer Point Rewards

Benefits:

* Community Growth
* Organic User Acquisition
* Transparent Reward Distribution

---

## Leaderboard

Current Version:

* Top 20 Users
* Point-Based Ranking
* Real-Time Updates
* User Rank Highlighting

Future Expansion:

* Seasonal Rankings
* Top Stakers
* Top NFT Holders
* Community Competitions

---

## User Dashboard

Displays:

* Wallet Address
* Total Points
* Badge Rank
* NFT Status
* OQH Statistics
* OPN Statistics
* Staking Information

---

# Security

Current Status:

* Testnet MVP
* Not Yet Audited

Security Measures:

* Solidity ^0.8.x Overflow Protection
* OpenZeppelin Standards
* One-Time Quest Claims
* One-Time NFT Claims
* One-Time Referral Claims
* Daily Faucet Limits
* Daily Check-In Limits

Planned Improvements:

* Additional Security Reviews
* Contract Optimization
* Formal Security Audit Before Mainnet

---

# Technology Stack

* Solidity
* Hardhat
* Ethers.js
* Vite
* JavaScript
* HTML
* CSS
* IPFS
* Vercel

---

# Project Structure

frontend/
contracts/
scripts/
artifacts/


---

# Vision

OPN Quest Hub aims to become the engagement and reward layer of the IOPN ecosystem.

By combining quests, NFT achievements, staking incentives, referrals, reputation systems, and DeFi participation, the platform creates a transparent participation economy where ecosystem contributions are rewarded fully on-chain.

The long-term goal is to make user engagement measurable, rewarding, and sustainable across the entire IOPN ecosystem.

---

Built for the IOPN Builder Contest.