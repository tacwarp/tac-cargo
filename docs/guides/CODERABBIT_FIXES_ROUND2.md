# CodeRabbit Fixes - Round 2

All issues identified by CodeRabbit have been addressed.

---

## ✅ Security Fixes

### 1. Exposed Sentry DSN in Documentation

**Files:** `SENTRY_DEPLOYMENT_READY.md`, `SENTRY_TESTING_GUIDE.md`

**Issue:** Real Sentry DSN exposed in documentation files.

**Fix:** Replaced real DSN with placeholder:
```bash
# Before (EXPOSED)
NEXT_PUBLIC_SENTRY_DSN=https://c4415e5db8e8ffadedbe4bdefb2a22ae@o4510626688073728.ingest.de.sentry.io/4510626689777744

# After (SAFE)
NEXT_PUBLIC_SENTRY_DSN=https://your-key@your-org.ingest.sentry.io/your-project-id
```

---

## ✅ Code Quality Fixes

### 2. Switch Declaration Scope Issue

**Files:** `app/api/mcp/query/route.ts`, `app/api/mcp/test/route.ts`

**Issue:** `const` declaration in switch case without block scope.

**Fix:** Wrapped case blocks with braces:
```typescript
// Before
case "list":
default:
  const limit = parseInt(searchParams.get("limit") || "10");
  break;

// After
case "list":
default: {
  const limit = parseInt(searchParams.get("limit") || "10");
  break;
}
```

### 3. Resource Leak - Early Returns Skip Client Disconnect

**File:** `app/api/mcp/test/route.ts`

**Issue:** Early returns in switch cases didn't disconnect the MCP client.

**Fix:** Added `await client.disconnect()` before each early return:
```typescript
case "query":
  if (!reference) {
    await client.disconnect(); // Added
    return NextResponse.json({ error: "..." }, { status: 400 });
  }
```

### 4. Duration Calculation Fix

**File:** `app/api/test-sentry/performance/route.ts`

**Issue:** Returned `Date.now()` instead of actual elapsed duration.

**Fix:** Calculate actual elapsed time:
```typescript
// Before
return NextResponse.json({
  duration: Date.now(), // Wrong - just timestamp
})

// After
const startTime = Date.now()
// ... operations ...
const duration = Date.now() - startTime
return NextResponse.json({
  durationMs: duration, // Correct - elapsed time
})
```

### 5. Response Status Check Before JSON Parse

**File:** `app/test-sentry/page.tsx`

**Issue:** Parsing JSON without checking if response was successful.

**Fix:** Check `response.ok` before parsing:
```typescript
// Before
const response = await fetch('/api/test-sentry/server-error')
const data = await response.json()

// After
const response = await fetch('/api/test-sentry/server-error')
if (!response.ok) {
  alert(`Server error (${response.status}): Check Sentry dashboard.`)
  return
}
const data = await response.json()
```

### 6. Overly Broad Placeholder Pattern

**File:** `lib/env-validation.ts`

**Issue:** Pattern `/test/i` would match legitimate values containing "test".

**Fix:** Use more specific anchor patterns:
```typescript
// Before - too broad
const placeholderPatterns = [
  /placeholder/i,
  /example/i,
  /test/i,  // Matches "attestation", "contest", etc.
]

// After - specific
const placeholderPatterns = [
  /^placeholder$/i,
  /^your[-_]?[\w]+[-_]?here$/i,
  /^example[-_]?[\w]*$/i,
  /^change[-_]?me$/i,
  /^todo$/i,
  /^replace[-_]?this$/i,
]
```

### 7. Unsafe Array Access Without Validation

**File:** `lib/mcp/client.ts`

**Issue:** Accessing `content[0]` without validating array exists and has elements.

**Fix:** Added validation before access:
```typescript
// Before
const content = result.content as Array<{ type: string; text: string }>;
return JSON.parse(content[0].text);

// After
const content = result.content as Array<{ type: string; text: string }>;
if (!content || !Array.isArray(content) || content.length === 0) {
  throw new Error("Invalid MCP response: empty or missing content");
}
return JSON.parse(content[0].text);
```

### 8. Missing Input Validation Before Type Assertions

**File:** `lib/mcp/shipment-server.ts`

**Issue:** Direct type casting without validating input exists.

**Fix:** Added input validation in each case:
```typescript
// Before
case "query_shipment":
  return await queryShipment(args.reference as string);

// After
case "query_shipment": {
  const reference = args?.reference;
  if (typeof reference !== "string" || !reference.trim()) {
    throw new Error("query_shipment requires a valid 'reference' string argument");
  }
  return await queryShipment(reference);
}
```

---

## ✅ Privacy/Compliance Fix

### 9. sendDefaultPii Privacy Setting

**File:** `sentry.client.config.ts`

**Issue:** `sendDefaultPii: true` always enabled - collects IP addresses, user agents, cookies.

**Fix:** Made environment-aware for GDPR/CCPA compliance:
```typescript
// Before
sendDefaultPii: true,

// After
// PII Configuration - Set to false for GDPR/CCPA compliance
// When true: Collects IP addresses, user agents, and cookies
// When false: No automatic PII collection (recommended for production)
sendDefaultPii: process.env.NODE_ENV === 'development',
```

---

## ✅ Nitpicks Fixed

### 10. Unused Variable

**File:** `components/shadcn-studio/blocks/dropdown-profile.tsx`

**Issue:** `result` variable assigned but never used.

**Fix:** Removed unused variable:
```typescript
// Before
const result = await signOutUser()
router.push('/login')

// After
await signOutUser()
router.push('/login')
```

### 11. Code Block Language Specifier

**File:** `CODERABBIT_FIXES.md`

**Issue:** Fenced code block without language specifier.

**Fix:** Added `text` language specifier:
```markdown
<!-- Before -->
```
Database Layer...
```

<!-- After -->
```text
Database Layer...
```
```

---

## ✅ Package Version Clarification

### 12. @sentry/nextjs Version

**File:** `package.json`

**CodeRabbit Claim:** "Version 10.32.1 does not exist; latest is 10.8.0"

**Verification:** According to Sentry Release Registry (getsentry.github.io), version 10.32.1 was released 12/19/2025. The version in package.json is **valid and correct**.

**Status:** No change needed - CodeRabbit information was outdated.

---

## ✅ Additional Fix

### 13. Empty middleware.ts File

**File:** `middleware.ts` (root)

**Issue:** Empty file causing Next.js error: "Middleware is missing expected function export name"

**Fix:** Deleted the empty file (proxy.ts handles middleware functionality)

---

## 🧪 Test Results

### MCP Query API
```bash
curl "http://localhost:3000/api/mcp/query?action=list&limit=5"
```
**Response:**
```json
{"success":true,"action":"list","tool":"mcp.tool.list_recent_shipments","data":[]}
```
✅ **Working**

### Performance Test API
```bash
curl "http://localhost:3000/api/test-sentry/performance"
```
**Response:**
```json
{"success":true,"message":"Performance transaction captured","durationMs":688}
```
✅ **Working** (duration now correctly shows elapsed time)

---

## 📊 Summary

| Category | Issues Fixed |
|----------|-------------|
| Security | 1 (exposed DSN) |
| Code Quality | 7 (scope, leaks, validation) |
| Privacy/Compliance | 1 (sendDefaultPii) |
| Nitpicks | 2 (unused var, code block) |
| Infrastructure | 1 (empty middleware.ts) |
| **Total** | **12 issues fixed** |

---

## ✅ All CodeRabbit Issues Resolved

**Date:** 2026-01-02  
**Status:** ✅ COMPLETE
