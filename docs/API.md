# Technical README for NFT Minting Backend on Cloudflare Workers

## Overview

This backend is a Cloudflare Workers application designed to mint NFTs on the Worldchain blockchain. It ensures user verification via **Worldcoin**'s decentralized identity solution before allowing NFT minting. The service is lightweight, scalable, and secure.

---

## Key Features

- **Identity Verification:** Verifies user identity through Worldcoin's World ID system.
- **Signal Hashing:** Uses `keccak256` hashing to securely process the user's signal.
- **NFT Minting:** Supports the minting of NFTs on the Worldchain blockchain, handling tier-based logic.
- **Serverless Design:** Runs on Cloudflare Workers, ensuring high scalability and minimal latency.
- **Secure Key Management:** Uses Cloudflare environment variables to securely store the blockchain private key.

---

## Setup & Deployment

### Prerequisites

1. A Cloudflare Workers account.
2. A Worldchain Alchemy RPC endpoint.
3. A private key for a Worldchain account (used for NFT minting).
4. A Worldcoin app ID (for verification).

### Installation Steps

1. Clone the repository.
2. Install dependencies using:
   ```bash
   npm install buffer viem ox
   ```
3. Set up the Cloudflare Workers environment variables in `wrangler.toml`:
   ```toml
   [vars]
   PRIVATE_KEY = "your-private-key"
   ```

### Deploy the Worker

1. Run locally for testing:
   ```bash
   wrangler dev
   ```
2. Deploy to Cloudflare:
   ```bash
   wrangler publish
   ```

---

## API Endpoints

### `POST /`

**Purpose:** Verify Worldcoin proof and mint an NFT.

**Headers:**

- `Content-Type`: `application/json`

**Request Body:**

```json
{
  "proof": { "type": "ISuccessResult", "...": "..." },
  "signal": "user signal",
  "action": "action string"
}
```

- `proof`: Worldcoin proof object.
- `signal`: Unique user signal, typically a hashed value.
- `action`: The action to be performed (e.g., `mint-device-verified-nft`).

**Response:**

- **Success (200):**
  ```json
  {
    "success": true,
    "transaction": "transaction hash",
    "tier": 1
  }
  ```
- **Error (400/500):**
  ```json
  {
    "error": "description",
    "details": "specific error details"
  }
  ```

---

## Design Details

### Signal Hashing

- Signals are hashed using `keccak256` with the `hashToField` function, ensuring security and compatibility with blockchain operations.
- The signal is shifted right by 8 bits to reduce collision risks.

### Worldcoin Verification

- Sends a POST request to Worldcoin's verification API.
- Includes `proof`, `action`, and a hashed `signal`.
- Errors from this step are logged and returned to the client.

### NFT Minting

- Uses the `viem` library to interact with the Worldchain blockchain.
- Selects the tier based on the `action` parameter (`1` for `mint-device-verified-nft`, otherwise `3`).
- Writes to the `mintNFT` function of the contract.

---

## Nuances and Tradeoffs

### Security

- Private keys are stored as environment variables and not hardcoded.
- Signals are hashed before transmission, reducing exposure of sensitive user data.

### Scalability

- Cloudflare Workers' serverless model scales automatically with traffic, but it may have limits for high-throughput blockchain operations.

### Performance

- The lightweight nature of Cloudflare Workers ensures low-latency responses.
- Interactions with external APIs (Worldcoin, Worldchain RPC) can introduce delays.

### Tradeoffs

- **Serverless Benefits:** High scalability and low cost.
- **Serverless Drawbacks:** Debugging is harder due to limited logging and execution time constraints.

---

## Error Handling

- **Invalid JSON:** Returns a `400` with a clear error message.
- **Missing Parameters:** Lists missing fields in the response.
- **Verification Failure:** Logs details and returns a `400` with error specifics.
- **Internal Errors:** Logs stack traces and returns a `500` with generic error details.

---

## Dependencies

- `buffer`: For handling byte operations.
- `viem`: For blockchain interactions.
- `ox`: For data validation and hashing.
- `@worldcoin/idkit`: For Worldcoin proof types.

---

## Example Usage

### Request

```bash
curl -X POST https://your-worker-url.com \
-H "Content-Type: application/json" \
-d '{
  "proof": { "type": "ISuccessResult", "...": "..." },
  "signal": "0x123abc",
  "action": "mint-device-verified-nft"
}'
```

### Response

```json
{
  "success": true,
  "transaction": "0xabc123...",
  "tier": 1
}
```

---

## Future Enhancements

- **Logging Improvements:** Add structured logging for easier debugging.
- **Retry Logic:** Handle transient API failures gracefully.
- **Unit Tests:** Extend test coverage for all critical functions.
