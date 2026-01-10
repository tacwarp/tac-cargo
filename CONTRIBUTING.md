# Contributing to TAC Cargo

Thank you for your interest in contributing to TAC Cargo! This document provides guidelines and standards for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Security](#security)

## Code of Conduct

Please be respectful and constructive in all interactions. We are committed to providing a welcoming environment for everyone.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/tac-cargo.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Submit a pull request

## Development Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

| Variable                        | Description            | Required |
| ------------------------------- | ---------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL   | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes      |

## Code Standards

### TypeScript

- Use strict TypeScript (`strict: true`)
- Define explicit types for function parameters and return values
- Avoid `any` type; use `unknown` if type is truly unknown
- Use interfaces for object shapes, types for unions/primitives

### Documentation

All functions, components, and modules must include JSDoc documentation:

````typescript
/**
 * Brief description of the function.
 *
 * @param {ParamType} paramName - Description of the parameter
 * @returns {ReturnType} Description of return value
 *
 * @example
 * ```tsx
 * const result = myFunction(arg)
 * ```
 */
````

### React Components

- Use functional components with hooks
- Define prop types using TypeScript interfaces
- Use `'use client'` directive only when necessary
- Prefer server components when possible

### Styling

- Use Tailwind CSS for styling
- Use the `cn()` utility for conditional classes
- Follow the design system tokens defined in `globals.css`
- Ensure responsive design (mobile-first approach)

### File Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   └── (dashboard)/    # Dashboard route group
├── components/
│   ├── ui/             # Reusable UI components
│   ├── dashboard/      # Dashboard-specific components
│   └── landing/        # Landing page components
├── lib/                # Utility libraries
│   └── supabase/       # Supabase client configuration
└── hooks/              # Custom React hooks
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `security`: Security improvements

### Examples

```
feat(tracking): add real-time shipment updates
fix(auth): resolve session refresh issue
docs(api): add JSDoc to track endpoint
security(api): add input validation to track route
```

## Pull Request Process

1. **Branch naming**: Use `feature/`, `fix/`, `docs/`, or `security/` prefixes
2. **Description**: Provide a clear description of changes
3. **Testing**: Ensure all tests pass
4. **Review**: Request review from maintainers
5. **CodeRabbit**: Address AI review feedback
6. **Squash**: Squash commits before merging

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Self-reviewed my own code
- [ ] Added JSDoc documentation for new functions
- [ ] Added/updated tests as needed
- [ ] All tests pass locally
- [ ] No new TypeScript errors
- [ ] Updated relevant documentation
- [ ] CodeRabbit review comments addressed

## AI Code Reviews with CodeRabbit

This project uses [CodeRabbit](https://coderabbit.ai) for AI-powered code reviews on every pull request.

### What CodeRabbit Reviews

- **Security**: SQL injection, XSS, authentication issues
- **Performance**: Inefficient queries, memory leaks, re-render issues
- **Best Practices**: TypeScript patterns, React hooks, accessibility
- **Code Quality**: Error handling, type safety, maintainability

### Interacting with CodeRabbit

Use these commands in PR comments:

| Command | Description |
|---------|-------------|
| `@coderabbitai review` | Request a new review |
| `@coderabbitai summary` | Generate PR summary |
| `@coderabbitai resolve` | Resolve all comments |
| `@coderabbitai help` | Show all commands |

### Local Reviews (Optional)

Run CodeRabbit locally before pushing (requires WSL on Windows):

```bash
# Install CLI (in WSL)
curl -fsSL https://cli.coderabbit.ai/install.sh | sh

# Authenticate
coderabbit auth login

# Review your changes
coderabbit --type uncommitted
```

For detailed setup, see [docs/CODERABBIT_SETUP.md](docs/CODERABBIT_SETUP.md).

## Security

### Reporting Vulnerabilities

Please report security vulnerabilities privately via email. Do not create public issues for security concerns.

### Security Best Practices

- Never commit secrets or API keys
- Use environment variables for sensitive configuration
- Validate and sanitize all user input
- Follow OWASP guidelines for web security
- Keep dependencies updated

## Questions?

Open an issue or discussion for questions about contributing.
