# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously at TAC Cargo. If you discover a security vulnerability, please follow these guidelines:

### How to Report

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Email security concerns to: [security@taccargo.com](mailto:security@taccargo.com)
3. Include detailed information about the vulnerability
4. Provide steps to reproduce if possible

### What to Include

- Type of vulnerability
- Full paths of affected source files
- Location of the affected source code (tag/branch/commit or URL)
- Step-by-step reproduction instructions
- Proof-of-concept or exploit code (if possible)
- Impact assessment

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution**: Depends on severity

## Security Best Practices

### For Contributors

1. **Never commit secrets** - Use environment variables
2. **Validate all input** - Server and client side
3. **Use parameterized queries** - Prevent SQL injection
4. **Implement proper authentication** - Use Supabase Auth
5. **Follow least privilege** - Request minimal permissions

### Authentication & Authorization

- All dashboard routes require authentication
- Use Supabase Row Level Security (RLS) policies
- Session tokens are httpOnly cookies
- Implement proper CORS policies

### Data Protection

- Sensitive data encrypted at rest (Supabase)
- HTTPS enforced in production
- PII handled according to privacy regulations
- Regular security audits recommended

### Dependency Management

- Keep dependencies updated
- Run `npm audit` regularly
- Review dependency changes in PRs
- Use `npm audit fix` for automatic fixes

## OWASP Top 10 Considerations

| Risk                      | Status       | Notes                                 |
| ------------------------- | ------------ | ------------------------------------- |
| Injection                 | ✅ Mitigated | Parameterized queries via Supabase    |
| Broken Auth               | ✅ Mitigated | Supabase Auth with session management |
| Sensitive Data Exposure   | ✅ Mitigated | Env vars, no hardcoded secrets        |
| XXE                       | ✅ N/A       | No XML processing                     |
| Broken Access Control     | ✅ Mitigated | RLS policies, middleware checks       |
| Security Misconfiguration | ⚠️ Review    | Regular audit recommended             |
| XSS                       | ✅ Mitigated | React auto-escapes, CSP headers       |
| Insecure Deserialization  | ✅ N/A       | No custom deserialization             |
| Vulnerable Components     | ⚠️ Monitor   | Regular dependency updates            |
| Insufficient Logging      | ⚠️ Enhance   | Add structured logging                |

## Security Headers

Recommended security headers for production (configure in `next.config.ts`):

```typescript
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];
```

## Contact

For security concerns: security@taccargo.com
