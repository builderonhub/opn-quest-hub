# OPN Quest Hub

### Gamified DeFi Engagement Layer for the IOPN Ecosystem

OPN Quest Hub is a gamified Web3 engagement platform built on the IOPN Testnet.

The platform transforms on-chain participation into a rewarding experience by combining quests, NFT achievements, staking rewards, referral incentives, reputation building, and DeFi participation into a unified ecosystem.

Users can complete quests, earn verifiable on-chain points, unlock achievement NFTs, stake ecosystem assets, participate in DeFi activities, and climb a transparent leaderboard where every reward is earned through activity.

---

# Live Demo

Frontend:

https://opn-points-tracker.vercel.app

GitHub:

https://github.com/builderonhub/opn-quest-hub

---

# Network

* Network: IOPN Testnet
* Chain ID: 984

---

# Why OPN Quest Hub?

Many blockchain ecosystems face the same challenges:

* Users join but do not stay active
* Community participation is difficult to measure
* Contributions are rarely rewarded transparently
* Ecosystem engagement lacks incentives

OPN Quest Hub solves these problems by creating a participation and reward layer for the IOPN ecosystem.

The platform introduces:

* On-chain Quests
* NFT Achievement Progression
* DeFi Staking Incentives
* Referral-Based Growth
* Activity Rewards
* Reputation Tracking
* Token Utility

Every achievement, reward, and milestone is verifiable on-chain.

---

# Builder Contest Highlights

✅ Fully On-Chain Points System

✅ NFT Achievement Progression

✅ NFT Economy V2

✅ OQH Burn Mechanism

✅ Sustainable Token Sink

✅ DeFi Staking Utilities

✅ Native OPN Integration

✅ Referral Reward System

✅ Activity-Based Incentives

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

NFT Eligibility

↓

OQH Burn

↓

NFT Achievement Unlock

↓

DeFi Staking Benefits

↓

Leaderboard & Reputation Growth

The platform combines gamification and DeFi mechanics to encourage long-term ecosystem participation.

---

# Smart Contracts

## OPN Points Contract

Contract:

0xd8aFD8Ff043a0d2e364E991B9ef2df50d44aFB18

Responsibilities:

* Daily Check-In Rewards
* Quest Rewards
* Activity Rewards
* Referral Rewards
* On-Chain Points Tracking

---

## OQH Token

Contract:

0xC88Fd59E170e3e27AF12427b1b461A4Dd2337aCd

Features:

* ERC20 Token
* Daily Faucet
* NFT Mint Utility
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

## OPN Reward NFT

Contract:

0x363Cb9894Ea393d4f5B08640537bcCEfbd090680

Responsibilities:

* Bronze NFT
* Silver NFT
* Gold NFT
* NFT Achievement Validation
* OQH Burn-Based Minting
* NFT Ownership Tracking

NFT eligibility is calculated using:

totalPoints =
getPoints(user)
+
claimedPoints(user)

---

# NFT Economy V2

NFTs are no longer free.

Users must satisfy two requirements:

## Requirement 1 — Participation

Points act as proof of ecosystem contribution.

### Bronze NFT

* 100 Points

### Silver NFT

* 500 Points

### Gold NFT

* 1000 Points

---

## Requirement 2 — OQH Mint Fee

OQH acts as the NFT mint fee.

### Bronze NFT

* 1000 OQH

### Silver NFT

* 5000 OQH

### Gold NFT

* 10000 OQH

---

When an NFT is minted:

* OQH is permanently burned
* NFT is minted to the user
* NFT staking boosts become active

---

# Token Flow

Quest Activity

↓

Earn Points

↓

Stake OQH

↓

Earn OQH

↓

Burn OQH

↓

Mint NFT

↓

Receive Staking Boost

Benefits:

* Creates a permanent OQH token sink
* Reduces inflation pressure
* Connects DeFi participation with NFT progression
* Encourages long-term ecosystem engagement

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

getPoints(address)

---

## Daily Check-In

Users can check in once every day.

7-Day Streak System

Day 1 → 5 Points  
Day 2 → 10 Points  
Day 3 → 15 Points  
Day 4 → 20 Points  
Day 5 → 25 Points  
Day 6 → 30 Points  
Day 7 → 35 Points  

Missing a day resets the streak.


---

## Quest System

Current Quests:

* Follow IOPN
* Join Discord
* Share OPN Quest Hub
* Learn iOPN Project

Features:

* One-Time Completion
* On-Chain Reward Distribution
* Progress Tracking

Functions:

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

---

## Native OPN Staking

Users can stake native OPN and earn platform points.

Features:

* Stake OPN
* Claim Points
* Withdraw OPN
* Personal Statistics Dashboard
* Total OPN Staked Dashboard

This mechanism directly connects ecosystem participation with platform progression.

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
* Wallet Analytics
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
* OQH Burn Validation
* NFT Mint Fee Validation

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

OPN Quest Hub V2 introduces a sustainable token economy where participation, staking, and NFT progression are interconnected through an OQH burn mechanism, creating long-term value for ecosystem participants.

---

Built for the IOPN Builder Contest.
