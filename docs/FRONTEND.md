# Worldcoin Mini App Technical README

This document outlines the structure, features, and design considerations of the Worldcoin Mini App, a React-based frontend application.

## Overview

The Worldcoin Mini App integrates blockchain features with **Worldcoin** identity verification. Users can mint NFTs, view wallet balances, request loans, and manage loan repayments through an intuitive UI.

---

## Key Features

1. **NFT Minting**

   - Integrates Worldcoin verification (Device-Verified and Orb-Verified NFTs).
   - Supports minting of NFTs tied to loan eligibility.

2. **Loan Management**

   - Users can request loans based on NFT tiers.
   - Provides loan repayment functionality using **Permit2**.

3. **Wallet Integration**

   - Displays wallet balances, including native and ERC-20 tokens.
   - Allows navigation between loan-related pages.

4. **Error Handling**

   - Ensures proper feedback for errors and API failures.

5. **Responsive Design**
   - Built with TailwindCSS for modern, responsive layouts.

---

## File Structure and Components

### `App.jsx`

- Entry point for the application.
- Configures global providers:
  - **WagmiProvider**: For blockchain interactions.
  - **QueryClientProvider**: For caching and state management.
  - **MiniKitProvider**: For Worldcoin interactions.
- Sets up routes using React Router.

### `LoanDashboardPage.jsx`

- Displays active loans for the user.
- Uses `useMagnifyWorld` to fetch loan data.
- Provides a button to request new loans if none are active.

### `LoanPage.jsx`

- Allows users to request new loans.
- Uses:
  - `useRequestLoan` for handling loan requests.
  - `IDKitWidget` for Worldcoin verification during NFT claims.
- Displays loan terms and conditions based on NFT tier.

### `WalletPage.jsx`

- Shows wallet details, including balances and token list.
- Fetches balances via Alchemy API.
- Provides navigation options for loans and dashboard.

### Hooks

#### `useRequestLoan`

- Handles loan initiation by calling the blockchain smart contract.
- Tracks transaction status and provides user feedback.

#### `useRepayLoan`

- Manages loan repayments via Permit2.
- Tracks transaction confirmation and handles errors.

#### `useMagnifyWorld`

- Fetches contract data, including loans, tiers, and user NFT information.
- Caches data globally for efficient reuse.

---

## APIs and Dependencies

### Key APIs

1. **Worldcoin API**: Verifies user identity during NFT claims.
2. **Alchemy API**: Fetches wallet balances and token metadata.

### Libraries

- **React Router**: For routing.
- **Tanstack Query**: For API caching and state management.
- **MiniKit**: For Worldcoin and blockchain interactions.
- **Viem**: For low-level blockchain communication.
- **Lucide Icons**: For consistent iconography.

---

## Design Considerations

### Security

- Private keys are not exposed; transactions rely on user signatures.
- Signals and requests are hashed to enhance security.

### Scalability

- Uses React Query to cache data, reducing API load.
- Leverages Cloudflare for fast and distributed app hosting.

### User Experience

- Error messages are clear and actionable.
- Responsive design ensures compatibility with mobile and desktop devices.

### Tradeoffs

1. **Permit2 vs Standard Transactions**: Permit2 reduces the need for repeated user approvals but adds implementation complexity.
2. **Caching**: While efficient, stale data risks exist for rapidly changing blockchain states.

## Usage

### NFT Minting

- Navigate to the loan page.
- Verify identity with Worldcoin to claim an NFT.

### Loan Requests

- View loan eligibility based on NFT tier.
- Apply for loans directly through the app.

### Wallet Management

- Access wallet balances and token details on the Wallet page.
- Navigate between features using action buttons.

---

## Future Enhancements

1. **Passport Verification**

   - Add support for passport-based NFT verification.

2. **Analytics**

   - Integrate user analytics for feature usage insights.

3. **Dark Mode**
   - Add a theme toggle for better user experience.
