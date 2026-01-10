# CodeRabbit AI Code Review Report

**Repository**: tacwarp/tac-cargo  
**Review Date**: January 10, 2026  
**Files Analyzed**: 8 critical files  
**Review Type**: Manual analysis (CodeRabbit-style)

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | 3 |
| 🟠 High | 5 |
| 🟡 Medium | 8 |
| 🔵 Low | 6 |

---

## 🔴 Critical Issues

### 1. SQL Injection Risk in Search Query
**File**: `app/actions/shipments.ts:311-313`

```typescript
queryBuilder = queryBuilder.or(
  `reference.ilike.%${query}%,consignee_name.ilike.%${query}%,consignee_phone.ilike.%${query}%`
);
```

**Issue**: User input is directly interpolated into the query string without sanitization.

**Recommendation**:
```typescript
// Sanitize input before use
const sanitizedQuery = query.replace(/[%_\\]/g, '\\$&');
queryBuilder = queryBuilder.or(
  `reference.ilike.%${sanitizedQuery}%,consignee_name.ilike.%${sanitizedQuery}%`
);
```

---

### 2. Missing Transaction Rollback in Invoice Creation
**File**: `app/api/invoices/route.ts:180-196`

**Issue**: Manual rollback on package failure doesn't guarantee atomicity. If the delete fails, the database is left in an inconsistent state.

**Recommendation**: Use Supabase RPC with database transactions:
```typescript
// Use a database function that wraps all operations in a transaction
const { data, error } = await supabase.rpc('create_invoice_with_packages', {
  invoice_data: invoiceData,
  package_data: packages
});
```

---

### 3. Race Condition in Shipment Status Update
**File**: `app/api/scan/route.ts:122-131`

```typescript
if (shipment.status !== status) {
  const { error: updateError } = await supabase
    .from("shipments")
    .update({ status })
    .eq("id", shipment.id);
```

**Issue**: No optimistic locking - concurrent scans could overwrite each other's status updates.

**Recommendation**: Add version checking or use updated_at for optimistic locking:
```typescript
const { error: updateError } = await supabase
  .from("shipments")
  .update({ status, updated_at: new Date().toISOString() })
  .eq("id", shipment.id)
  .eq("status", shipment.status); // Only update if status hasn't changed
```

---

## 🟠 High Priority Issues

### 4. Missing Input Validation in PUT Handler
**File**: `app/api/invoices/route.ts:281-294`

```typescript
const body = await request.json();
const { id, ...updateData } = body;
// updateData is passed directly without validation
const { data, error } = await supabase.from("invoices").update(updateData)
```

**Issue**: Any field can be updated including sensitive fields like `created_by` or `total_amount`.

**Recommendation**: Whitelist allowed update fields:
```typescript
const allowedFields = ['status', 'notes', 'due_date'];
const sanitizedUpdate = Object.fromEntries(
  Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
);
```

---

### 5. Missing Organization Scoping in DELETE
**File**: `app/api/invoices/route.ts:344`

```typescript
const { error } = await supabase.from("invoices").delete().eq("id", id);
```

**Issue**: No organization_id check - users could potentially delete invoices from other organizations if RLS is misconfigured.

**Recommendation**:
```typescript
// Get user's organization first, then scope the delete
const { error } = await supabase
  .from("invoices")
  .delete()
  .eq("id", id)
  .eq("organization_id", profile.organization_id);
```

---

### 6. Webhook Secret Not Validated
**File**: `app/api/webhooks/route.ts:27`

```typescript
const { name, url, events, secret } = body;
// Secret is stored but never validated for strength
```

**Issue**: Webhook secrets should be validated for minimum length/entropy.

**Recommendation**:
```typescript
if (secret && secret.length < 32) {
  return NextResponse.json(
    { error: "Webhook secret must be at least 32 characters" },
    { status: 400 }
  );
}
```

---

### 7. URL Validation Missing for Webhooks
**File**: `app/api/webhooks/route.ts:29-34`

**Issue**: No validation that the URL is a valid HTTPS endpoint.

**Recommendation**:
```typescript
try {
  const parsedUrl = new URL(url);
  if (parsedUrl.protocol !== 'https:') {
    return NextResponse.json(
      { error: "Webhook URL must use HTTPS" },
      { status: 400 }
    );
  }
} catch {
  return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
}
```

---

### 8. Sensitive User ID Exposed in Headers
**File**: `lib/supabase/middleware.ts:85-87`

```typescript
if (isApiRoute && user) {
  supabaseResponse.headers.set("X-User-Id", user.id);
}
```

**Issue**: User IDs in response headers could be logged or exposed.

**Recommendation**: Remove this header or use it only in development:
```typescript
if (process.env.NODE_ENV === 'development' && isApiRoute && user) {
  supabaseResponse.headers.set("X-User-Id", user.id);
}
```

