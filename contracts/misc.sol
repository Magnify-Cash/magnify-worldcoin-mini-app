// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// World ID interface
interface IWorldID {
    function verifyProof(
        uint256 root,
        uint256 groupId,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external;
}

contract MagnifyWorld is ERC721, Ownable, ReentrancyGuard {
    using ByteHasher for bytes;

    // World ID verification states
    enum VerificationStatus {
        NONE,
        DEVICE,
        ORB
    }

    // World ID related state variables
    IWorldID public immutable worldId;
    uint256 internal immutable externalNullifierHash;
    mapping(uint256 => bool) internal nullifierHashes;
    mapping(address => VerificationStatus) public userVerificationStatus;

    // Existing state variables
    uint256 private _tokenIds;
    IERC20 public immutable loanToken;
    uint256 public tierCount;
    IPermit2 public immutable PERMIT2;

    // Existing mappings
    mapping(uint256 => uint256) public nftToTier;
    mapping(uint256 => Tier) public tiers;
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256) public userNFT;

    // Error declarations
    error InvalidNullifier();
    error AlreadyVerifiedAtHigherLevel();
    error InvalidVerificationLevel();

    // Events
    event VerificationStatusUpdated(
        address indexed user,
        VerificationStatus status
    );

    constructor(
        address _worldId,
        string memory _appId,
        string memory _action,
        address _loanToken,
        address _permit2
    ) ERC721("MagnifyWorld", "MAGWORLD") Ownable(msg.sender) {
        if (_loanToken == address(0)) revert("Invalid token address");
        if (_permit2 == address(0)) revert("Invalid Permit2 address");
        if (_worldId == address(0)) revert("Invalid World ID address");

        worldId = IWorldID(_worldId);
        loanToken = IERC20(_loanToken);
        PERMIT2 = IPermit2(_permit2);

        // Set up World ID external nullifier
        externalNullifierHash = abi
            .encodePacked(abi.encodePacked(_appId).hashToField(), _action)
            .hashToField();

        // Create tiers based on verification status
        // Tier 1: No verification - 1 token, 2.5% interest, 30 days
        tiers[1] = Tier(1 * 1e6, 250, 30 days);
        emit TierAdded(1, 1 * 1e6, 250, 30 days);

        // Tier 2: Device verification - 5 tokens, 2% interest, 60 days
        tiers[2] = Tier(5 * 1e6, 200, 60 days);
        emit TierAdded(2, 5 * 1e6, 200, 60 days);

        // Tier 3: Orb verification - 10 tokens, 1.5% interest, 90 days
        tiers[3] = Tier(10 * 1e6, 150, 90 days);
        emit TierAdded(3, 10 * 1e6, 150, 90 days);

        tierCount = 3;
    }

    /**
     * @dev Verifies World ID proof and mints NFT in one transaction
     * @param root The root of the Merkle tree
     * @param nullifierHash Nullifier hash to prevent double-signaling
     * @param proof The zero-knowledge proof
     * @param groupId The World ID group ID (1 for Orb, 2 for Device)
     */
    function verifyAndMintNFT(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        uint256 groupId
    ) public {
        // Check if user already has an NFT
        if (userNFT[msg.sender] > 0) revert("User already has an NFT");

        // Ensure nullifier hasn't been used
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        // Verify the provided proof
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(msg.sender).hashToField(),
            nullifierHash,
            externalNullifierHash,
            proof
        );

        // Record the nullifier to prevent reuse
        nullifierHashes[nullifierHash] = true;

        // Set verification status and determine tier based on groupId
        uint256 tierId;
        if (groupId == 1) {
            userVerificationStatus[msg.sender] = VerificationStatus.ORB;
            tierId = 3;
        } else if (groupId == 2) {
            userVerificationStatus[msg.sender] = VerificationStatus.DEVICE;
            tierId = 2;
        } else {
            userVerificationStatus[msg.sender] = VerificationStatus.NONE;
            tierId = 1;
        }

        emit VerificationStatusUpdated(
            msg.sender,
            userVerificationStatus[msg.sender]
        );

        // Mint NFT
        _tokenIds++;
        _safeMint(msg.sender, _tokenIds);
        nftToTier[_tokenIds] = tierId;
        userNFT[msg.sender] = _tokenIds;

        emit NFTMinted(_tokenIds, msg.sender, tierId);
    }

    /**
     * @dev Upgrades an NFT's tier based on new World ID verification
     * @param root The root of the Merkle tree
     * @param nullifierHash Nullifier hash to prevent double-signaling
     * @param proof The zero-knowledge proof
     * @param groupId The World ID group ID (1 for Orb, 2 for Device)
     */
    function upgradeNFTWithVerification(
        uint256 root,
        uint256 nullifierHash,
        uint256[8] calldata proof,
        uint256 groupId
    ) public {
        uint256 tokenId = userNFT[msg.sender];
        if (tokenId == 0) revert("No NFT owned");

        // Check current verification status
        VerificationStatus currentStatus = userVerificationStatus[msg.sender];

        // Prevent downgrades and redundant verifications
        if (groupId == 1 && currentStatus == VerificationStatus.ORB) {
            revert("Already Orb verified");
        }
        if (
            groupId == 2 &&
            (currentStatus == VerificationStatus.ORB ||
                currentStatus == VerificationStatus.DEVICE)
        ) {
            revert("Cannot downgrade verification");
        }

        // Ensure nullifier hasn't been used
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        // Verify the provided proof
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked(msg.sender).hashToField(),
            nullifierHash,
            externalNullifierHash,
            proof
        );

        // Record the nullifier to prevent reuse
        nullifierHashes[nullifierHash] = true;

        // Update verification status and tier
        uint256 newTierId;
        if (groupId == 1) {
            userVerificationStatus[msg.sender] = VerificationStatus.ORB;
            newTierId = 3;
        } else if (groupId == 2) {
            userVerificationStatus[msg.sender] = VerificationStatus.DEVICE;
            newTierId = 2;
        } else {
            revert InvalidVerificationLevel();
        }

        emit VerificationStatusUpdated(
            msg.sender,
            userVerificationStatus[msg.sender]
        );

        // Update NFT tier
        nftToTier[tokenId] = newTierId;
        emit NFTUpgraded(tokenId, newTierId, msg.sender);
    }

    // ... [Rest of your existing contract functions remain the same]
}

// ByteHasher library for World ID verification
library ByteHasher {
    function hashToField(bytes memory value) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(value))) >> 8;
    }
}
