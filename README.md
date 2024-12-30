# Magnify Cash Mini App

An on-chain micro-lending platform offering gas-free micro-loans to Worldcoin users.

## Overview

The Magnify Cash Mini App is a decentralized lending platform that leverages WorldID verification to provide tiered loans based on a user's identity verification level. The platform offers different loan terms depending on how users verify their identity - whether through device verification, passport verification, or orb verification.

### Key Features

- **World ID Verification**: Multiple verification tiers
- **Gas-free Transactions**: Using Worldchain
- **Instant Loans**: Quick approval process
- **Simple Repayment**: Easy-to-use interface

## System Architecture

### 1. Smart Contract (`contracts/contract.sol`)

The backbone of the lending system, handling:

- NFT minting based on verification level
- Loan issuance and management
- Repayment processing
- Tier management for different verification levels

Key components:

- **Tiers**: Different loan parameters based on verification level
- **NFTs**: Non-transferable tokens representing verification status
- **Loans**: Tracking active loans, amounts, and durations

### 2. Frontend Application (`src/*`)

A user-friendly interface allowing users to:

- Connect their wallet
- Verify identity through WorldID
- Request loans
- Monitor loan status
- Process repayments

Key pages:

- Loan Request Page
- Loan Dashboard
- Repayment Interface

### 3. Backend Service (`worldid-backend/src/index.ts`)

Handles:

- WorldID verification processing
- NFT minting coordination

## User Flow

1. **Initial Access**

   - User connects their wallet
   - Navigates to the loan page

2. **Identity Verification**

   - User chooses verification method:
     - Device verification (basic tier)
     - Passport verification (medium tier)
     - Orb verification (premium tier)
   - Completes WorldID verification process

3. **NFT Minting**

   - Upon successful verification, backend API mints a non-transferable NFT
   - NFT tier corresponds to verification level
   - NFT serves as collateral for loans

4. **Loan Process**

   - User can view available loan terms based on their tier
   - Request loan through interface
   - Loan is automatically disbursed upon approval

5. **Loan Management**
   - Monitor loan status through dashboard
   - View repayment schedule
   - Process repayments before due date
