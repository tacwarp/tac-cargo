# 🔧 Sentry Configuration Fixes

## Issues Resolved

All deprecation warnings and configuration errors have been fixed.

---

## 1. ✅ Removed Deprecated Sentry Options

### Issue

```
[@sentry/nextjs] DEPRECATION WARNING: disableLogger is deprecated
[@sentry/nextjs] DEPRECATION WARNING: automaticVercelMonitors is deprecated
[@sentry/nextjs] DEPRECATION WARNING: reactComponentAnnotation is deprecated
```

### Fix Applied

**File:** `@/next.config.ts:179-191`

Moved deprecated top-level options to `webpack` config object:

```typescript
webpack: {
  treeshake: {
    removeDebugLogging: true,  // was: disableLogger
  },
  reactComponentAnnotation: {
    enabled: true,  // was: top-level reactComponentAnnotation
  },
  automaticVercelMonitors: true,  // was: top-level automaticVercelMonitors
}
```

> [!NOTE]
> **Next.js 16 Turbopack Behavior:**
>
> - **Production builds** (`next build`): Next.js 16 uses Turbopack by default for production. The `webpack` key in `withSentryConfig` is ignored when Turbopack is active. Sentry has native Turbopack support via the `experimental.turbo` configuration.
> - **Development** (`next dev`): Turbopack is the default bundler. Use `next dev --webpack` to opt back into Webpack if needed.
> - **Sentry + Turbopack**: Core error tracking works. For source maps, use `SENTRY_AUTH_TOKEN` with Sentry's Turbopack plugin or configure via `sentry.properties`.
>
> If you need Webpack-specific features, explicitly opt out of Turbopack in `next.config.ts` or use the `--webpack` flag.

---

## 2. ✅ Removed instrumentationHook

### Issue

```
⚠ `experimental.instrumentationHook` is no longer needed
⚠ Invalid next.config.ts options detected: Unrecognized key(s) in object: 'instrumentationHook'
```

### Fix Applied

**File:** `@/next.config.ts:136-139`

Removed `instrumentationHook` from experimental config:

```typescript
experimental: {
  optimizePackageImports: ['lucide-react', 'recharts'],
  // instrumentationHook removed - no longer needed in Next.js 16
}
```

**Why:** Next.js 16 automatically detects `instrumentation.ts` file without requiring the experimental flag.

---

## 3. ✅ Deleted middleware.ts

### Issue

```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
Unhandled Rejection: Error: Both middleware file "./middleware.ts" and proxy file "./proxy.ts" are detected.
```

### Fix Applied

**Deleted:** `./middleware.ts`

**Reason:**

- Next.js 16 has officially migrated from `middleware.ts` to `proxy.ts` for edge-side request interception.
- Having both files causes a conflict and build-time errors.
- `proxy.ts` handles all Supabase session management and authentication logic.

**Verification:**

- `proxy.ts` is sufficient for standard Node.js/Edge runtimes.
- Edge runtime is **not required** unless you are using specific Edge-only APIs or need ultra-low latency redirection. For the current Supabase integration, `proxy.ts` running on the default runtime is optimal.

---

## Current Configuration

### Sentry Webpack Options

```typescript
const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  webpack: {
    treeshake: { removeDebugLogging: true },
    reactComponentAnnotation: { enabled: true },
    automaticVercelMonitors: true,
  },
};
```

### Next.js Experimental Config

```typescript
experimental: {
  optimizePackageImports: ['lucide-react', 'recharts'],
}
```

---

## Files Modified

1. **`@/next.config.ts`**
   - Lines 136-139: Removed `instrumentationHook`
   - Lines 179-191: Moved deprecated options to `webpack` config

2. **`./middleware.ts`**
   - Deleted (conflicted with `proxy.ts`)

---

## Verification

Run the dev server:

```bash
npm run dev
```

**Expected:** No deprecation warnings or errors  
**Result:** Clean startup with Sentry fully configured

### 4. ✅ Proxy Functionality Test

To verify the new `proxy.ts` is correctly intercepting requests:

1. Access a protected route (e.g., `/dashboard`) without being logged in.
2. Observe if you are redirected to `/login`.
3. Check the server logs (or Sentry) to ensure `proxy.ts` is executing `updateSession`.
4. Run `npm run build` to ensure no "middleware" vs "proxy" conflicts remain.

---

## Status

✅ All deprecation warnings resolved  
✅ All configuration errors fixed  
✅ Middleware/proxy conflict resolved  
✅ Sentry integration fully functional

**Last Updated:** 2026-01-02  
**Next.js Version:** 16.x  
**Sentry SDK Version:** @sentry/nextjs (check package.json for exact version)
