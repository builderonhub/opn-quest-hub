// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IOPNPoints {
    function getPoints(address user) external view returns (uint256);
}

interface IOPNNativeStaking {
    function claimedPoints(address user) external view returns (uint256);
}

contract OPNRewardNFT is ERC721 {
    IOPNPoints public pointsContract;
    IOPNNativeStaking public opnStaking;

    address public owner;
    uint256 public nextTokenId = 1;

    mapping(address => mapping(uint256 => bool)) public hasClaimedTier;
    mapping(uint256 => uint256) public requiredPoints;

    constructor(
        address _pointsContract,
        address _opnStaking
    ) ERC721("OPN Quest Reward NFT", "OQRN") {
        owner = msg.sender;

        pointsContract = IOPNPoints(_pointsContract);
        opnStaking = IOPNNativeStaking(_opnStaking);

        requiredPoints[1] = 100;
        requiredPoints[2] = 500;
        requiredPoints[3] = 1000;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function totalPoints(address user) public view returns (uint256) {
        return pointsContract.getPoints(user) + opnStaking.claimedPoints(user);
    }

    function claimNFT(uint256 tier) external {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        require(!hasClaimedTier[msg.sender][tier], "Already claimed");
        require(totalPoints(msg.sender) >= requiredPoints[tier], "Not enough points");

        hasClaimedTier[msg.sender][tier] = true;

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        _safeMint(msg.sender, tokenId);
    }

    function hasClaimedNFT(address user, uint256 tier) external view returns (bool) {
        return hasClaimedTier[user][tier];
    }

    function setRequiredPoints(uint256 tier, uint256 amount) external onlyOwner {
        require(tier >= 1 && tier <= 3, "Invalid tier");
        requiredPoints[tier] = amount;
    }
}