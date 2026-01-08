# 🔍 Sentry Integration Setup Guide

## Overview

Sentry is now fully integrated into TAC Cargo for comprehensive error tracking, performance monitoring, and session replay. This guide covers the complete setup and usage.

---

## 📦 Installed Packages

```json
{
  "@sentry/nextjs": "^10.x",
  "@modelcontextprotocol/sdk": "latest"
}
```

**Installed on:** 2026-01-01

---

## 🔧 Configuration Files

### 1. **Sentry Client Configuration**

**File:** `@/sentry.client.config.ts:1-60`

**Features:**

- Error tracking for browser-side code
- Session replay (10% sample rate, 100% on errors)
- Performance monitoring (100% trace sample rate)
- PII collection enabled for better context
- Ignores common browser extension errors

**Configuration:**

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  sendDefaultPii: true,
  environment: process.env.NODE_ENV,
});
```

---

### 2. **Sentry Server Configuration**

**File:** `@/sentry.server.config.ts:1-30`

**Features:**

- Error tracking for server-side code
- Performance monitoring for API routes
- Ignores network-related errors (ECONNRESET, EPIPE, ETIMEDOUT)

---

### 3. **Sentry Edge Configuration**

**File:** `@/sentry.edge.config.ts:1-20`

**Features:**

- Error tracking for Edge Runtime (middleware, edge functions)
- Lightweight configuration for edge environments

---

### 4. **Instrumentation Hook**

**File:** `@/instrumentation.ts:1-15`

**Purpose:**

- Initializes Sentry when the Next.js server starts
- Automatically loads correct config based on runtime (Node.js vs Edge)

---

### 5. **Next.js Configuration**

**File:** `@/next.config.ts:7,153-203`

**Sentry Features Enabled:**

- Source map upload for better stack traces
- React component annotation for debugging
- Tunnel route (`/monitoring`) to bypass ad-blockers
- Automatic Vercel Cron monitoring
- Tree-shaking of Sentry logger statements

**Configuration:**

```typescript
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  reactComponentAnnotation: { enabled: true },
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  automaticVercelMonitors: true,
});
```

---

## 🔑 Environment Variables

### Required Variables

Add these to your `.env.local` file:

```bash
# Sentry DSN (Public - safe to expose)
NEXT_PUBLIC_SENTRY_DSN=https://c4415e5db8e8ffadedbe4bdefb2a22ae@o4510626688073728.ingest.de.sentry.io/4510626689777744

# Sentry Organization (for source map uploads)
SENTRY_ORG=your-org-slug

# Sentry Project Name
SENTRY_PROJECT=tac-cargo

# Sentry Auth Token (for CI/CD builds)
# Create at: https://sentry.io/settings/account/api/auth-tokens/
# Required scopes: project:releases, org:read
SENTRY_AUTH_TOKEN=your-auth-token-here
```

### Getting Your Credentials

1. **DSN (Already configured):**
   - Your DSN: `https://c4415e5db8e8ffadedbe4bdefb2a22ae@o4510626688073728.ingest.de.sentry.io/4510626689777744`
   - This is already set in `.env.example`

2. **Organization Slug:**
   - Go to: https://sentry.io/settings/
   - Copy your organization slug from the URL

3. **Auth Token:**
   - Go to: https://sentry.io/settings/account/api/auth-tokens/
   - Click "Create New Token"
   - Name: "TAC Cargo CI/CD"
   - Scopes: `project:releases`, `org:read`
   - Copy the token

---

## 🚀 Quick Start

### 1. Install Dependencies (Already Done)

```bash
npm install @sentry/nextjs @modelcontextprotocol/sdk
```

### 2. Configure Environment Variables

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local and add your Sentry credentials
# The DSN is already configured, just add SENTRY_ORG and SENTRY_AUTH_TOKEN
```

### 3. Verify Installation

```bash
# Build the application
npm run build

# You should see Sentry source map upload logs
# Look for: "Sentry CLI: Uploading source maps..."
```

### 4. Test Error Tracking

Create a test error in any component:

```typescript
// In any component
const handleTestError = () => {
  throw new Error('Test Sentry Integration')
}

