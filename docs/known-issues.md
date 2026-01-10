# Known Issues & Technical Debt

## Current Status

**Project Phase**: MVP → Production Transition  
**Last Updated**: January 3, 2026

## Resolved Issues

### ✅ Color System Inconsistency (RESOLVED)

**Problem**: Hardcoded colors, insufficient contrast, theme switching issues  
**Status**: Fixed as of January 3, 2026  
**Solution**: Implemented semantic OKLCH token system with proper contrast ratios  
**Documentation**: See `COLOR_SYSTEM_FIX_SUMMARY.md` and `docs/tailwind-colors.md`

### ✅ Double Scrollbar Bug (RESOLVED)

**Problem**: Nested scroll containers from Radix UI ScrollArea  
**Status**: Fixed as of January 3, 2026  
**Solution**: Applied `scrollbar-hide` utilities and proper container heights  
**Files Modified**: `app/globals.css`, `app/layout.tsx`, `components/ui/scroll-area.tsx`

### ✅ Animation Artifacts in Dark Mode (RESOLVED)

**Problem**: Infinite shimmer animations causing visual glitches during theme switch  
**Status**: Fixed as of January 3, 2026  
**Solution**: Created theme-safe animation utilities with `prefers-reduced-motion` support  
**Files Created**: `hooks/use-theme-safe-animations.ts`, `components/ui/theme-safe-animation.tsx`

## Active Technical Debt

### 1. Incomplete Mobile Responsiveness

**Priority**: High  
**Impact**: User experience on mobile devices  
**Status**: In Progress

**Issues**:

- Dashboard sidebar doesn't collapse on mobile (<768px)
- Table components overflow on small screens
- Chart widgets not optimized for touch
- Navigation hamburger menu not implemented

**Approved Refactor**:

```tsx
// Implement responsive sidebar
<Sidebar className="hidden md:block" />
<MobileSidebar className="md:hidden" />

// Use shadcn Sheet for mobile menu
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
```

**Files to Modify**:

- `components/dashboard/app-sidebar.tsx`
- `components/dashboard/app-shell.tsx`
- `components/landing/navbar.tsx`

### 2. Missing Error Boundaries

**Priority**: Medium  
**Impact**: Error recovery and user feedback  
**Status**: Partial Implementation

**Current State**:

- Global error boundary exists (`global-error.tsx`)
- Dashboard has error boundary (`(dashboard)/error.tsx`)
- Individual components lack granular boundaries

**Required**:

```tsx
// Wrap data-heavy components
<ErrorBoundary fallback={<ChartError />}>
  <HeavyChart />
</ErrorBoundary>
```

**Files to Create**:

- `components/error-boundary.tsx` (reusable wrapper)
- Error fallback components for each feature

### 3. Incomplete Type Coverage

**Priority**: Medium  
**Impact**: Type safety and developer experience  
**Status**: Ongoing

**Issues**:

- API responses not fully typed
- Some Server Actions use `any` for FormData
- Missing Supabase generated types
- Component props sometimes use implicit types

**Action Items**:

```bash
# Generate Supabase types
npx supabase gen types typescript --project-id <id> > types/database.ts
```

**Files to Update**:

- `types/tracking.ts` (expand interfaces)
- `types/database.ts` (generate from Supabase)
- `app/actions/*.ts` (remove `any` types)

### 4. No Automated Tests

**Priority**: High  
**Impact**: Code reliability and refactoring confidence  
**Status**: Not Started

**Required Test Coverage**:

- Unit tests for utilities (`lib/utils.ts`, `lib/auth-helpers.ts`)
- Component tests for UI primitives
- Integration tests for Server Actions
- E2E tests for critical user flows

**Setup Needed**:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
npm install --save-dev playwright @playwright/test
```

**Configuration Files**:

- `vitest.config.ts`
- `playwright.config.ts`
- `__tests__/` directory structure

### 5. API Rate Limiting Not Implemented

**Priority**: Medium  
**Impact**: DDoS vulnerability, resource exhaustion  
**Status**: Not Started

**Required Implementation**:

```typescript
// middleware.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

**Endpoints to Protect**:

- `/api/track` (10 req/min per IP)
- `/api/tracking` (10 req/min per IP)
- Authentication endpoints (5 req/min per IP)

### 6. Missing Database Migrations

**Priority**: High  
**Impact**: Schema versioning and deployment safety  
**Status**: Manual Schema Changes

**Current State**:

- Database schema managed via Supabase dashboard
- No version control for schema changes
- No rollback mechanism

**Required**:

