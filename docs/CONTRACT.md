# MagnifyWorld Smart Contract

## Overview

MagnifyWorld is an Ethereum smart contract for managing NFT-backed loans. Users mint NFTs, which represent tiers of borrowing power, and use them as collateral to borrow ERC20 tokens. The contract prevents NFT transfers, ensuring that NFTs remain tied to their respective loans. Loans are repaid with interest, enabling a tier-based lending ecosystem.

---

## Key Features

1. **NFT Minting:** Users can mint NFTs linked to specific borrowing tiers.
2. **Tier System:** Loan parameters (amount, interest rate, and period) are determined by the NFT's tier.
3. **Loan Management:** Borrowers can request loans and repay them (with or without Permit2 approval).
4. **Reentrancy Protection:** All critical operations are protected by the `nonReentrant` modifier.
5. **Permit2 Integration:** Allows gas-efficient repayment with off-chain signature approvals.
6. **Administrative Control:** Only the owner can define or modify tiers, mint NFTs, and withdraw tokens.
7. **No Transferability:** NFTs cannot be transferred, ensuring collateral integrity.

---

## Components

### State Variables

- **`_tokenIds`:** Tracks the total number of NFTs minted.
- **`loanToken`:** The ERC20 token used for loans.
- **`tierCount`:** The number of tiers available.
- **`PERMIT2`:** Address of the Uniswap Permit2 contract.

### Structures

- **`Tier`:** Defines loan parameters:
  - `loanAmount`: Maximum borrowing amount.
  - `interestRate`: Interest rate in basis points.
  - `loanPeriod`: Loan duration in seconds.
- **`Loan`:** Stores active loan details:
  - `amount`: Borrowed amount.
  - `startTime`: Timestamp of loan initiation.
  - `isActive`: Loan status.
  - `interestRate`: Interest rate for the loan.
  - `loanPeriod`: Loan duration.

### Mappings

- **`nftToTier`:** Maps NFT IDs to their assigned tier.
- **`tiers`:** Stores tier configurations.
- **`loans`:** Stores active loan details by NFT ID.
- **`userNFT`:** Maps user addresses to their NFT IDs.

---

## Functions

### Administrative

#### `addTier`

Adds a new tier with specified loan parameters. Only callable by the owner.

- **Input:** Loan amount, interest rate, loan period.
- **Constraints:** All parameters must be greater than zero.
- **Event:** `TierAdded`.

#### `updateTier`

Updates parameters of an existing tier. Only callable by the owner.

- **Input:** Tier ID, new loan amount, new interest rate, new loan period.
- **Constraints:** Tier ID must exist.
- **Event:** `TierUpdated`.

#### `withdrawLoanToken`

Withdraws all ERC20 tokens from the contract to the owner’s address.

- **Constraints:** Contract balance must be greater than zero.

### User

#### `mintNFT`

Mints an NFT linked to a specified tier for a user.

- **Input:** Recipient address, tier ID.
- **Constraints:** User can own only one NFT. Tier ID must exist.
- **Event:** `NFTMinted`.

#### `upgradeNFT`

Upgrades an NFT to a higher tier.

- **Input:** Token ID, new tier ID.
- **Constraints:** Token ID and new tier ID must exist.
- **Event:** `NFTUpgraded`.

#### `requestLoan`

Requests a loan based on the user’s NFT tier.

- **Constraints:**
  - User must own an NFT.
  - Loan must not already be active.
  - Contract balance must be sufficient.
- **Event:** `LoanRequested`.

#### `repayLoan`

Repays an active loan with interest.

- **Constraints:**
  - Loan must be active.
  - Loan period must not have expired.
  - User must have sufficient ERC20 token allowance.
- **Event:** `LoanRepaid`.

#### `repayLoanWithPermit2`

Repays a loan using Uniswap’s Permit2 for gas-efficient token transfers.

- **Input:** Permit transfer data, transfer details, signature.
- **Constraints:**
  - Loan must be active.
  - Permit parameters must match loan requirements.
- **Event:** `LoanRepaid`.

#### `fetchLoansByAddress`

Fetches active loans for a given address.

- **Output:** Array of token IDs representing active loans.

#### `fetchLoanInfo`

Returns details of a specific loan.

- **Output:** Borrowed amount, due date, total repayment amount.

---

## Design Decisions

1. **Non-Transferable NFTs:** Ensures collateral remains tied to the loan, simplifying loan recovery.
2. **Tier-Based Lending:** Provides flexibility while standardizing loan parameters for easy management.
3. **Permit2 Integration:** Reduces gas costs and enables seamless token approvals.
4. **Interest Calculation:** Interest is computed in basis points for precision and flexibility.
5. **Loan Expiry Handling:** Expired loans cannot be repaid; designed for simplicity over automated penalty enforcement.

---

## Tradeoffs

1. **Loan Lock-In:** Borrowers cannot repay loans after expiration, which may inconvenience users but simplifies logic.
2. **Non-Transferable NFTs:** Limits NFT usability but ensures collateral integrity.
3. **Manual Administration:** Tier management and withdrawals are owner-controlled, limiting decentralization.
4. **Permit2 Dependency:** Relies on an external contract for efficient repayments, introducing external risk.

---

## Security Considerations

1. **Reentrancy Protection:** All external calls are protected using the `nonReentrant` modifier.
2. **Allowance Checks:** Ensures users have sufficient allowances before transferring ERC20 tokens.
3. **Ownership Verification:** All NFT actions validate ownership to prevent unauthorized access.
4. **Overflow Protection:** Validates loan amounts to prevent integer overflows.

---

## Usage Example

### Minting an NFT

```solidity
dependentContract.mintNFT(userAddress, tierId);
```

### Requesting a Loan

```solidity
dependentContract.requestLoan();
```

### Repaying a Loan with Permit2

```solidity
dependentContract.repayLoanWithPermit2(permit, transferDetails, signature);
```

---

## Contact

- **Security Contact:** [security@magnifyworld.com](mailto:security@magnifyworld.com)