<button onClick={handleTestError}>Test Sentry</button>
```

Visit: https://sentry.io/organizations/your-org/issues/

---

## 📊 Features Enabled

### ✅ Error Tracking

- **Client-side errors:** Captured automatically
- **Server-side errors:** Captured in API routes and server components
- **Edge errors:** Captured in middleware and edge functions

### ✅ Performance Monitoring

- **Traces:** 100% of transactions sampled
- **API routes:** Automatic instrumentation
- **Database queries:** Captured with Supabase integration
- **External requests:** Tracked automatically

### ✅ Session Replay

- **On errors:** 100% of sessions with errors recorded
- **Random sampling:** 10% of normal sessions recorded
- **Privacy:** All text and media masked by default

### ✅ Release Tracking

- **Automatic:** Uses Git commit SHA from Vercel
- **Manual:** Set `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` env var
- **Source maps:** Uploaded automatically during build

### ✅ Breadcrumbs

- **Navigation:** Page transitions tracked
- **Console logs:** Captured as breadcrumbs
- **Network requests:** HTTP requests logged
- **User interactions:** Clicks and form submissions

---

## 🔍 MCP Server Monitoring (Future)

The `@modelcontextprotocol/sdk` package is installed for future MCP server monitoring integration.

### When to Enable MCP Monitoring

If you add MCP servers to your application, wrap them with Sentry:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk";
import * as Sentry from "@sentry/nextjs";

const server = Sentry.wrapMcpServerWithSentry(
  new McpServer({
    name: "my-mcp-server",
    version: "1.0.0",
  }),
);
```

**Benefits:**

- Trace complete MCP request flows
- Debug resource requests and server responses
- Identify performance bottlenecks
- Monitor server startup and tool execution

---

## 🛠️ Usage Examples

### Manual Error Capture

```typescript
import * as Sentry from "@sentry/nextjs";

try {
  // Your code
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: "checkout",
      user_action: "payment",
    },
    extra: {
      orderId: "12345",
      amount: 99.99,
    },
  });
}
```

### Custom Breadcrumbs

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.addBreadcrumb({
  category: "auth",
  message: "User logged in",
  level: "info",
  data: {
    userId: user.id,
    email: user.email,
  },
});
```

### Performance Monitoring

```typescript
import * as Sentry from "@sentry/nextjs";

const transaction = Sentry.startTransaction({
  name: "Process Shipment",
  op: "shipment.process",
});

try {
  // Your code
  const span = transaction.startChild({
    op: "db.query",
    description: "Fetch shipment data",
  });

  // Database query
  span.finish();

  transaction.setStatus("ok");
} catch (error) {
  transaction.setStatus("internal_error");
  throw error;
} finally {
  transaction.finish();
}
```

### User Context

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
  ip_address: "{{auto}}", // Automatically captured
});
```

---

## 🔒 Security & Privacy

### PII Handling

**Enabled:** `sendDefaultPii: true`

**What's Collected:**

- User IP addresses
- User-agent strings
- Request URLs (sanitized)
- User IDs (if set)

**Not Collected:**

- Passwords (automatically redacted)
- API keys (automatically redacted)
- Credit card numbers (automatically redacted)

### Data Scrubbing

Sentry automatically scrubs sensitive data:

- `password`, `passwd`, `secret`, `api_key`, `apikey`, `access_token`
- Credit card patterns
- Social security numbers

### Additional Scrubbing

Add custom patterns in Sentry dashboard:

1. Go to: https://sentry.io/settings/your-org/projects/tac-cargo/security-and-privacy/
2. Add data scrubbing rules

---

## 📈 Monitoring Dashboard

### Access Your Sentry Dashboard

**Issues:** https://sentry.io/organizations/your-org/issues/  
**Performance:** https://sentry.io/organizations/your-org/performance/  
**Releases:** https://sentry.io/organizations/your-org/releases/  
**Session Replay:** https://sentry.io/organizations/your-org/replays/

### Key Metrics to Monitor

1. **Error Rate:** Should be < 1% of total requests
2. **Response Time:** P95 should be < 500ms for API routes
3. **Apdex Score:** Should be > 0.9
4. **Session Replay:** Review errors with replay for context

---

## 🚨 Alerts Configuration

### Recommended Alerts

1. **High Error Rate**
   - Condition: Error count > 50 in 5 minutes
   - Action: Email + Slack notification

2. **Performance Degradation**
   - Condition: P95 response time > 1000ms
   - Action: Email notification

3. **New Issue**
   - Condition: First occurrence of error
   - Action: Slack notification

### Setup Alerts

1. Go to: https://sentry.io/organizations/your-org/alerts/rules/
2. Click "Create Alert Rule"
3. Configure conditions and actions

---

## 🔄 Release Management

### Automatic Release Tracking

Releases are automatically created using Git commit SHA:

```typescript
release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "development";
```

### Manual Release Creation