```bash
# Initialize migrations
npx supabase migration new initial_schema

# Apply migrations
npx supabase db push
```

**Files to Create**:

- `database/migrations/` directory
- Migration files for existing schema
- CI/CD integration for automatic migrations

### 7. Incomplete Accessibility Audit

**Priority**: Medium  
**Impact**: WCAG AA compliance  
**Status**: Partial Implementation

**Known Issues**:

- Some interactive elements missing ARIA labels
- Keyboard navigation incomplete in some modals
- Focus trap not implemented in dialogs
- Screen reader announcements missing for dynamic updates

**Testing Needed**:

```bash
# Install axe-core
npm install --save-dev @axe-core/react

# Run Lighthouse accessibility audit
lighthouse http://localhost:3000 --only-categories=accessibility
```

**Files to Audit**:

- All form components
- Modal/dialog components
- Navigation components
- Dashboard interactive widgets

## Legacy Decisions

### Using Tailwind v4 (Beta)

**Decision Date**: Project initialization  
**Rationale**: Early adoption for latest features  
**Risk**: Breaking changes in stable release  
**Status**: Monitoring

**Impact**:

- Some CSS linter warnings (expected, safe to ignore)
- Limited community support for v4-specific issues
- Syntax differences from v3 documentation

**Mitigation**:

- Pin version in `package.json`
- Document v4-specific patterns
- Plan migration path to stable v4

### OKLCH Color Space

**Decision Date**: Project initialization  
**Rationale**: Perceptual uniformity and future-proofing  
**Risk**: Limited browser support (Safari <15)  
**Status**: Acceptable

**Browser Support**:

- ✅ Chrome/Edge (native)
- ✅ Firefox (native)
- ✅ Safari 15+ (native)
- ❌ Safari <15 (fallback to sRGB)

**Mitigation**:

- Target browsers all support OKLCH
- No polyfill needed for target audience

### Supabase for Backend

**Decision Date**: Project initialization  
**Rationale**: Rapid development, managed infrastructure  
**Risk**: Vendor lock-in  
**Status**: Acceptable

**Considerations**:

- All business logic in application layer
- Database schema portable to PostgreSQL
- Can migrate to self-hosted Supabase if needed

## Temporary Hacks

### 1. Manual Cookie Handling in Middleware

**Location**: `lib/supabase/middleware.ts`  
**Reason**: `@supabase/ssr` cookie API limitations  
**Impact**: Verbose code, potential edge cases  
**Future**: Monitor Supabase SDK updates for improvements

```typescript
// Current workaround
cookies: {
  get(name: string) {
    return request.cookies.get(name)?.value
  },
  set(name: string, value: string, options: CookieOptions) {
    response.cookies.set({ name, value, ...options })
  },
  // ...
}
```

### 2. CSS Linter Warning Suppressions

**Location**: `app/globals.css`  
**Reason**: Tailwind v4 directives not recognized  
**Impact**: IDE warnings (cosmetic only)  
**Future**: Wait for CSS linter Tailwind v4 support

```css
/* Expected warnings (safe to ignore) */
@plugin ted warnings (safe to @theme inline ugin;; /* Unknown at ru @apply; /* Unknown at rule */
```

### 3. Environment Variable Type Assertions

**Location**: Various client/server files  
**Reason**: TypeScript doesn't validate `.env` types  
**Impact**: Runtime errors if env vars missing  
**Future**: Implement env validation library

```typescript
// Current (non-ideal)
process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Better (future)
import { env } from "@/lib/env-validation";
env.NEXT_PUBLIC_SUPABASE_URL;
```

## Areas Approved for Refactor

### 1. Component File Organization

**Current State**: Mixed organization patterns  
**Approved Changes**:

- Standardize co-location of related components
- Move shared logic to hooks
- Extract repeated patterns to utilities

**Example**:

```
Before:
components/dashboard/app-header.tsx
components/dashboard/app-header-user-menu.tsx (in same file)

After:
components/dashboard/app-header/
  ├── index.tsx (main component)
  ├── user-menu.tsx (extracted)
  └── notifications.tsx (extracted)
```

### 2. Server Action Organization

**Current State**: Some inline, some in `app/actions/`  
**Approved Changes**:

- Move all Server Actions to `app/actions/` directory
- Group by domain (auth, shipments, fleet, etc.)
- Standardize error handling pattern

**Example**:

```
app/actions/
  ├── auth.ts (sign in, sign up, sign out)
  ├── shipments.ts (create, update, delete)
  ├── tracking.ts (track, update status)
  └── utils.ts (shared validation)
```

