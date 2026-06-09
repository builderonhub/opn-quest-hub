// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract OPNPoints {
    mapping(address => uint256) public points;
    mapping(address => uint256) public lastCheckInDay;

    event DailyCheckIn(address indexed user, uint256 amount, uint256 day);

    function dailyCheckIn(uint256 amount) public {
        require(
            amount == 10 ||
            amount == 20 ||
            amount == 30 ||
            amount == 40 ||
            amount == 50,
            "Invalid reward"
        );

        uint256 today = block.timestamp / 1 days;

        require(
            lastCheckInDay[msg.sender] < today,
            "Already checked in today"
        );

        lastCheckInDay[msg.sender] = today;
        points[msg.sender] += amount;

        emit DailyCheckIn(msg.sender, amount, today);
    }

    function getPoints(address user) public view returns (uint256) {
        return points[user];
    }

    function canCheckIn(address user) public view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        return lastCheckInDay[user] < today;
    }
}