```bash
# Install Sentry CLI
npm install -g @sentry/cli

# Create release
sentry-cli releases new "$VERSION"

# Upload source maps (done automatically during build)
sentry-cli releases files "$VERSION" upload-sourcemaps ./out

# Finalize release
sentry-cli releases finalize "$VERSION"

# Create deploy
sentry-cli releases deploys "$VERSION" new -e production
```

---

## 🧪 Testing Sentry Integration

### 1. Test Client-Side Error

```typescript
// app/test-sentry/page.tsx
'use client'

export default function TestSentry() {
  return (
    <button onClick={() => {
      throw new Error('Client-side test error')
    }}>
      Trigger Client Error
    </button>
  )
}
```

### 2. Test Server-Side Error

```typescript
// app/api/test-sentry/route.ts
export async function GET() {
  throw new Error("Server-side test error");
}
```

### 3. Test Performance Monitoring

```typescript
// app/api/test-performance/route.ts
import * as Sentry from "@sentry/nextjs";

export async function GET() {
  const transaction = Sentry.startTransaction({
    name: "Test Performance",
    op: "test",
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  transaction.finish();

  return Response.json({ success: true });
}
```

### 4. Verify in Sentry Dashboard

1. Visit: https://sentry.io/organizations/your-org/issues/
2. You should see the test errors appear within 1-2 minutes
3. Click on an issue to see full stack trace and context

---

## 🐛 Troubleshooting

### Source Maps Not Uploading

**Issue:** Stack traces show minified code

**Solution:**

```bash
# Check environment variables
echo $SENTRY_AUTH_TOKEN
echo $SENTRY_ORG
echo $SENTRY_PROJECT

# Verify .sentryclirc file exists
cat .sentryclirc

# Test Sentry CLI
sentry-cli info
```

### Errors Not Appearing in Dashboard

**Issue:** Errors not captured

**Solution:**

1. Check DSN is correct in `.env.local`
2. Verify `NEXT_PUBLIC_SENTRY_DSN` is set
3. Check browser console for Sentry initialization errors
4. Ensure Sentry is not blocked by ad-blocker (use tunnel route)

### High Event Volume

**Issue:** Too many events captured

**Solution:**

```typescript
// Reduce sample rates in sentry.client.config.ts
tracesSampleRate: 0.1,  // 10% of transactions
replaysSessionSampleRate: 0.01,  // 1% of sessions
```

### Tunnel Route Not Working

**Issue:** `/monitoring` route conflicts with middleware

**Solution:**

```typescript
// In next.config.ts, change tunnel route
tunnelRoute: "/sentry-tunnel",
```

---

## 📚 Additional Resources

### Documentation

- **Sentry Next.js:** https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Sentry CLI:** https://docs.sentry.io/cli/
- **Performance Monitoring:** https://docs.sentry.io/product/performance/
- **Session Replay:** https://docs.sentry.io/product/session-replay/

### Sentry Dashboard Links

- **Project Settings:** https://sentry.io/settings/your-org/projects/tac-cargo/
- **Client Keys:** https://sentry.io/settings/your-org/projects/tac-cargo/keys/
- **Alerts:** https://sentry.io/organizations/your-org/alerts/rules/
- **Performance:** https://sentry.io/organizations/your-org/performance/

---

## ✅ Checklist

- [x] Install `@sentry/nextjs` package
- [x] Install `@modelcontextprotocol/sdk` package
- [x] Create `sentry.client.config.ts`
- [x] Create `sentry.server.config.ts`
- [x] Create `sentry.edge.config.ts`
- [x] Create `instrumentation.ts`
- [x] Update `next.config.ts` with Sentry wrapper
- [x] Add Sentry environment variables to `.env.example`
- [x] Create `.sentryclirc` configuration file
- [ ] Add Sentry credentials to `.env.local`
- [ ] Create Sentry auth token
- [ ] Test error tracking
- [ ] Configure alerts
- [ ] Review privacy settings

---

## 🎯 Next Steps

1. **Add Credentials:**

   ```bash
   # Edit .env.local
   SENTRY_ORG=your-org-slug
   SENTRY_AUTH_TOKEN=your-token-here
   ```

2. **Build Application:**

   ```bash
   npm run build
   ```

3. **Deploy to Vercel:**
   - Add environment variables in Vercel dashboard
   - Redeploy application

4. **Monitor:**
   - Visit Sentry dashboard
   - Review errors and performance
   - Configure alerts

---

**Setup Date:** 2026-01-01  
**Sentry Version:** 10.x  
**Status:** ✅ CONFIGURED - Awaiting credentials