### 3. API Response Standardization

**Current State**: Inconsistent response formats  
**Approved Changes**:

- Use helper functions from `lib/api-response.ts`
- Standardize error codes
- Consistent success/error shapes

**Pattern**:

```typescript
// Standardized
return successResponse({ shipment });
return errorResponse("NOT_FOUND", "Shipment not found");
```

### 4. Design System Documentation

**Current State**: Exists but incomplete (`docs/design-system.md`)  
**Approved Changes**:

- Update with current token system
- Add component usage examples
- Document animation patterns
- Include accessibility guidelines

## Security Considerations

### 1. Environment Variables Exposure

**Risk**: Low  
**Status**: Acceptable  
**Details**: Only public Supabase anon key exposed (RLS protected)

### 2. Rate Limiting Missing

**Risk**: Medium  
**Status**: Planned (Phase 2)  
**Details**: Public endpoints vulnerable to abuse

### 3. CSRF Protection

**Risk**: Low  
**Status**: Protected  
**Details**: Server Actions provide built-in CSRF protection

### 4. XSS Vulnerabilities

**Risk**: Low  
**Status**: Protected  
**Details**: React escapes by default, no `dangerouslySetInnerHTML` usage

## Performance Debt

### 1. No Bundle Size Monitoring

**Impact**: Potential bundle bloat over time  
**Plan**: Integrate bundle analyzer in CI/CD

### 2. Missing Performance Budgets

**Impact**: No automated performance regression detection  
**Plan**: Set up Lighthouse CI with budgets

### 3. Unoptimized Database Queries

**Impact**: Slower page loads as data grows  
**Plan**: Add indexes, implement pagination

### 4. No CDN for User Uploads

**Impact**: Slow image loading (future feature)  
**Plan**: Integrate Supabase Storage with CDN

## Deployment Issues

### 1. No Staging Environment

**Risk**: Medium  
**Status**: Production-only deploys  
**Plan**: Create Vercel preview branch for staging

### 2. Manual Deployment Process

**Risk**: Low (GitHub integration)  
**Status**: Automatic on push to main  
**Plan**: Add deployment checks and rollback mechanism

### 3. Missing Health Checks

**Risk**: Low  
**Status**: Relies on Vercel monitoring  
**Plan**: Implement `/api/health` endpoint with status checks

## Documentation Gaps

### 1. No Onboarding Guide

**Impact**: New developers need guidance  
**Plan**: Create `CONTRIBUTING.md` with setup steps

### 2. Missing API Documentation

**Impact**: No OpenAPI spec for external consumers  
**Plan**: Generate OpenAPI spec from route handlers

### 3. Incomplete Component Documentation

**Impact**: Component usage unclear  
**Plan**: Add Storybook or similar documentation tool

## Monitoring Gaps

### 1. No User Analytics

**Status**: Planned (Phase 2)  
**Tools**: PostHog or Vercel Analytics

### 2. Limited Error Context

**Status**: Sentry configured but not exhaustive  
**Plan**: Add more breadcrumbs and context

### 3. No Performance Metrics

**Status**: Vercel Analytics basic metrics only  
**Plan**: Add custom performance marks

## Future Refactoring Targets

### Phase 2 (Next 3 Months)

- Implement comprehensive test suite
- Add rate limiting
- Complete mobile responsiveness
- Set up staging environment
- Database migration system

### Phase 3 (6 Months)

- Accessibility compliance audit
- Performance optimization pass
- Documentation site (Storybook)
- Advanced monitoring and alerting
- Internationalization (i18n)

## Rules for Refactoring

### ✅ Approved

- Fix color system violations
- Improve type safety
- Extract repeated logic
- Add error boundaries
- Implement accessibility fixes
- Optimize performance

### ⚠️ Requires Discussion

- Breaking API changes
- Major dependency updates
- Database schema changes
- Authentication flow changes

### ❌ Not Allowed

- Removing existing functionality
- Breaking changes without migration path
- Introducing new major dependencies without approval
- Disabling security features

## Reporting New Issues

### Process

1. Document in this file
2. Create GitHub issue (if applicable)
3. Tag with priority (High/Medium/Low)
4. Assign to milestone (Phase 2/3)
5. Link related files and context

### Template

```markdown
### Issue Name

**Priority**: High/Medium/Low
**Impact**: Description
**Status**: Not Started/In Progress/Blocked

**Details**: Full description

**Files Affected**:

- path/to/file.ts

**Proposed Solution**:
Code or approach

**Dependencies**:

- Related issue #123
```
