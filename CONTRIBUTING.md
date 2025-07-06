# Contributing to Alexandra Chen Artist Portfolio

Thank you for your interest in contributing to this artist portfolio project. This document provides guidelines for development and contribution.

## Development Setup

1. **Prerequisites**
   - Node.js 18 or higher
   - PostgreSQL database
   - Git

2. **Local Development**
   ```bash
   git clone <repository-url>
   cd artist-portfolio
   npm install
   cp .env.example .env
   # Configure your database URL in .env
   npm run db:push
   npm run dev
   ```

3. **Project Structure**
   ```
   ├── client/          # React frontend
   ├── server/          # Express backend
   ├── shared/          # Shared types and schemas
   ├── uploads/         # File uploads directory
   └── .github/         # GitHub Actions workflows
   ```

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Enable strict mode and fix all type errors
- Use proper typing for React components and props

### React Components
- Use functional components with hooks
- Keep components focused and single-purpose
- Use proper prop typing with TypeScript interfaces

### Database
- Use Drizzle ORM for all database operations
- Define schemas in `shared/schema.ts`
- Use proper TypeScript types for database entities

### Styling
- Use Tailwind CSS for styling
- Follow the established design system
- Use Shadcn/ui components when possible

## Feature Development

### Adding New Features
1. Create feature branch from main
2. Implement feature with tests
3. Update documentation
4. Submit pull request

### Database Changes
1. Update schema in `shared/schema.ts`
2. Run `npm run db:push` to apply changes
3. Update storage interface if needed
4. Update API routes accordingly

### UI Components
1. Use existing Shadcn/ui components when possible
2. Create reusable components in `client/src/components/`
3. Follow accessibility guidelines
4. Test responsive design

## Testing

Currently, the project focuses on manual testing. Future improvements should include:
- Unit tests for utilities and business logic
- Integration tests for API endpoints
- End-to-end tests for critical user flows

## Performance Guidelines

- Optimize images before uploading
- Use lazy loading for large lists
- Implement proper caching strategies
- Monitor bundle size

## Security Considerations

- Validate all user inputs
- Sanitize file uploads
- Use environment variables for sensitive data
- Follow OWASP security guidelines

## Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

## Bug Reports

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/environment details
- Screenshots if applicable

## Feature Requests

For feature requests, provide:
- Clear description of the feature
- Use case and benefits
- Suggested implementation approach
- Any relevant mockups or designs

## Code Review Process

1. All changes require pull request review
2. Ensure CI/CD pipeline passes
3. Test changes locally before submitting
4. Keep pull requests focused and atomic

## License

This project is proprietary. All contributions become part of the project under the same license terms.