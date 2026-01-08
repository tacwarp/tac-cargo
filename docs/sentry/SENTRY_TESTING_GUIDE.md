# 🧪 Sentry Testing & Verification Guide

## Overview

Complete guide to testing Sentry integration in TAC Cargo with comprehensive test endpoints and verification steps.

---

## ✅ Configuration Status

### Files Verified

- ✅ `proxy.ts` - Configured and working (Next.js 16 standard)
- ✅ `middleware.ts` - **DELETED** (was causing conflict)
- ✅ `sentry.client.config.ts` - Client-side tracking enabled
- ✅ `sentry.server.config.ts` - Server-side tracking enabled
- ✅ `sentry.edge.config.ts` - Edge runtime tracking enabled
- ✅ `instrumentation.ts` - Auto-initialization configured
- ✅ `next.config.ts` - Wrapped with Sentry, deprecations fixed

### Environment Variables Required

```bash
# Add to .env.local
NEXT_PUBLIC_SENTRY_DSN=https://your-key@your-org.ingest.sentry.io/your-project-id
SENTRY_ORG=your-org-slug
SENTRY_PROJECT=tac-cargo
SENTRY_AUTH_TOKEN=your-auth-token-here
```

---

## 🧪 Test Endpoints Created

### 1. Interactive Test Page

**URL:** http://localhost:3000/test-sentry

**Features:**

- ✅ Client-side error testing (caught & uncaught)
- ✅ Server-side error testing
- ✅ Performance monitoring
- ✅ Breadcrumb tracking
- ✅ User context & tagging

**File:** `@/app/test-sentry/page.tsx:1-250`

### 2. Server Error API

**URL:** http://localhost:3000/api/test-sentry/server-error

**Features:**

- Server-side exception capture
- Breadcrumb tracking
- Custom tags and context

**File:** `@/app/api/test-sentry/server-error/route.ts:1-35`

### 3. Performance API

**URL:** http://localhost:3000/api/test-sentry/performance

**Features:**

- Transaction tracking
- Span instrumentation
- Database/API call simulation

**File:** `@/app/api/test-sentry/performance/route.ts:1-50`

---

## 🚀 Testing Instructions

### Step 1: Start Development Server

```bash
npm run dev
```

**Expected Output:**

```
▲ Next.js 16.1.1 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.1.117:3000

✓ Starting...
✓ Ready in 2s
```

**No warnings about:**

- ❌ middleware.ts deprecation
- ❌ Sentry deprecation warnings
- ❌ instrumentationHook errors

### Step 2: Access Test Page

Visit: http://localhost:3000/test-sentry

You should see a dashboard with 6 test cards.

### Step 3: Test Client-Side Errors

#### Test 3.1: Caught Client Error

1. Click **"Trigger Caught Client Error"**
2. Alert appears: "Client error captured!"
3. Check browser console for Sentry logs

#### Test 3.2: Uncaught Client Error

1. Click **"Trigger Uncaught Client Error"**
2. Error appears in console
3. Sentry automatically captures it

**Verification:**

- Visit: https://sentry.io/organizations/your-org/issues/
- Look for: "Test Client-Side Error from TAC Cargo"
- Check error details, stack trace, and breadcrumbs

### Step 4: Test Server-Side Errors

1. Click **"Trigger Server Error"**
2. Alert appears: "Error has been sent to Sentry"
3. Check Sentry dashboard

**Verification:**

- Visit: https://sentry.io/organizations/your-org/issues/
- Look for: "Test Server-Side Error from TAC Cargo API"
- Verify server-side stack trace
- Check tags: `test_type: server`

### Step 5: Test Performance Monitoring

1. Click **"Test Performance Transaction"**
2. Wait for alert: "Performance transaction captured!"
3. Check Sentry Performance dashboard

**Verification:**

- Visit: https://sentry.io/organizations/your-org/performance/
- Look for: "Test Performance Transaction"
- Verify spans: Task 1 (500ms), Task 2 (300ms)
- Check transaction duration

### Step 6: Test Breadcrumbs

1. Click **"Test Breadcrumbs"**
2. Alert appears: "Error with breadcrumbs captured!"
3. Check Sentry issue details

**Verification:**

- Open the captured error in Sentry
- Click "Breadcrumbs" tab
- Verify 3 breadcrumbs:
  - "User clicked breadcrumb test button"
  - "User navigated to test page"
  - "User performed test action"

### Step 7: Test User Context

1. Click **"Test User Context"**
2. Alert appears: "Error with user context captured!"
3. Check Sentry issue details

**Verification:**

- Open the captured error in Sentry
- Check "User" section:
  - ID: test-user-123
  - Email: test@taccargo.com
  - Username: Test User
- Check tags:
  - environment: test
  - feature: sentry-testing

---

## 🔍 Verification Checklist

### Sentry Dashboard Checks

#### Issues Tab

- [ ] Client-side errors appear
- [ ] Server-side errors appear
- [ ] Stack traces are readable (source maps working)
- [ ] Breadcrumbs are captured
- [ ] User context is attached
- [ ] Tags are present

#### Performance Tab

- [ ] Transactions appear
- [ ] Spans are visible
- [ ] Duration is accurate
- [ ] Operations are labeled correctly

