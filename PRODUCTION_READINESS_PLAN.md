# Production Readiness Plan - TAC Cargo

**Date:** January 3, 2026  
**Status:** In Progress  
**Target:** Production Deployment Ready  
**Test Pass Rate Goal:** 22.73% → 85%+

---

## 🚨 Critical Issues (P0) - MUST FIX BEFORE DEPLOYMENT

### 1. Authentication Session Persistence ⚠️ BLOCKING
**Priority:** P0 - CRITICAL  
**Impact:** Blocks 70% of functionality  
**Status:** In Progress

**Problem:**
- API routes return 401 Unauthorized despite successful login
- Session cookies not being sent/read properly
- 15+ tests failing due to this issue

**Root Cause:**
- Middleware updates session but API routes may not be reading it correctly
- Cookie configuration may need adjustment

**Solution:**
```typescript
// Fix 1: Ensure middleware runs for API routes
// File: middleware.ts
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

// Fix 2: Add debug logging to API routes
// File: app/api/*/route.ts
const { data: { user }, error } = await supabase.auth.getUser()
console.log('Auth check:', { user: !!user, error: !!error })

// Fix 3: Verify cookie attributes
// Ensure HttpOnly, Secure, SameSite=Lax are set
```

**Testing:**
1. Login with admin@tac.app
2. Check browser DevTools → Application → Cookies
3. Verify cookies are present and have correct attributes
4. Test API call to /api/customers
5. Should return 200, not 401

---

### 2. Tracking API Returns 404 for Valid Shipment
**Priority:** P1 - HIGH  
**Impact:** Core tracking feature broken  
**Status:** Pending

**Problem:**
- TAC-88291 returns 404 despite being seeded in database
- Tracking page shows "Shipment not found"

**Root Cause Analysis:**
```sql
-- Check if shipment exists
SELECT id, reference, status FROM shipments WHERE reference = 'TAC-88291';

-- Check scan events
SELECT * FROM scan_events WHERE shipment_id IN 
  (SELECT id FROM shipments WHERE reference = 'TAC-88291');
```

**Possible Issues:**
1. Shipment reference format mismatch (TAC-88291 vs SHP-IMF-2601-0001)
2. Database query case sensitivity
3. Foreign key relationships broken

**Solution:**
- Verify actual reference in database
- Update tracking API query to handle both formats
- Add case-insensitive search

---

### 3. Shipment Creation Form Not Rendering
**Priority:** P1 - HIGH  
**Impact:** Cannot create new shipments  
**Status:** Pending

**Problem:**
- `/dashboard/shipments/new` page appears empty in tests
- Form components not rendering

**Possible Causes:**
1. Client-side hydration error
2. Missing dependencies
3. Async component issue
4. Console errors not visible in test

**Solution:**
- Add error boundary around form
- Check for console errors
- Verify all imports are correct
- Test in multiple browsers

---

## 🔧 High Priority Fixes (P1)

### 4. Add Logout Functionality
**Priority:** P1  
**Impact:** Cannot test RBAC, poor UX  
**Status:** Pending

**Implementation:**
```typescript
// File: components/nav-user.tsx
const handleLogout = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  router.push('/login')
  toast.success('Logged out successfully')
}

// Add to dropdown menu
<DropdownMenuItem onClick={handleLogout}>
  <LogOutIcon className='mr-2 size-4' />
  Logout
</DropdownMenuItem>
```

---

### 5. Complete Week 2 Features

#### 5a. Exceptions Management API
**Status:** Page exists, API needed

**Implementation:**
```typescript
// File: app/api/exceptions/route.ts
- GET /api/exceptions - List exceptions with filters
- POST /api/exceptions - Create exception
- PUT /api/exceptions - Update/resolve exception
- DELETE /api/exceptions - Delete exception

// Add create dialog to exceptions page
// Connect to API with React Hook Form + Zod
```

#### 5b. Payments Tracking API
**Status:** Page exists, API needed

**Implementation:**
```typescript
// File: app/api/payments/route.ts
- GET /api/payments - List payments with filters
- POST /api/payments - Record payment
- PUT /api/payments - Update payment status

// Connect payments page to API
// Add payment recording dialog
```

#### 5c. Shipment Edit Modal
**Status:** Not implemented

**Implementation:**
```typescript
// File: app/(dashboard)/dashboard/shipments/page.tsx
- Add edit dialog component
- Pre-fill form with shipment data
- Connect to PUT /api/shipments
- Add validation and error handling
```

---

### 6. Add Missing Audio Files
**Priority:** P1  
**Impact:** Console errors during scanning  
**Status:** Pending

**Solution:**
```bash
# Option 1: Add audio files
public/sounds/success.mp3
public/sounds/warning.mp3
public/sounds/error.mp3

# Option 2: Remove audio feature
# Remove audio.play() calls from scanning page
```

---

