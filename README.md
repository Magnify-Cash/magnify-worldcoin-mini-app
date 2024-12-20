# Magnify Cash Mini App

Magnify Cash is an on-chain micro-lending platform offering gas-free micro-loans to Worldcoin users.

## Features

- **World ID Verification**: Multiple verification tiers
- **Gas-free Transactions**: Using Worldchain
- **Instant Loans**: Quick approval process
- **Simple Repayment**: Easy-to-use interface

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Run development server:

```bash
npm run dev
```

## DevOps Setup

### Monitoring

- Sentry for error tracking and performance monitoring
- Console logging with different levels (info, warn, error)
- Performance measurements for critical operations

### Environment Variables

Required environment variables:

- `VITE_SENTRY_DSN`: Sentry project DSN
- Additional variables as needed for specific features

### Deployment Environments

- Development: Local development environment
- Staging: For testing before production
- Production: Live environment

### Error Handling

- Global error boundary
- Unhandled promise rejection catching
- Structured logging

### Performance Monitoring

- Custom performance measurements
- Sentry performance tracking
- Console-based performance logging

## Documentation

- [Backend Integration](./docs/BACKEND_INTEGRATION.md)
- [API Documentation](./docs/API.md)
- [Development Guide](./docs/DEVELOPMENT.md)

## Architecture

- React + Vite frontend
- World ID verification
- MiniKit integration
- Worldchain transactions

## Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

## License

MIT
