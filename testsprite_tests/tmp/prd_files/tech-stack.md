# Tech Stack & Constraints

## Framework

**Next.js 16.1.1** (App Router)

- React Server Components (RSC) by default
- Server Actions for mutations
- Streaming and Suspense boundaries
- Route handlers for API endpoints

## TypeScript

**Version**: 5.x  
**Strictness**: Full strict mode enabled

```json
{
  "strict": true,
  "noEmit": true,
  "isolatedModules": true
}
```

**Requirements**:

- All files must be `.tsx` or `.ts`
- No `any` types without explicit justification
- Props must be typed with interfaces or type aliases
- Return types required for exported functions

## Styling System

### Tailwind CSS v4

- **PostCSS-based compilation**
- Utility-first approach mandatory
- Custom `@theme inline` directives
- No CSS Modules or styled-components

### Color System

- **Format**: OKLCH exclusively
- **Theme**: CSS custom properties with `.dark` class
- **Provider**: `next-themes` for theme switching
- **Zero hardcoded colors** - semantic tokens only

### Component Library

**shadcn/ui** (Radix UI primitives + Tailwind)

- Copy-paste component pattern (not installed via npm)
- Customized via `components.json`
- Located in `components/ui/`
- Built on Radix UI primitives

## State Management

### Server State

- React Server Components (default)
- Server Actions for mutations
- No client-side state where avoidable

### Client State

- **TanStack Query v5** for server state synchronization
- **Zustand v5** for minimal client-only state
- Context API for theme and auth providers only
- No Redux or MobX

### Form State

- **react-hook-form v7** with Zod validation
- Server Actions for submission
- Progressive enhancement where possible

## Data Fetching Strategy

### Default: Server Components

```tsx
// Preferred pattern
async function Page() {
  const data = await fetchData(); // Direct fetch in RSC
  return <Component data={data} />;
}
```

### Client Components

```tsx
// Use TanStack Query for client-side fetching
"use client";
import { useQuery } from "@tanstack/react-query";
```

### Revalidation

- **ISR**: `revalidate: 60` for dashboards
- **On-demand**: `revalidateTag()` for mutations
- **Real-time**: Supabase Realtime for tracking updates

## Backend & Database

### Supabase

- **Auth**: Email/password + OAuth providers
- **Database**: PostgreSQL with Row-Level Security (RLS)
- **Storage**: File uploads (future)
- **Realtime**: WebSocket subscriptions for live updates

### MCP Server

Custom Model Context Protocol server for shipment data:

- Located in `lib/mcp/shipment-server.ts`
- Provides AI-accessible shipment tools
- Used for chatbot and automation

## Authentication

- **Provider**: Supabase Auth
- **Session Strategy**: Server-side cookies via `@supabase/ssr`
- **Middleware**: Route protection in `middleware.ts`
- **PKCE flow**: Enabled for security

## Deployment

### Target Platform

**Vercel** (primary)

- Edge Runtime for middleware
- Node.js Runtime for API routes
- Automatic SSL and CDN
- Environment variables via `.env.local`

### Build Optimizations

- React Compiler (future)
- Image optimization via `next/image`
- Font optimization via `next/font`
- Bundle analysis via `@next/bundle-analyzer`

## Performance Constraints

### Bundle Size

- **Initial JS**: <50KB per route
- **Total JS**: <200KB for dashboard
- **Images**: WebP/AVIF only, lazy-loaded

### Rendering Strategy

- **Landing pages**: Static Generation (SSG)
- **Dashboard**: Server-Side Rendering (SSR) with ISR
- **API routes**: Edge Runtime where possible

### Web Vitals Targets

- **LCP**: <2.5s
- **FID**: <100ms
- **CLS**: <0.1
- **TTFB**: <800ms

## Browser Support

- **Modern browsers**: Last 2 versions
- **Chrome/Edge**: 90+
- **Firefox**: 88+
- **Safari**: 15+
- **No IE11 support**

### Progressive Enhancement

- Core functionality works without JavaScript
- Forms submit via native HTML
- Links work without client-side routing

## Monitoring & Analytics

### Error Tracking

**Sentry v10**

- Client, server, and edge instrumentation
- Source maps uploaded during build
- Tunnel route: `/monitoring`
- Performance monitoring enabled

### Logging

- Server-side: `lib/logger.ts` (custom Winston-based)
- Client-side: Sentry breadcrumbs
- No `console.log` in production

### Analytics

- **Future**: Vercel Analytics
- **Future**: PostHog for product analytics

## Development Tools

### Package Manager

**npm** (not pnpm or yarn)

### Linting

- ESLint 9 with Next.js config
- Custom rules in `eslint.config.mjs`

### Type Checking

- Pre-commit type check required
- CI/CD type validation

### Git Workflow

- **Main branch**: `main` (production)
- **Feature branches**: `feature/[name]`
- **Commit format**: Conventional Commits
- **PR required**: Branch protection enabled

## Environment Variables

### Required

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=
```

### Optional

```env
SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Dependencies Philosophy

- Prefer native Web APIs over libraries
- Use Radix UI primitives (not Material-UI or Ant Design)
- Minimize client-side JavaScript
- Tree-shakeable imports only
- No moment.js (use date-fns)
- No lodash (use native methods)

## Security Requirements

- All forms: CSRF protection via Server Actions
- All inputs: XSS sanitization
- All API calls: Rate limiting (future)
- All cookies: HttpOnly, Secure, SameSite
- Headers: Strict CSP and HSTS (see `next.config.ts`)

## Constraints Summary

❌ **Forbidden**:

- CSS-in-JS libraries (styled-components, emotion)
- Class-based React components
- Default exports (except pages/layouts)
- Barrel exports (`index.ts` files)
- Hardcoded color values
- Client Components for data fetching (unless interactive)

✅ **Required**:

- Named exports
- Server Components by default
- OKLCH colors via semantic tokens
- TypeScript strict mode
- Accessibility attributes (ARIA)
