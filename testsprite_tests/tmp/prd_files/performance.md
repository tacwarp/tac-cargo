# Performance & Non-Functional Requirements

## SSR / SSG Strategy

### Default: Server-Side Rendering (SSR)

**All pages render on-demand** unless explicitly configured otherwise

```tsx
// Default behavior - SSR
export default async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}
```

### Static Site Generation (SSG)

**For content that rarely changes**

```tsx
// Static at build time
export const dynamic = "force-static";

export default async function Page() {
  const data = await fetchStaticData();
  return <Component data={data} />;
}
```

**Use cases**:

- Landing page (`/`)
- Marketing pages
- Documentation pages
- Terms of Service / Privacy Policy

### Incremental Static Regeneration (ISR)

**For dashboards and data pages**

```tsx
// Revalidate every 60 seconds
export const revalidate = 60;

export default async function DashboardPage() {
  const stats = await fetchStats();
  return <Dashboard stats={stats} />;
}
```

**Use cases**:

- Dashboard page (`/dashboard`)
- Analytics pages
- Shipment lists
- Fleet status pages

### Dynamic Rendering (Force SSR)

**For user-specific content**

```tsx
// Always SSR, never cache
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  return <Profile user={user} />;
}
```

**Use cases**:

- User profile pages
- Settings pages
- Real-time tracking pages

## Bundle Size Constraints

### Per-Route Targets

- **Initial JavaScript**: <50KB (gzipped)
- **Total JavaScript**: <200KB for dashboard routes
- **CSS**: <20KB per route (Tailwind optimized)

### Measurement

```bash
# Build and analyze
npm run build

# Check .next/server/pages/ and .next/static/ sizes
```

### Bundle Analysis (Future)

```bash
npm install --save-dev @next/bundle-analyzer

# next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)

# Analyze
ANALYZE=true npm run build
```

## Code Splitting

### Automatic Code Splitting

**Next.js splits by route automatically**

- Each page = separate bundle
- Shared code = common chunks
- Third-party libraries = vendor chunks

### Dynamic Imports

**For heavy components**

```tsx
import dynamic from "next/dynamic";

// Client-side only, lazy loaded
const HeavyChart = dynamic(() => import("@/components/heavy-chart"), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Don't render on server
});

export function Dashboard() {
  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart />
      </Suspense>
    </div>
  );
}
```

**Use for**:

- Large charting libraries (Recharts, Nivo)
- Code editors
- PDF viewers
- Lottie animations
- Map components

### Package Optimization

**Configured in `next.config.ts`**

```typescript
experimental: {
  optimizePackageImports: [
    'lucide-react',
    'recharts',
    '@remixicon/react',
    'framer-motion',
    '@radix-ui/react-icons',
  ],
}
```

**Effect**: Only imports used icons/components, not entire library

## Image Optimization

### Next.js Image Component (Required)

```tsx
import Image from "next/image";

<Image
  src="/hero.jpg"
  alt="Description"
  width={1200}
  height={630}
  priority={false} // true for above-fold images
  loading="lazy" // Default
  placeholder="blur" // Optional: show blur while loading
  blurDataURL="data:image/..." // Base64 blur
/>;
```

### Image Formats

**Automatic format selection**:

- WebP (primary)
- AVIF (if browser supports)
- Original format (fallback)

**Configured in `next.config.ts`**:

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'cdn.shadcnstudio.com',
    },
  ],
}
```

### Image Sizing Rules

- **Hero images**: Max 1920x1080, optimized <200KB
- **Thumbnails**: Max 400x400, <50KB
- **Icons**: SVG preferred, or optimized PNG <10KB
- **Logos**: SVG only

### Lazy Loading

```tsx
// Above-fold (load immediately)
<Image src="/hero.jpg" priority={true} />

// Below-fold (lazy load)
<Image src="/feature.jpg" loading="lazy" />
```

## Font Optimization

### Next.js Font Loading

**Configured in `app/layout.tsx`**

```tsx
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevent FOIT (Flash of Invisible Text)
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});
```

**Benefits**:

- Fonts self-hosted (no Google Fonts request)
- Automatic font subsetting
- Preloaded in `<head>`
- CSS size-adjust optimization

### Font Loading Strategy

- `display: "swap"` - Show fallback, swap when loaded
- Preload critical fonts
- Subset to Latin characters only

## Animation Performance

### Hardware Acceleration

**Use transform and opacity only**

```tsx
// ✅ Good: GPU-accelerated properties
<motion.div
  animate={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.3 }}
/>

