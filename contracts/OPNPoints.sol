// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract OPNPoints is ERC721 {
    mapping(address => uint256) public points;
    mapping(address => uint256) public lastCheckInDay;
    mapping(address => uint256) public checkInStreak;
    mapping(address => mapping(uint256 => bool)) public completedQuests;
    mapping(address => mapping(uint256 => bool)) public claimedNFT;

    mapping(uint256 => uint256) public tokenTier;
    
    mapping(address => address) public referrerOf;
    mapping(address => bool) public hasClaimedReferral;

    uint256 public constant REFERRAL_REWARD = 100;

    uint256 public nextTokenId = 1;

    string public constant BRONZE_URI =
        "ipfs://bafybeievscabqzzk7cyu5r7djjfyn3465jjhvd6hf7fqhc275womva7lpi/bronze.json";

    string public constant SILVER_URI =
        "ipfs://bafybeievscabqzzk7cyu5r7djjfyn3465jjhvd6hf7fqhc275womva7lpi/silver.json";

    string public constant GOLD_URI =
        "ipfs://bafybeievscabqzzk7cyu5r7djjfyn3465jjhvd6hf7fqhc275womva7lpi/gold.json";

    event DailyCheckIn(address indexed user, uint256 amount, uint256 day);
    event QuestCompleted(address indexed user, uint256 questId, uint256 reward);
    event NFTClaimed(address indexed user, uint256 tier, uint256 tokenId);

    constructor() ERC721("OPN Quest Badge", "OPNB") {}

    function dailyCheckIn() public {
        uint256 today = block.timestamp / 1 days;

        require(
            lastCheckInDay[msg.sender] < today,
            "Already checked in today"
        );

        uint256 streak;

        if (lastCheckInDay[msg.sender] + 1 == today) {
            streak = checkInStreak[msg.sender] + 1;
        } else {
            streak = 1;
        }

        if (streak > 7) {
            streak = 1;
        }

        uint256 reward = streak * 5;

        checkInStreak[msg.sender] = streak;
        lastCheckInDay[msg.sender] = today;
        points[msg.sender] += reward;

        emit DailyCheckIn(msg.sender, reward, today);
    }

    function completeQuest(uint256 questId, uint256 reward) public {
        require(!completedQuests[msg.sender][questId], "Quest already completed");

        completedQuests[msg.sender][questId] = true;
        points[msg.sender] += reward;

        emit QuestCompleted(msg.sender, questId, reward);
    }

    function claimNFT(uint256 tier) public {
        if (tier == 1) {
            require(points[msg.sender] >= 100, "Need 100 points");
        } else if (tier == 2) {
            require(points[msg.sender] >= 500, "Need 500 points");
        } else if (tier == 3) {
            require(points[msg.sender] >= 1000, "Need 1000 points");
        } else {
            revert("Invalid tier");
        }

        require(!claimedNFT[msg.sender][tier], "Already claimed");

        uint256 tokenId = nextTokenId;
        claimedNFT[msg.sender][tier] = true;
        tokenTier[tokenId] = tier;
        nextTokenId++;

        _safeMint(msg.sender, tokenId);

        emit NFTClaimed(msg.sender, tier, tokenId);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        uint256 tier = tokenTier[tokenId];

        if (tier == 1) {
            return BRONZE_URI;
        } else if (tier == 2) {
            return SILVER_URI;
        } else if (tier == 3) {
            return GOLD_URI;
        } else {
            revert("Invalid token tier");
        }
    }

    function getPoints(address user) public view returns (uint256) {
        return points[user];
    }

    function canCheckIn(address user) public view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        return lastCheckInDay[user] < today;
    }

    function hasCompletedQuest(address user, uint256 questId) public view returns (bool) {
        return completedQuests[user][questId];
    }

    function hasClaimedNFT(address user, uint256 tier) public view returns (bool) {
        return claimedNFT[user][tier];
    }


    function claimReferral(address referrer) public {
        require(referrer != address(0), "Invalid referrer");
        require(referrer != msg.sender, "Cannot refer yourself");
        require(!hasClaimedReferral[msg.sender], "Referral already claimed");

        hasClaimedReferral[msg.sender] = true;
        referrerOf[msg.sender] = referrer;

        points[referrer] += REFERRAL_REWARD;
    }

    function getTodayCheckInReward(address user) public view returns (uint256) {
    uint256 today = block.timestamp / 1 days;

        if (lastCheckInDay[user] >= today) {
            return 0;
        }

        uint256 streak;

        if (lastCheckInDay[user] + 1 == today) {
            streak = checkInStreak[user] + 1;
        } else {
            streak = 1;
        }

        if (streak > 7) {
            streak = 1;
        }

            return streak * 5;
    }

    function getCheckInStreak(address user) public view returns (uint256) {
        uint256 today = block.timestamp / 1 days;

        if (lastCheckInDay[user] + 1 < today) {
            return 0;
        }

        return checkInStreak[user];
    }
}