## 📊 Medium Priority (P2)

### 7. Seed Multiple User Roles
**Priority:** P2  
**Impact:** Cannot test RBAC properly  
**Status:** Pending

**Implementation:**
```sql
-- Create test users with different roles
INSERT INTO auth.users (email, role) VALUES
  ('admin@tac.app', 'admin'),
  ('operator@tac.app', 'operator'),
  ('viewer@tac.app', 'viewer');

-- Add role-based permissions
-- Update RLS policies to check user role
```

---

### 8. Improve Error Handling
**Priority:** P2  
**Impact:** Better debugging and UX  
**Status:** Pending

**Implementation:**
- Add error boundaries to all major pages
- Improve toast notification messages
- Add Sentry error tracking
- Add debug mode for development

---

### 9. API Endpoint Verification
**Priority:** P2  
**Impact:** Ensure all APIs work correctly  
**Status:** Pending

**Testing Checklist:**
- [ ] GET /api/shipments - List shipments
- [ ] POST /api/shipments - Create shipment
- [ ] PUT /api/shipments - Update shipment
- [ ] DELETE /api/shipments - Delete shipment
- [ ] GET /api/customers - List customers
- [ ] POST /api/customers - Create customer
- [ ] PUT /api/customers - Update customer
- [ ] DELETE /api/customers - Delete customer
- [ ] GET /api/invoices - List invoices
- [ ] GET /api/invoices/[id]/pdf - Generate PDF
- [ ] POST /api/scan - Record scan
- [ ] GET /api/scan - List scans
- [ ] GET /api/track - Track shipment

---

## 🎯 Implementation Order

### Phase 1: Critical Blockers (Day 1)
1. ✅ Fix TypeScript error in scan API
2. 🔄 Fix authentication session persistence
3. 🔄 Fix tracking API 404 issue
4. 🔄 Fix shipment creation form rendering

### Phase 2: Core Features (Day 2)
5. Add logout functionality
6. Complete exceptions management API
7. Complete payments tracking API
8. Add shipment edit modal
9. Add missing audio files

### Phase 3: Testing & Polish (Day 3)
10. Seed multiple user roles
11. Verify all API endpoints
12. Add error boundaries
13. Run TestSprite tests again
14. Fix any remaining issues

### Phase 4: Production Prep (Day 4)
15. Security audit
16. Performance optimization
17. Final testing
18. Documentation update
19. Deployment checklist

---

## 📈 Success Metrics

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Test Pass Rate | 22.73% | 85%+ | 🔴 |
| API Success Rate | ~60% | 100% | 🟡 |
| Auth Working | No | Yes | 🔴 |
| Core Features | 80% | 100% | 🟡 |
| Week 2 Complete | 60% | 100% | 🟡 |
| Production Ready | No | Yes | 🔴 |

---

## 🔍 Testing Strategy

### Manual Testing
1. Login/Logout flow
2. Create shipment end-to-end
3. Track shipment (TAC-88291)
4. Scan barcode
5. Generate invoice PDF
6. Customer CRUD operations
7. Theme toggle
8. Mobile responsiveness

### Automated Testing
1. Run TestSprite comprehensive tests
2. Verify 85%+ pass rate
3. Check all API endpoints return 200
4. Verify no console errors
5. Check Sentry for errors

### Performance Testing
1. Lighthouse score > 90
2. First Contentful Paint < 1.5s
3. Time to Interactive < 3s
4. Bundle size < 500KB

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All P0 issues fixed
- [ ] All P1 issues fixed
- [ ] Test pass rate > 85%
- [ ] No console errors
- [ ] All APIs working
- [ ] Database seeded
- [ ] Environment variables set
- [ ] SSL certificates configured

### Deployment
- [ ] Build passes without errors
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Sentry configured
- [ ] Analytics configured
- [ ] Monitoring setup

### Post-Deployment
- [ ] Smoke tests pass
- [ ] User acceptance testing
- [ ] Performance monitoring
- [ ] Error tracking active
- [ ] Backup strategy in place

---

## 📝 Notes

**Current Blockers:**
1. Authentication session not persisting - CRITICAL
2. Tracking API 404 - HIGH
3. Form rendering issues - HIGH

**Next Steps:**
1. Fix authentication immediately
2. Verify database data
3. Complete Week 2 features
4. Run comprehensive tests
5. Deploy to staging
6. Final production deployment

**Timeline:**
- Day 1-2: Fix critical issues
- Day 3: Complete features and testing
- Day 4: Production deployment

**Resources:**
- TestSprite Report: `testsprite_tests/testsprite-mcp-test-report-LATEST.md`
- Week 1 Report: `WEEK_1_COMPLETION_REPORT.md`
- Week 2 Report: `WEEK_2_IMPLEMENTATION.md`

---

**Last Updated:** January 3, 2026  
**Next Review:** After Phase 1 completion