// ❌ Bad: Triggers layout recalculation
<motion.div
  animate={{ width: 300, marginLeft: 20 }}
/>
```

### Framer Motion Optimization

```tsx
import { motion, useReducedMotion } from "framer-motion";

export function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.5,
      }}
    />
  );
}
```

### Animation Constraints

- **Duration**: 200-500ms for UI transitions
- **Max concurrent animations**: 3
- **FPS target**: 60fps (16.67ms frame budget)
- **Respect prefers-reduced-motion**: Always

### CSS Animations

**Prefer CSS over JavaScript when possible**

```css
/* ✅ Good: CSS animation */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Lottie Animations

**Lazy load and control playback**

```tsx
"use client";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function AnimatedIcon() {
  return (
    <Lottie
      animationData={parcelAnimation}
      loop={false}
      autoplay={true}
      style={{ width: 100, height: 100 }}
    />
  );
}
```

**Rules**:

- Minify JSON files
- Use segments for partial playback
- Stop when off-screen
- Max file size: 100KB

## Web Vitals Targets

### Core Web Vitals (Google)

#### Largest Contentful Paint (LCP)

**Target**: <2.5s  
**Current**: TBD (measure in production)

**Optimization**:

- Preload hero images with `priority={true}`
- Optimize image sizes
- Use CDN for static assets
- Minimize render-blocking resources

#### First Input Delay (FID)

**Target**: <100ms  
**Current**: TBD

**Optimization**:

- Minimize JavaScript execution time
- Use `useTransition` for non-urgent updates
- Defer non-critical JavaScript
- Break up long tasks

#### Cumulative Layout Shift (CLS)

**Target**: <0.1  
**Current**: TBD

**Optimization**:

- Set width/height on images
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use `transform` instead of `top/left`

### Additional Metrics

#### Time to First Byte (TTFB)

**Target**: <800ms  
**Current**: TBD

**Optimization**:

- Use Edge Runtime for API routes
- Enable HTTP/2
- Optimize database queries
- Use connection pooling

#### Total Blocking Time (TBT)

**Target**: <200ms  
**Current**: TBD

**Optimization**:

- Code splitting
- Defer non-critical scripts
- Minimize main thread work

## Caching Strategy

### Static Assets

**Configured in `next.config.ts`**

```typescript
async headers() {
  return [
    {
      source: '/lottie/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ]
}
```

**Cache durations**:

- Images: 1 year (immutable)
- JavaScript: 1 year (content-hashed)
- CSS: 1 year (content-hashed)
- Fonts: 1 year (immutable)

### API Responses

```typescript
// Route handler caching
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  const data = await fetchData();

  return Response.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
```

### Database Query Optimization

**Use Supabase's caching**

```typescript
// Cache query result
const { data } = await supabase.from("shipments").select("*").limit(10);

// Server Component revalidation
export const revalidate = 60;
```

## Runtime Optimization

### React Server Components

**Minimize client-side JavaScript**

```tsx
// ✅ Good: Server Component (no client bundle)
export default async function Page() {
  const data = await fetchData();
  return <StaticDisplay data={data} />;
}

// ❌ Bad: Unnecessary Client Component
("use client");
export default function Page() {
  const [data, setData] = useState();
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  return <StaticDisplay data={data} />;
}
```

### Streaming and Suspense

**Load critical content first**

```tsx
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      {/* Critical content loads immediately */}
      <Header />

      {/* Non-critical content streams in */}
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <Charts />
      </Suspense>
    </div>
  );
}
```

### Parallel Data Fetching

```tsx
export default async function Page() {
  // Fetch in parallel (not sequential)
  const [stats, shipments, fleet] = await Promise.all([
    fetchStats(),
    fetchShipments(),
    fetchFleet(),
  ]);

  return <Dashboard stats={stats} shipments={shipments} fleet={fleet} />;
}
```

## Monitoring

### Sentry Performance

**Enabled in all environments**

**Metrics tracked**:

- Page load time
- API response time
- Database query duration
- Error rate

**Configuration** (`sentry.client.config.ts`):

```typescript
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% of transactions
  profilesSampleRate: 0.1,
});
```

### Vercel Analytics (Future)

**Real user monitoring**

**Metrics**:

- Web Vitals
- Page views
- User flows
- Geographic distribution

### Custom Performance Marks

```tsx
"use client";
export function Component() {
  useEffect(() => {
    performance.mark("component-mounted");

    return () => {
      performance.measure("component-lifetime", "component-mounted");
    };
  }, []);
}
```

## Database Performance