---

## 🟡 Medium Priority Issues

### 9. Missing Rate Limiting on Scan Endpoint
**File**: `app/api/scan/route.ts`

**Issue**: The duplicate check (1 hour window) isn't true rate limiting. Malicious users could flood with different statuses.

**Recommendation**: Implement proper rate limiting using middleware or a service.

---

### 10. Console.error Logs Could Leak Sensitive Data
**Files**: Multiple API routes

```typescript
console.error("Invoice creation error:", invoiceError);
```

**Issue**: Full error objects may contain sensitive database information.

**Recommendation**: Log only safe error properties:
```typescript
console.error("Invoice creation error:", {
  code: invoiceError.code,
  message: invoiceError.message
});
```

---

### 11. TypeScript @ts-expect-error Usage
**File**: `app/actions/shipments.ts:225-226`

```typescript
// @ts-expect-error - Supabase types
if (shipment.manifests?.status === "dispatched") {
```

**Recommendation**: Fix the Supabase type definitions instead of suppressing errors.

---

### 12. Hardcoded Limit Values
**File**: `app/api/scan/route.ts:161`

```typescript
const limit = parseInt(searchParams.get("limit") || "50");
```

**Issue**: No maximum limit validation - could cause performance issues.

**Recommendation**: Add max limit validation as done in invoices route.

---

### 13. Missing Error Type Narrowing
**File**: `app/actions/shipments.ts:88-90`

```typescript
} catch (err) {
  console.error("Create shipment error:", err);
```

**Recommendation**: Use proper error type checking:
```typescript
} catch (err) {
  const message = err instanceof Error ? err.message : 'Unknown error';
  console.error("Create shipment error:", message);
```

---

### 14. Unused Variable in Auth Middleware
**File**: `lib/supabase/middleware.ts:12`

```typescript
const isApiRoute = pathname.startsWith("/api/");
```

**Issue**: `isApiRoute` is only used conditionally at line 85.

---

### 15. Non-Atomic Multi-Table Operations
**File**: `app/api/invoices/route.ts:198-249`

**Issue**: Invoice, packages, and shipment creation should be atomic.

---

### 16. Missing Content-Security-Policy Header
**File**: `lib/supabase/middleware.ts`

**Recommendation**: Add CSP header for enhanced security.

---

## 🔵 Low Priority Issues

### 17. Inconsistent Error Message Formats
Some endpoints return `{ error: "message" }` while others return `{ error: "message", details: "..." }`.

### 18. Magic Numbers
```typescript
.gte("scanned_at", new Date(Date.now() - 3600000).toISOString()); // 1 hour
```
**Recommendation**: Use named constants.

### 19. Missing JSDoc on Public Functions
Several exported functions lack documentation.

### 20. Potential Memory Leak in Tracking Events
**File**: `app/actions/shipments.ts:126-131`
Tracking event insert result is not awaited properly.

### 21. Inconsistent Date Handling
Mix of `new Date().toISOString()` and database defaults.

### 22. Missing Pagination Defaults in Actions
`searchShipments` defaults to 50, but this should be consistent across the app.

---

## Security Checklist

| Check | Status |
|-------|--------|
| Authentication on all protected routes | ✅ Pass |
| Input validation with Zod | ⚠️ Partial (some routes) |
| SQL injection prevention | ❌ Needs fix (search) |
| XSS prevention | ✅ Pass (React handles) |
| CSRF protection | ✅ Pass (Supabase tokens) |
| Rate limiting | ❌ Not implemented |
| Security headers | ✅ Pass |
| Secret detection | ✅ Pass |
| Dependency vulnerabilities | ⚠️ Run `npm audit` |

---

## Recommended Actions

### Immediate (Before Next Deploy)
1. Fix SQL injection in `searchShipments`
2. Add input validation to invoice PUT endpoint
3. Add organization scoping to invoice DELETE

### Short-term (This Sprint)
4. Implement database transactions for invoice creation
5. Add rate limiting to API routes
6. Add webhook URL/secret validation

### Long-term (Tech Debt)
7. Fix TypeScript type suppressions
8. Standardize error response formats
9. Add comprehensive JSDoc documentation
10. Implement optimistic locking for concurrent updates

---

## How to Apply Fixes

For each critical issue, I've provided the fix above. To implement:

```bash
# Create a fix branch
git checkout -b fix/security-issues

# Make changes based on recommendations above
# Then commit with conventional commits
git commit -m "security(api): fix SQL injection in searchShipments"
git commit -m "security(invoices): add input validation and org scoping"

# Push and create PR
git push origin fix/security-issues
```

CodeRabbit will automatically review your PR when you push to GitHub.

---

*This review was generated based on CodeRabbit analysis patterns. For automated reviews on every PR, ensure CodeRabbit is installed on your repository.*
