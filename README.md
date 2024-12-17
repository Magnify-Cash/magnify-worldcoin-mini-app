# MAGBot Mini App

MAGBot is an on-chain micro-lending platform designed to offer gas-free micro-loans to Worldcoin users. The app uses World ID verification to determine user eligibility and loan tiers.

## Features

- **World ID Verification**: Multiple verification tiers with different loan limits
  - ORB Verified: Up to $10
  - Passport Verified: Up to $3
  - Non-verified: Up to $1 (starter loans)
- **Gas-free Transactions**: Leveraging Worldchain for efficient operations
- **Instant Loans**: Quick approval and disbursement process
- **Simple Repayment Tracking**: Easy-to-use interface for managing loans

## Technical Setup

### Prerequisites

- Node.js & npm installed
- World App Developer Account
- MiniKit SDK credentials

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd magbot-mini-app
```

2. Install dependencies:
```bash
npm install
```

3. Install MiniKit dependencies:
```bash
npm install @worldcoin/minikit-js @worldcoin/minikit-react
```

### World App Integration

1. Create a MiniKit Provider (`src/providers/MiniKitProvider.tsx`):
```tsx
import { ReactNode, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';

export const MiniKitProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    MiniKit.install('magbot-mini-app');
  }, []);

  return <>{children}</>;
};
```

2. Wrap your app with the provider in `App.tsx`:
```tsx
import { MiniKitProvider } from './providers/MiniKitProvider';

const App = () => (
  <MiniKitProvider>
    {/* Your app components */}
  </MiniKitProvider>
);
```

3. Check if running in World App:
```tsx
const isInWorldApp = MiniKit.isInstalled();
```

### World ID Integration

1. Configure World ID in your app:
```tsx
const worldIdConfig = {
  app_id: "app_staging_d992d7e574c9870a57587c2b261e7a1f",
  action: "verify",
  verification_level: ["orb", "passport"]
};
```

2. Handle verification:
```tsx
const handleVerify = async (proof) => {
  if (proof.verification_level === "orb") {
    // Handle ORB verification
    // Max loan: $10
  } else if (proof.verification_level === "passport") {
    // Handle passport verification
    // Max loan: $3
  }
};
```

## Development

```bash
npm run dev
```

## Testing

```bash
npm test
```

## Building for Production

```bash
npm run build
```

## Deployment

1. Build your app:
```bash
npm run build
```

2. Submit to World App Store:
- Package your build
- Submit through the World App Developer Portal
- Await approval

## Architecture

### Components

1. **Verification Module**
   - Handles World ID integration
   - Manages verification states
   - Determines loan eligibility

2. **Loan Management**
   - Loan application processing
   - Repayment tracking
   - Transaction history

3. **Wallet Integration**
   - Balance checking
   - Transaction processing
   - WUSDC handling

### Data Flow

1. User verification → Eligibility determination
2. Loan application → Smart contract interaction
3. Loan approval → Fund disbursement
4. Repayment tracking → Transaction updates

## Security Considerations

- World ID verification for identity proof
- Smart contract auditing
- Secure fund handling
- Rate limiting
- Error handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[Your License]

## Support

For support, email [your-email] or join our Discord channel.