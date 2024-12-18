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

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)