#### Session Replay Tab (if enabled)

- [ ] Sessions are recorded
- [ ] Errors trigger replays
- [ ] User interactions are visible

---

## 🐛 Troubleshooting

### Issue: No Errors Appearing in Sentry

**Possible Causes:**

1. DSN not configured correctly
2. Sentry blocked by ad-blocker
3. Network issues

**Solutions:**

```bash
# Verify DSN
echo $NEXT_PUBLIC_SENTRY_DSN

# Check browser console for Sentry errors
# Look for: "[Sentry] ..."

# Test tunnel route (bypasses ad-blockers)
curl http://localhost:3000/monitoring
```

### Issue: Source Maps Not Working

**Symptoms:** Stack traces show minified code

**Solutions:**

```bash
# Verify auth token is set
echo $SENTRY_AUTH_TOKEN

# Check build logs for source map upload
npm run build | grep -i sentry

# Verify .sentryclirc configuration
cat .sentryclirc
```

### Issue: Performance Data Not Appearing

**Possible Causes:**

1. `tracesSampleRate` set to 0
2. Transactions not finishing properly

**Solutions:**

```typescript
// In sentry.client.config.ts
tracesSampleRate: 1.0,  // 100% sampling for testing
```

### Issue: Middleware/Proxy Conflict

**Error:**

```
Error: Both middleware file "./middleware.ts" and proxy file "./proxy.ts" are detected.
```

**Solution:**

```bash
# Delete middleware.ts (already done)
rm middleware.ts

# Verify only proxy.ts exists
ls -la | grep -E "(middleware|proxy)"
# Should only show: proxy.ts
```

---

## 📊 Expected Results

### After Running All Tests

**Sentry Issues Dashboard:**

- 5-7 new issues captured
- Mix of client and server errors
- All with proper context and breadcrumbs

**Sentry Performance Dashboard:**

- 2-3 transactions recorded
- Spans showing simulated operations
- Duration metrics visible

**Sentry Session Replay (if enabled):**

- User interactions recorded
- Error sessions captured
- Playback available

---

## 🔒 Security Notes

### PII in Test Data

The test endpoints use **mock data only**:

- Test user ID: `test-user-123`
- Test email: `test@taccargo.com`
- No real user data exposed

### Production Considerations

Before deploying to production:

1. **Adjust Sample Rates:**

```typescript
// sentry.client.config.ts
tracesSampleRate: 0.1,  // 10% in production
replaysSessionSampleRate: 0.01,  // 1% in production
```

2. **Remove Test Endpoints:**

```bash
# Delete test files before production deploy
rm -rf app/test-sentry
rm -rf app/api/test-sentry
```

3. **Configure Alerts:**

- Set up error rate alerts
- Configure performance degradation alerts
- Enable Slack/email notifications

---

## 🚀 Deployment Verification

### After Deploying to Vercel

1. **Verify Environment Variables:**

```bash
# In Vercel dashboard
NEXT_PUBLIC_SENTRY_DSN ✓
SENTRY_ORG ✓
SENTRY_PROJECT ✓
SENTRY_AUTH_TOKEN ✓
```

2. **Test Production Errors:**

```bash
# Trigger a test error in production
curl https://your-domain.com/api/test-sentry/server-error
```

3. **Verify Source Maps:**

- Check Sentry issue in production
- Stack traces should show original code
- File paths should be correct

4. **Monitor Release:**

- Visit: https://sentry.io/organizations/your-org/releases/
- Verify release created with Git SHA
- Check deploy status

---

## 📈 Monitoring Best Practices

### Daily Checks

- Review new issues
- Check error rate trends
- Monitor performance metrics

### Weekly Reviews

- Analyze error patterns
- Review performance degradation
- Update alert thresholds

### Monthly Audits

- Review PII scrubbing rules
- Update sample rates if needed
- Clean up resolved issues

---

## 🔗 Quick Links

**Sentry Dashboards:**

- Issues: https://sentry.io/organizations/your-org/issues/
- Performance: https://sentry.io/organizations/your-org/performance/
- Releases: https://sentry.io/organizations/your-org/releases/
- Session Replay: https://sentry.io/organizations/your-org/replays/

**Configuration:**

- Project Settings: https://sentry.io/settings/your-org/projects/tac-cargo/
- Client Keys: https://sentry.io/settings/your-org/projects/tac-cargo/keys/
- Alerts: https://sentry.io/organizations/your-org/alerts/rules/

**Documentation:**

- Next.js Integration: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Performance Monitoring: https://docs.sentry.io/product/performance/
- Session Replay: https://docs.sentry.io/product/session-replay/

---

## ✅ Final Checklist

- [ ] Dev server starts without warnings
- [ ] Test page accessible at `/test-sentry`
- [ ] Client errors captured in Sentry
- [ ] Server errors captured in Sentry
- [ ] Performance transactions visible
- [ ] Breadcrumbs working correctly
- [ ] User context attached to errors
- [ ] Source maps uploaded (on build)
- [ ] Environment variables configured
- [ ] Sentry auth token created

---

**Testing Date:** 2026-01-01  
**Status:** ✅ READY FOR TESTING  
**Next Step:** Run `npm run dev` and visit http://localhost:3000/test-sentry
