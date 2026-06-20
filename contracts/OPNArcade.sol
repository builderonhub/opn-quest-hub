// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IOQHToken {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract OPNArcade {
    IOQHToken public oqhToken;

    uint256 public constant TICKET_PRICE = 100 * 10 ** 18;

    uint256 public totalOQHBurned;
    uint256 public totalTicketsSold;

    mapping(address => uint256) public tickets;
    mapping(address => uint256) public lastFreePlayDay;
    mapping(address => uint256) public totalTicketsBought;
    mapping(address => uint256) public totalGamesPlayed;

    event TicketBought(address indexed user, uint256 amount, uint256 price);
    event TicketConsumed(address indexed user);
    event FreePlayUsed(address indexed user);

    constructor(address _oqhToken) {
        oqhToken = IOQHToken(_oqhToken);
    }

    function buyTicket() external {
        require(
            oqhToken.transferFrom(msg.sender, address(0xdead), TICKET_PRICE),
            "OQH burn failed"
        );

        tickets[msg.sender] += 1;
        totalTicketsBought[msg.sender] += 1;
        totalTicketsSold += 1;
        totalOQHBurned += TICKET_PRICE;

        emit TicketBought(msg.sender, 1, TICKET_PRICE);
    }

    function canUseFreePlay(address user) public view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        return lastFreePlayDay[user] < today;
    }

    function useFreePlay() external {
        require(canUseFreePlay(msg.sender), "Free play already used today");

        uint256 today = block.timestamp / 1 days;
        lastFreePlayDay[msg.sender] = today;
        totalGamesPlayed[msg.sender] += 1;

        emit FreePlayUsed(msg.sender);
    }

    function consumeTicket() external {
        require(tickets[msg.sender] > 0, "No ticket available");

        tickets[msg.sender] -= 1;
        totalGamesPlayed[msg.sender] += 1;

        emit TicketConsumed(msg.sender);
    }

    function ticketBalance(address user) external view returns (uint256) {
        return tickets[user];
    }
}