### Query Optimization

```typescript
// ✅ Good: Select only needed columns
const { data } = await supabase
  .from("shipments")
  .select("id, status, tracking_id")
  .limit(20);

// ❌ Bad: Select all columns
const { data } = await supabase.from("shipments").select("*");
```

### Indexing

**Required indexes** (Supabase):

- `tracking_id` (unique, frequently queried)
- `user_id` (for RLS filtering)
- `status` (for filtering)
- `created_at` (for sorting)

### Connection Pooling

**Handled by Supabase automatically**

- Max connections: 15 (default)
- Pool mode: Transaction

## Deployment Optimization

### Vercel Configuration

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["iad1"], // US East (closest to Supabase)
  "functions": {
    "app/api/**": {
      "maxDuration": 10
    }
  }
}
```

### Build Optimization

```bash
# Production build
NODE_ENV=production npm run build

# Check build output
# .next/analyze/ (if bundle analyzer enabled)
```

### Edge Runtime (Future)

```tsx
export const runtime = "edge";

export async function GET() {
  // Runs on Vercel Edge Network
  // Lowest latency, closest to user
}
```

**Use cases**:

- API routes with simple logic
- Redirects
- A/B testing
- Geolocation-based routing

## Browser Support

### Target Browsers

- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions (iOS included)
- No IE11

### Polyfills

**None required** for target browsers

**If needed** (future):

```bash
npm install core-js
```

### Feature Detection

```tsx
"use client";
export function Component() {
  const supportsWebP =
    typeof window !== "undefined" &&
    document
      .createElement("canvas")
      .toDataURL("image/webp")
      .indexOf("data:image/webp") === 0;

  return <Image format={supportsWebP ? "webp" : "jpg"} />;
}
```

## Progressive Enhancement

### JavaScript Disabled

**Core functionality works without JS**:

- Navigation (via `<Link>`)
- Forms (via Server Actions)
- Content display

**Enhanced with JS**:

- Real-time updates
- Animations
- Client-side filtering

### Example

```tsx
// Works without JavaScript
<form action={serverAction}>
  <input name="email" type="email" required />
  <button type="submit">Subscribe</button>
</form>

// Enhanced with JavaScript
'use client'
<form action={serverAction} onSubmit={handleOptimisticUpdate}>
  <input name="email" type="email" required />
  <button type="submit" disabled={isPending}>
    {isPending ? 'Subscribing...' : 'Subscribe'}
  </button>
</form>
```

## Performance Budget

### Enforced Limits

- **Initial Load**: <2s on 4G (mobile)
- **Time to Interactive**: <3s
- **JavaScript**: <200KB total per route
- **CSS**: <50KB total
- **Images**: Lazy loaded below fold

### Monitoring

```bash
# Lighthouse CI (future)
npm install --save-dev @lhci/cli

# Run audit
lhci autorun --collect.url=http://localhost:3000
```

## Optimization Checklist

### Build Time

- ✅ Tree shaking enabled (automatic)
- ✅ Minification enabled (production)
- ✅ Source maps generated (Sentry)
- ✅ Package optimization configured

### Runtime

- ✅ Server Components by default
- ✅ Dynamic imports for heavy components
- ✅ Image optimization via next/image
- ✅ Font optimization via next/font
- ✅ ISR for dashboards (60s revalidation)

### Network

- ✅ HTTP/2 enabled (Vercel)
- ✅ Gzip compression enabled
- ✅ Static asset caching (1 year)
- ✅ API response caching (60s)

### User Experience

- ✅ Loading states for async operations
- ✅ Error boundaries for failures
- ✅ Skeleton loaders for placeholders
- ✅ Reduced motion support

## Future Optimizations

### Phase 2

- Bundle analyzer integration
- Real User Monitoring (RUM)
- Service Worker for offline support
- Prefetch critical routes

### Phase 3

- Edge Runtime for API routes
- Advanced caching strategies
- WebAssembly for heavy computations
- HTTP/3 (QUIC)

## Rules Summary

### ✅ Required

- Use Server Components by default
- Lazy load heavy components
- Set width/height on images
- Use next/image for all images
- Implement loading states
- Cache API responses
- Monitor Web Vitals

### ❌ Forbidden

- Large synchronous imports
- Layout shifts
- Unoptimized images
- Blocking resources above fold
- Heavy animations on mobile
- Unnecessary client-side JavaScript

### 🎯 Targets

- LCP: <2.5s
- FID: <100ms
- CLS: <0.1
- TTFB: <800ms
- Bundle: <200KB per route
