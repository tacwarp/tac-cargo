# Routing & Navigation Rules

## Route Structure

### Public Routes (Unauthenticated)
```
/ (Landing page)
/login (Authentication)
/auth/callback (OAuth callback)
/test-sentry (Error testing - dev only)
```

### Protected Routes (Authenticated)
```
/dashboard (Main dashboard)
```

### API Routes
```
GET  /api/track (Shipment tracking)
POST /api/tracking (Legacy tracking endpoint)
POST /api/mcp (Model Context Protocol handler)
GET  /api/test-sentry (Sentry error test)
```

## Route Groups

### `(dashboard)` Group
**Purpose**: Shared layout for authenticated pages  
**Layout**: `app/(dashboard)/layout.tsx`  
**Protection**: Middleware-enforced authentication

**Features**:
- Sidebar navigation
- Header with user profile
- Theme toggle
- Scroll container management

**URL Pattern**: `/dashboard/*` (parentheses removed from URL)

## Route Protection

### Middleware-Based Protection
**File**: `middleware.ts` (root level)

**Logic**:
1. Check Supabase session cookie
2. If no session → redirect to `/login`
3. If session exists → allow access
4. Refresh token if near expiry

**Protected Patterns**:
```typescript
export const config = {
  matcher: [
    '/dashboard/:path*',
    // Add future protected routes here
  ]
}
```

### Route Handler Protection
**API routes** must validate session manually:
```typescript
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Handle authenticated request
}
```

## Dynamic Routes

### Current: None
**Future**: Dynamic shipment pages
```
/tracking/[shipmentId] (future)
/dashboard/shipment/[id] (future)
```

### Pattern Rules
- Use `[param]` for required segments
- Use `[[param]]` for optional segments
- Use `[...slug]` for catch-all segments
- Use `[[...slug]]` for optional catch-all

## Redirect Rules

### Configured Redirects (`next.config.ts`)
```typescript
{
  source: '/home',
  destination: '/',
  permanent: true
}
```

### Authentication Redirects
```
Unauthenticated → /login?redirect=/dashboard
After login → /dashboard (or redirect param)
After logout → /
```

### Error Redirects
- 404 → Custom not-found page (future)
- 500 → Global error boundary
- Auth error → /login with error message

## Layout Nesting

### Hierarchy
```
Root Layout (app/layout.tsx)
│
├─ Fonts: Geist Sans, Geist Mono, Playfair Display
├─ Theme Provider (next-themes)
├─ Toast notifications (Sonner)
└─ Global CSS
    │
    └─ Dashboard Layout (app/(dashboard)/layout.tsx)
        │
        ├─ App Shell (sidebar + main content)
        ├─ Auth validation
        └─ Error boundary
            │
            └─ Dashboard Page (app/(dashboard)/dashboard/page.tsx)
```

### Layout Responsibilities

#### Root Layout
- Font loading
- Theme provider initialization
- Global meta tags
- Analytics initialization (future)
- Error boundary (global-error.tsx)

#### Dashboard Layout
- Authentication check
- Sidebar navigation
- Header with user info
- Main content scroll area
- Page-level error boundary

### Layout Rules
1. Layouts persist across navigation
2. Layouts can fetch data (Server Components)
3. Layouts cannot access URL params (use `page.tsx`)
4. Layouts share state via Context only when necessary

## Loading States

### Page Loading
**File**: `loading.tsx` (co-located with page)

**Pattern**:
```tsx
// app/(dashboard)/dashboard/loading.tsx
export default function Loading() {
  return <DashboardSkeleton />
}
```

**Behavior**:
- Shown during Suspense fallback
- Server-rendered on initial load
- Client-rendered during navigation

### Streaming
**Not currently used**  
**Future**: Stream data-heavy components
```tsx
<Suspense fallback={<Skeleton />}>
  <DataHeavyComponent />
</Suspense>
```

## Error Boundaries

### Page-Level Error
**File**: `error.tsx` (co-located with page)

**Requirements**:
- Must be Client Component (`'use client'`)
- Receives `error` and `reset` props
- Can trigger recovery via `reset()`

**Example**:
```tsx
'use client'
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### Global Error
**File**: `global-error.tsx` (root level)

**Purpose**: Catch errors in root layout
**Usage**: Rare; most errors caught by page-level boundaries

## Navigation Methods

### Server-Side (Preferred)
```tsx
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await validateSession()
  if (!session) redirect('/login')
  // ...
}
```

### Client-Side
```tsx
'use client'
import { useRouter } from 'next/navigation'

