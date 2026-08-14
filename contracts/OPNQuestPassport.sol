// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract OPNQuestPassport is ERC721, AccessControl {
    using Strings for uint256;

    bytes32 public constant SCORER_ROLE =
        keccak256("SCORER_ROLE");

    uint256 public constant MAX_SCORE = 1000;

    uint256 public nextTokenId = 1;

    string private baseTokenURI;

    struct PassportData {
        uint16 trustScore;
        uint8 level;
        uint64 issuedAt;
        uint64 updatedAt;
        uint64 displayId;
        bool active;
    }

    mapping(address => uint256) public passportOf;

    mapping(uint256 => PassportData)
        private passportData;

    mapping(uint64 => bool) public displayIdUsed;

    event PassportMinted(
        address indexed wallet,
        uint256 indexed tokenId,
        uint64 indexed displayId,
        uint256 issuedAt
    );

    event TrustScoreUpdated(
        address indexed wallet,
        uint256 indexed tokenId,
        uint256 previousScore,
        uint256 newScore,
        uint8 newLevel,
        uint256 updatedAt
    );

    event PassportStatusChanged(
        address indexed wallet,
        uint256 indexed tokenId,
        bool active
    );

    event BaseURIUpdated(string newBaseURI);

    constructor(
        address admin,
        address scorer,
        string memory initialBaseURI
    ) ERC721("OPN Quest Passport", "OQPASS") {
        require(admin != address(0), "Invalid admin");
        require(scorer != address(0), "Invalid scorer");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(SCORER_ROLE, scorer);

        baseTokenURI = initialBaseURI;
    }

    function mintPassport()
        external
        returns (
            uint256 tokenId,
            uint64 displayId
        )
    {
        require(
            passportOf[msg.sender] == 0,
            "Passport already exists"
        );

        tokenId = nextTokenId;
        nextTokenId++;

        displayId = _generateUniqueDisplayId(
            msg.sender,
            tokenId
        );

        passportOf[msg.sender] = tokenId;
        displayIdUsed[displayId] = true;

        passportData[tokenId] = PassportData({
            trustScore: 0,
            level: 1,
            issuedAt: uint64(block.timestamp),
            updatedAt: uint64(block.timestamp),
            displayId: displayId,
            active: true
        });

        _safeMint(msg.sender, tokenId);

        emit PassportMinted(
            msg.sender,
            tokenId,
            displayId,
            block.timestamp
        );
    }

    /**
     * Display ID có 8 chữ số:
     * OPN-12345678
     *
     * Mapping displayIdUsed đảm bảo không trùng
     * trong contract này.
     */
    function _generateUniqueDisplayId(
        address wallet,
        uint256 tokenId
    ) internal view returns (uint64) {
        uint256 nonce = 0;

        while (true) {
            uint256 randomValue = uint256(
                keccak256(
                    abi.encodePacked(
                        block.prevrandao,
                        block.timestamp,
                        blockhash(block.number - 1),
                        wallet,
                        tokenId,
                        nonce,
                        address(this)
                    )
                )
            );

            uint64 candidate = uint64(
                (randomValue % 90_000_000) +
                10_000_000
            );

            if (!displayIdUsed[candidate]) {
                return candidate;
            }

            nonce++;
        }

        revert("Unable to generate display ID");
    }

    function updateTrustScore(
        address wallet,
        uint16 newScore
    ) external onlyRole(SCORER_ROLE) {
        require(
            newScore <= MAX_SCORE,
            "Score exceeds maximum"
        );

        uint256 tokenId = passportOf[wallet];

        require(
            tokenId != 0,
            "Passport does not exist"
        );

        PassportData storage data =
            passportData[tokenId];

        require(data.active, "Passport is inactive");

        uint256 previousScore = data.trustScore;
        uint8 newLevel = calculateLevel(newScore);

        data.trustScore = newScore;
        data.level = newLevel;
        data.updatedAt = uint64(block.timestamp);

        emit TrustScoreUpdated(
            wallet,
            tokenId,
            previousScore,
            newScore,
            newLevel,
            block.timestamp
        );
    }

    function calculateLevel(
        uint256 score
    ) public pure returns (uint8) {
        require(
            score <= MAX_SCORE,
            "Score exceeds maximum"
        );

        if (score >= 980) return 10;
        if (score >= 900) return 9;
        if (score >= 830) return 8;
        if (score >= 750) return 7;
        if (score >= 650) return 6;
        if (score >= 550) return 5;
        if (score >= 450) return 4;
        if (score >= 300) return 3;
        if (score >= 150) return 2;

        return 1;
    }

    function hasPassport(
        address wallet
    ) external view returns (bool) {
        uint256 tokenId = passportOf[wallet];

        return
            tokenId != 0 &&
            passportData[tokenId].active &&
            ownerOf(tokenId) == wallet;
    }

    function getPassport(
        address wallet
    )
        external
        view
        returns (
            uint256 tokenId,
            uint16 trustScore,
            uint8 level,
            uint64 issuedAt,
            uint64 updatedAt,
            uint64 displayId,
            bool active
        )
    {
        tokenId = passportOf[wallet];

        if (tokenId == 0) {
            return (0, 0, 0, 0, 0, 0, false);
        }

        PassportData memory data =
            passportData[tokenId];

        return (
            tokenId,
            data.trustScore,
            data.level,
            data.issuedAt,
            data.updatedAt,
            data.displayId,
            data.active
        );
    }

    function getTrustScore(
        address wallet
    ) external view returns (uint16) {
        uint256 tokenId = passportOf[wallet];

        if (tokenId == 0) {
            return 0;
        }

        return passportData[tokenId].trustScore;
    }

    function getPassportDisplayId(
        address wallet
    ) external view returns (uint64) {
        uint256 tokenId = passportOf[wallet];

        if (tokenId == 0) {
            return 0;
        }

        return passportData[tokenId].displayId;
    }

    function setPassportActive(
        address wallet,
        bool active
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 tokenId = passportOf[wallet];

        require(
            tokenId != 0,
            "Passport does not exist"
        );

        passportData[tokenId].active = active;
        passportData[tokenId].updatedAt =
            uint64(block.timestamp);

        emit PassportStatusChanged(
            wallet,
            tokenId,
            active
        );
    }

    function setBaseURI(
        string calldata newBaseURI
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseTokenURI = newBaseURI;

        emit BaseURIUpdated(newBaseURI);
    }

    function _baseURI()
        internal
        view
        override
        returns (string memory)
    {
        return baseTokenURI;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override {
        require(
            from == address(0) ||
                to == address(0),
            "Passport is soulbound"
        );

        super._beforeTokenTransfer(
            from,
            to,
            firstTokenId,
            batchSize
        );
    }

    function approve(
        address,
        uint256
    ) public pure override {
        revert("Passport approval disabled");
    }

    function setApprovalForAll(
        address,
        bool
    ) public pure override {
        revert("Passport approval disabled");
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

interface IOPNQuestPassportLevelSource {
    function hasPassport(
        address wallet
    ) external view returns (bool);

    function getTrustScore(
        address wallet
    ) external view returns (uint16);
}

contract OPNPassportLevelNFT is
    ERC1155,
    AccessControl
{
    bytes32 public constant URI_MANAGER_ROLE =
        keccak256("URI_MANAGER_ROLE");

    IOPNQuestPassportLevelSource
        public immutable passport;

    mapping(uint256 => uint256)
        public requiredTrustScore;

    event LevelClaimed(
        address indexed wallet,
        uint256 indexed level,
        uint256 trustScore
    );

    event MetadataURIUpdated(string newURI);

    constructor(
        address admin,
        address passportAddress,
        string memory metadataURI
    ) ERC1155(metadataURI) {
        require(admin != address(0), "Invalid admin");

        require(
            passportAddress != address(0),
            "Invalid Passport"
        );

        passport =
            IOPNQuestPassportLevelSource(
                passportAddress
            );

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(URI_MANAGER_ROLE, admin);

        requiredTrustScore[1] = 0;
        requiredTrustScore[2] = 150;
        requiredTrustScore[3] = 300;
        requiredTrustScore[4] = 450;
        requiredTrustScore[5] = 550;
        requiredTrustScore[6] = 650;
        requiredTrustScore[7] = 750;
        requiredTrustScore[8] = 830;
        requiredTrustScore[9] = 900;
        requiredTrustScore[10] = 980;
    }

    function claimLevel(uint256 level) external {
        require(
            level >= 1 && level <= 10,
            "Invalid level"
        );

        require(
            passport.hasPassport(msg.sender),
            "Passport required"
        );

        require(
            balanceOf(msg.sender, level) == 0,
            "Level already claimed"
        );

        uint256 trustScore =
            passport.getTrustScore(msg.sender);

        require(
            trustScore >= requiredTrustScore[level],
            "Trust Score too low"
        );

        if (level > 1) {
            require(
                balanceOf(
                    msg.sender,
                    level - 1
                ) > 0,
                "Claim previous level first"
            );
        }

        _mint(msg.sender, level, 1, "");

        emit LevelClaimed(
            msg.sender,
            level,
            trustScore
        );
    }

    function hasClaimedLevel(
        address wallet,
        uint256 level
    ) external view returns (bool) {
        if (level < 1 || level > 10) {
            return false;
        }

        return balanceOf(wallet, level) > 0;
    }

    function canClaimLevel(
        address wallet,
        uint256 level
    ) external view returns (bool) {
        if (level < 1 || level > 10) {
            return false;
        }

        if (!passport.hasPassport(wallet)) {
            return false;
        }

        if (balanceOf(wallet, level) > 0) {
            return false;
        }

        if (
            passport.getTrustScore(wallet) <
            requiredTrustScore[level]
        ) {
            return false;
        }

        if (
            level > 1 &&
            balanceOf(wallet, level - 1) == 0
        ) {
            return false;
        }

        return true;
    }

    function nextClaimableLevel(
        address wallet
    ) external view returns (uint256) {
        for (
            uint256 level = 1;
            level <= 10;
            level++
        ) {
            if (balanceOf(wallet, level) == 0) {
                return level;
            }
        }

        return 0;
    }

    function setURI(
        string calldata newURI
    ) external onlyRole(URI_MANAGER_ROLE) {
        _setURI(newURI);

        emit MetadataURIUpdated(newURI);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        require(
            from == address(0) ||
                to == address(0),
            "Level NFT is soulbound"
        );

        super._beforeTokenTransfer(
            operator,
            from,
            to,
            ids,
            amounts,
            data
        );
    }

    function setApprovalForAll(
        address,
        bool
    ) public pure override {
        revert("Level NFT approval disabled");
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}