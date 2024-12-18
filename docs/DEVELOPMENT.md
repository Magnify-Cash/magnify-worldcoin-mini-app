# Development Guide

## Setup

1. Install Node.js (v18+)
2. Install dependencies: `npm install`
3. Copy environment variables: `cp .env.example .env`
4. Configure environment variables
5. Start development server: `npm run dev`

## Architecture

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- Shadcn UI

### Monitoring & DevOps
- Sentry error tracking
- Performance monitoring
- Structured logging
- Environment-based configuration

### Authentication
- World ID verification
- MiniKit wallet auth

### State Management
- React Query
- React Context

## Development Workflow

1. Create feature branch
2. Implement changes
3. Write tests
4. Submit PR
5. Code review
6. Merge to main

## Best Practices

### Code Style
- Use TypeScript
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Error Handling
- Use the logger utility for all logging
- Wrap critical operations in try-catch blocks
- Use error boundaries for component errors
- Include context in error logs

### Performance
- Use measurePerformance utility for critical operations
- Monitor component render performance
- Optimize expensive calculations
- Use proper memoization

### Components
- Keep components small (<100 lines)
- Use composition
- Implement proper error handling
- Add console logging for debugging

### Testing
- Write unit tests
- Test edge cases
- Mock external services

## Deployment

1. Build: `npm run build`
2. Test build: `npm run preview`
3. Deploy to production

### Environment Setup
- Development: `.env.development`
- Staging: `.env.staging`
- Production: `.env.production`

### Monitoring Setup
1. Configure Sentry DSN
2. Set up error tracking
3. Configure performance monitoring
4. Set up logging levels

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)