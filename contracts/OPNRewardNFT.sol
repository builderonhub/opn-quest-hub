// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IOPNPoints {
    function getPoints(address user) external view returns (uint256);
}

interface IOPNNativeStaking {
    function claimedPoints(address user) external view returns (uint256);
}

contract OPNRewardNFT is ERC1155, Ownable {
    IOPNPoints public pointsContract;
    IOPNNativeStaking public opnStaking;

    mapping(address => mapping(uint256 => bool)) public hasClaimedNFT;

    uint256 public constant BRONZE = 1;
    uint256 public constant SILVER = 2;
    uint256 public constant GOLD = 3;

    constructor(
        address _pointsContract,
        address _opnStaking
    ) ERC1155("") Ownable(msg.sender) {
        pointsContract = IOPNPoints(_pointsContract);
        opnStaking = IOPNNativeStaking(_opnStaking);
    }

    function totalEligiblePoints(address user) public view returns (uint256) {
        uint256 questPoints = pointsContract.getPoints(user);
        uint256 stakingPoints = opnStaking.claimedPoints(user);

        return questPoints + stakingPoints;
    }

    function requiredPoints(uint256 tier) public pure returns (uint256) {
        if (tier == BRONZE) return 100;
        if (tier == SILVER) return 500;
        if (tier == GOLD) return 1000;

        revert("Invalid NFT tier");
    }

    function claimNFT(uint256 tier) external {
        require(tier >= 1 && tier <= 3, "Invalid NFT tier");
        require(!hasClaimedNFT[msg.sender][tier], "Already claimed");

        uint256 totalPoints = totalEligiblePoints(msg.sender);
        uint256 required = requiredPoints(tier);

        require(totalPoints >= required, "Not enough points");

        hasClaimedNFT[msg.sender][tier] = true;
        _mint(msg.sender, tier, 1, "");
    }

    function setPointsContract(address _pointsContract) external onlyOwner {
        pointsContract = IOPNPoints(_pointsContract);
    }

    function setOPNStaking(address _opnStaking) external onlyOwner {
        opnStaking = IOPNNativeStaking(_opnStaking);
    }
}