export function Component() {
  const router = useRouter()
  
  function navigate() {
    router.push('/dashboard')
    // router.replace('/dashboard') // No history entry
    // router.back() // Browser back
  }
}
```

### Link Component
```tsx
import Link from 'next/link'

<Link href="/dashboard" prefetch={true}>
  Dashboard
</Link>
```

**Prefetch Behavior**:
- `prefetch={true}` (default): Prefetch on hover/viewport
- `prefetch={false}`: No prefetch
- Static routes always prefetched in production

## Parallel Routes
**Not currently used**  
**Future**: Modal routing pattern
```
/dashboard/@modal/[shipmentId]
```

## Intercepting Routes
**Not currently used**  
**Future**: Intercept navigation for modals
```
/dashboard/(.)shipment/[id]
```

## Route Handlers (API Routes)

### HTTP Methods
```typescript
// app/api/track/route.ts
export async function GET(request: Request) { }
export async function POST(request: Request) { }
export async function PUT(request: Request) { }
export async function DELETE(request: Request) { }
export async function PATCH(request: Request) { }
```

### Request Handling
```typescript
// Query params
const { searchParams } = new URL(request.url)
const id = searchParams.get('id')

// Body parsing
const body = await request.json()

// Headers
const auth = request.headers.get('authorization')
```

### Response Handling
```typescript
// JSON response
return Response.json({ data: 'value' }, { status: 200 })

// Error response
return new Response('Not Found', { status: 404 })

// Redirect
return Response.redirect('https://example.com')
```

### CORS Configuration
**Handled in**: `next.config.ts` headers

```typescript
{
  source: '/api/:path*',
  headers: [
    { key: 'Access-Control-Allow-Origin', value: '*' },
    { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
  ]
}
```

## Navigation State

### Active Link Detection
```tsx
'use client'
import { usePathname } from 'next/navigation'

export function NavLink({ href, children }) {
  const pathname = usePathname()
  const isActive = pathname === href
  
  return (
    <Link 
      href={href}
      className={isActive ? 'active' : ''}
    >
      {children}
    </Link>
  )
}
```

### Loading State
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function NavButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  return (
    <button
      onClick={() => {
        startTransition(() => {
          router.push('/dashboard')
        })
      }}
      disabled={isPending}
    >
      {isPending ? 'Loading...' : 'Navigate'}
    </button>
  )
}
```

## URL Parameters

### Search Params (Server)
```tsx
// app/dashboard/page.tsx
export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const filter = searchParams.filter
  // ...
}
```

### Search Params (Client)
```tsx
'use client'
import { useSearchParams } from 'next/navigation'

export function FilterComponent() {
  const searchParams = useSearchParams()
  const filter = searchParams.get('filter')
  // ...
}
```

### Updating Search Params
```tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export function FilterButton() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  function updateFilter(value: string) {
    const params = new URLSearchParams(searchParams)
    params.set('filter', value)
    router.push(`/dashboard?${params.toString()}`)
  }
}
```

## Route Metadata

### Static Metadata
```tsx
// app/dashboard/page.tsx
export const metadata = {
  title: 'Dashboard | TAC Cargo',
  description: 'Logistics operations dashboard',
}
```

### Dynamic Metadata
```tsx
export async function generateMetadata({ params }) {
  return {
    title: `Shipment ${params.id} | TAC Cargo`,
  }
}
```

## Caching & Revalidation

### Route Segment Config
```tsx
// app/dashboard/page.tsx
export const revalidate = 60 // ISR: revalidate every 60 seconds
export const dynamic = 'force-dynamic' // Always SSR
export const runtime = 'edge' // Edge runtime
```

### Options
- `revalidate: number` - ISR interval
- `revalidate: false` - Cache indefinitely (default)
- `dynamic: 'auto' | 'force-dynamic' | 'error' | 'force-static'`
- `runtime: 'nodejs' | 'edge'`

## Future Route Plans

### Phase 2
```
/tracking/[id] - Public shipment tracking
/dashboard/shipments - Shipment list
/dashboard/fleet - Fleet management
/dashboard/settings - User settings
```

### Phase 3
```
/dashboard/reports - Analytics reports
/dashboard/invoices - Billing
/admin/* - Admin panel (super users)
```

## Navigation Rules Summary

### ✅ Do
- Use `<Link>` for client-side navigation
- Prefetch critical routes
- Use middleware for auth checks
- Return proper HTTP status codes
- Use route groups for shared layouts

### ❌ Don't
- Use `<a>` tags for internal navigation
- Client-side navigate on initial load
- Duplicate auth logic across pages
- Mix authentication methods
- Create circular redirects
