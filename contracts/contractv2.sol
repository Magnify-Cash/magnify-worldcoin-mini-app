// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ISignatureTransfer {
    struct TokenPermissions {
        address token;
        uint256 amount;
    }

    struct PermitTransferFrom {
        TokenPermissions permitted;
        uint256 nonce;
        uint256 deadline;
    }

    struct SignatureTransferDetails {
        address to;
        uint256 requestedAmount;
    }
}

interface IPermit2 {
    function permitTransferFrom(
        ISignatureTransfer.PermitTransferFrom calldata permit,
        ISignatureTransfer.SignatureTransferDetails calldata transferDetails,
        address owner,
        bytes calldata signature
    ) external;
}

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

library ByteHasher {
    function hashToField(bytes memory value) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(value))) >> 8;
    }
}


/**
 * @title MagnifyWorld
 * @dev A contract for managing NFT-backed loans with different tiers
 * @notice This contract allows users to mint NFTs and use them as collateral for loans
 * @custom:security-contact security@magnifyworld.com
 */
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

    // State Variables
    uint256 private _tokenIds;
    IERC20 public immutable loanToken;
    uint256 public tierCount;
    IPermit2 public immutable PERMIT2;

    // Mappings
    mapping(uint256 => uint256) public nftToTier;
    mapping(uint256 => Tier) public tiers;
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256) public userNFT;

    /**
     * @dev Tier structure defining loan parameters for each tier
     * @param loanAmount The amount that can be borrowed in this tier
     * @param interestRate Interest rate in basis points (1/100th of a percent)
     * @param loanPeriod Duration of the loan in seconds
     */
    struct Tier {
        uint256 loanAmount;
        uint256 interestRate;
        uint256 loanPeriod;
    }

    /**
     * @dev Loan structure containing active loan details
     * @param amount The borrowed amount
     * @param startTime Timestamp when the loan was initiated
     * @param isActive Whether the loan is currently active
     * @param interestRate Interest rate for this specific loan
     * @param loanPeriod Duration of this specific loan
     */
    struct Loan {
        uint256 amount;
        uint256 startTime;
        bool isActive;
        uint256 interestRate;
        uint256 loanPeriod;
    }

    // Events
    event TierAdded(
        uint256 indexed tierId,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 loanPeriod
    );
    event TierUpdated(
        uint256 indexed tierId,
        uint256 newLoanAmount,
        uint256 newInterestRate,
        uint256 newLoanPeriod
    );
    event LoanRequested(
        uint256 indexed tokenId,
        uint256 amount,
        address borrower
    );
    event LoanRepaid(
        uint256 indexed tokenId,
        uint256 repaymentAmount,
        address borrower
    );
    event NFTMinted(uint256 indexed tokenId, address to, uint256 tier);
    event NFTUpgraded(
        uint256 indexed tokenId,
        uint256 newTierId,
        address owner
    );
    event VerificationStatusUpdated(
        address indexed user,
        VerificationStatus status
    );

    // Add World ID related errors
    error InvalidNullifier();
    error AlreadyVerifiedAtHigherLevel();
    error InvalidVerificationLevel();

    /**
     * @dev Constructor to initialize the contract and create default tiers
     * @param _worldId Address of the World ID contract
     * @param _appId App ID for World ID verification
     * @param _action Action for World ID verification
     * @param _loanToken Address of the ERC20 token used for loans
     */
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

        // Create default tiers
        // Tier 1: 1 token, 2.5% interest, 30 days
        tiers[1] = Tier(1 * 1e6, 250, 30 days);
        emit TierAdded(1, 1 * 1e6, 250, 30 days);

        // Tier 2: 5 tokens, 2% interest, 60 days
        tiers[2] = Tier(5 * 1e6, 200, 60 days);
        emit TierAdded(2, 5 * 1e6, 200, 60 days);

        // Tier 3: 10 tokens, 1.5% interest, 90 days
        tiers[3] = Tier(10 * 1e6, 150, 90 days);
        emit TierAdded(3, 10 * 1e6, 150, 90 days);

        // Set initial tier count
        tierCount = 3;
    }

    /**
     * @dev Internal function to validate tier parameters
     * @param loanAmount Amount that can be borrowed
     * @param interestRate Interest rate in basis points
     * @param loanPeriod Loan duration in seconds
     */
    function _checkTier(
        uint256 loanAmount,
        uint256 interestRate,
        uint256 loanPeriod
    ) private pure returns (bool) {
        return loanAmount > 0 && interestRate > 0 && loanPeriod > 0;
    }

    /**
     * @dev Adds a new tier with specified parameters
     * @param loanAmount Amount that can be borrowed in this tier
     * @param interestRate Interest rate in basis points
     * @param loanPeriod Loan duration in seconds
     */
    function addTier(
        uint256 loanAmount,
        uint256 interestRate,
        uint256 loanPeriod
    ) external onlyOwner {
        if (!_checkTier(loanAmount, interestRate, loanPeriod))
            revert("Invalid tier parameters");

        tierCount++;
        tiers[tierCount] = Tier(loanAmount, interestRate, loanPeriod);

        emit TierAdded(tierCount, loanAmount, interestRate, loanPeriod);
    }

    /**
     * @dev Updates an existing tier's parameters
     * @param tierId ID of the tier to update
     * @param newLoanAmount New loan amount
     * @param newInterestRate New interest rate
     * @param newLoanPeriod New loan period
     */
    function updateTier(
        uint256 tierId,
        uint256 newLoanAmount,
        uint256 newInterestRate,
        uint256 newLoanPeriod
    ) external onlyOwner {
        if (tierId > tierCount) revert("Tier does not exist");
        if (!_checkTier(newLoanAmount, newInterestRate, newLoanPeriod))
            revert("Invalid tier parameters");

        tiers[tierId] = Tier(newLoanAmount, newInterestRate, newLoanPeriod);

        emit TierUpdated(tierId, newLoanAmount, newInterestRate, newLoanPeriod);
    }

    /**
     * @dev Mints a new NFT to the specified address with the given tier
     * @param to Address to mint the NFT to
     * @param tierId Tier ID to assign to the NFT
     */
    function mintNFT(address to, uint256 tierId) external onlyOwner {
        if (tierId == 0 || tierId > tierCount)
            revert("Invalid tier parameters");
        if (userNFT[to] > 0) revert("User already has an NFT");

        _tokenIds++;
        _safeMint(to, _tokenIds);
        nftToTier[_tokenIds] = tierId;
        userNFT[to] = _tokenIds;

        emit NFTMinted(_tokenIds, to, tierId);
    }

    /**
     * @dev Upgrades an existing NFT to a new tier
     * @param tokenId ID of the NFT to upgrade
     * @param newTierId New tier ID to assign
     */
    function upgradeNFT(uint256 tokenId, uint256 newTierId) external onlyOwner {
        try this.ownerOf(tokenId) returns (address) {
            // Token exists, proceed
        } catch {
            revert("NFT does not exist");
        }

        if (newTierId == 0 || newTierId > tierCount)
            revert("Invalid tier parameters");

        nftToTier[tokenId] = newTierId;

        emit NFTUpgraded(tokenId, newTierId, ownerOf(tokenId));
    }

    /**
     * @dev Checks if an address owns a specific NFT
     * @param owner Address to check
     * @param tokenId Token ID to verify
     * @return bool True if the address owns the NFT
     */
    function checkOwnership(
        address owner,
        uint256 tokenId
    ) public view returns (bool) {
        return ownerOf(tokenId) == owner;
    }

    /**
     * @dev Override of _update to prevent NFT transfers
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = super._update(to, tokenId, auth);
        if (from != address(0) && to != address(0))
            revert("NFTs cannot be transferred");
        return from;
    }

    /**
     * @dev Allows NFT owner to request a loan based on their tier
     * @notice This function automatically uses the NFT associated with the msg.sender
     */
    function requestLoan() external nonReentrant {
        uint256 tokenId = userNFT[msg.sender];
        if (tokenId == 0) revert("Not NFT owner");
        if (loans[tokenId].isActive) revert("Loan already active");

        uint256 tId = nftToTier[tokenId];
        if (tId == 0 || tId > tierCount) revert("Invalid tier parameters");

        // Check if the tokenId actually exists in the contract
        if (ownerOf(tokenId) != msg.sender) revert("Not NFT owner");

        Tier memory t = tiers[tId];
        if (loanToken.balanceOf(address(this)) < t.loanAmount)
            revert("Insufficient contract balance");

        // Check for potential overflow in loan amount calculation
        uint256 maxLoanAmount = type(uint256).max;
        if (t.loanAmount > maxLoanAmount) revert("Loan amount too high");

        loans[tokenId] = Loan(
            t.loanAmount,
            block.timestamp,
            true,
            t.interestRate,
            t.loanPeriod
        );

        if (!loanToken.transfer(msg.sender, t.loanAmount))
            revert("Transfer failed");

        emit LoanRequested(tokenId, t.loanAmount, msg.sender);
    }

    /**
     * @dev Allows borrower to repay their loan
     * @notice This function automatically uses the NFT associated with the msg.sender
     */
    function repayLoan() external nonReentrant {
        uint256 tokenId = userNFT[msg.sender];
        if (tokenId == 0) revert("Not NFT owner");
        if (!loans[tokenId].isActive) revert("Loan is not active");
        if (msg.sender != ownerOf(tokenId)) revert("Not NFT owner");

        Loan memory loan = loans[tokenId];
        if (block.timestamp > loan.startTime + loan.loanPeriod)
            revert("Loan is expired");

        uint256 interest = (loan.amount * loan.interestRate) / 10000;
        uint256 total = loan.amount + interest;

        if (loanToken.allowance(msg.sender, address(this)) < total)
            revert("Insufficient allowance");
        if (!loanToken.transferFrom(msg.sender, address(this), total))
            revert("Transfer failed");

        loans[tokenId].isActive = false;

        emit LoanRepaid(tokenId, total, msg.sender);
    }

    /**
     * @notice Repays an active loan using Permit2 for token approval
     * @dev Uses Uniswap's Permit2 for gas-efficient token approvals in a single transaction
     * @dev The loan must be active and not expired, and the caller must be the NFT owner
     */
    function repayLoanWithPermit2(
        ISignatureTransfer.PermitTransferFrom calldata permitTransferFrom,
        ISignatureTransfer.SignatureTransferDetails calldata transferDetails,
        bytes calldata signature
    ) external nonReentrant {
        uint256 tokenId = userNFT[msg.sender];
        if (tokenId == 0) revert("Not NFT owner");
        if (!loans[tokenId].isActive) revert("Loan is not active");
        if (msg.sender != ownerOf(tokenId)) revert("Not NFT owner");

        Loan memory loan = loans[tokenId];
        if (block.timestamp > loan.startTime + loan.loanPeriod)
            revert("Loan is expired");

        uint256 interest = (loan.amount * loan.interestRate) / 10000;
        uint256 total = loan.amount + interest;

        // Verify permit parameters
        if (permitTransferFrom.permitted.token != address(loanToken))
            revert("Invalid token");
        if (permitTransferFrom.permitted.amount < total)
            revert("Insufficient permit amount");
        if (transferDetails.requestedAmount != total)
            revert("Invalid requested amount");
        if (transferDetails.to != address(this))
            revert("Invalid transfer recipient");

        // Execute the permit and transfer
        PERMIT2.permitTransferFrom(
            permitTransferFrom,
            transferDetails,
            msg.sender,
            signature
        );

        loans[tokenId].isActive = false;
        emit LoanRepaid(tokenId, total, msg.sender);
    }

    /**
     * @dev Allows owner to withdraw accumulated loan tokens
     */
    function withdrawLoanToken() external onlyOwner {
        uint256 balance = loanToken.balanceOf(address(this));
        if (balance == 0) revert("Contract balance is 0");

        if (!loanToken.transfer(msg.sender, balance)) revert("Transfer failed");
    }

    /**
     * @dev Returns all active loans for a specific address
     * @param wallet Address to check
     * @return uint256[] Array of token IDs with active loans
     */
    function fetchLoansByAddress(
        address wallet
    ) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](_tokenIds);
        uint256 count = 0;

        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (ownerOf(i) == wallet && loans[i].isActive) {
                result[count++] = i;
            }
        }

        uint256[] memory loansForWallet = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            loansForWallet[i] = result[i];
        }

        return loansForWallet;
    }

    /**
     * @dev Returns detailed information about a specific loan
     * @param tokenId ID of the NFT/loan to query
     * @return amountBorrowed The original borrowed amount
     * @return dueDate Timestamp when the loan is due
     * @return totalDue Total amount due including interest
     */
    function fetchLoanInfo(
        uint256 tokenId
    )
        external
        view
        returns (uint256 amountBorrowed, uint256 dueDate, uint256 totalDue)
    {
        if (!loans[tokenId].isActive) revert("Loan is not active");

        Loan memory loan = loans[tokenId];
        return (
            loan.amount,
            loan.startTime + loan.loanPeriod,
            loan.amount + ((loan.amount * loan.interestRate) / 10000)
        );
    }

    // Add the World ID verification functions
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
}

