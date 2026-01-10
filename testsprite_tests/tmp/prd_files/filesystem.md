# File System & Folder Architecture

## Root Structure

```
tac-cargo/
├── app/                    # Next.js App Router
├── components/             # React components
├── docs/                   # Project documentation
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and shared logic
├── public/                 # Static assets
├── types/                  # TypeScript definitions
├── database/               # Database migrations and schemas
├── .env.example            # Environment template
├── .env.local              # Local environment (gitignored)
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind configuration
└── package.json            # Dependencies
```

## `/app` Structure (App Router)

### Route Groups

```
app/
├── (dashboard)/            # Authenticated dashboard layout
│   ├── layout.tsx          # Dashboard shell with sidebar
│   ├── dashboard/
│   │   └── page.tsx        # Main dashboard (/dashboard)
│   └── error.tsx           # Error boundary
│
├── api/                    # API route handlers
│   ├── track/
│   │   └── route.ts        # Tracking endpoint
│   ├── tracking/
│   │   └── route.ts        # Legacy tracking
│   ├── mcp/
│   │   └── route.ts        # MCP protocol handler
│   └── test-sentry/
│       └── route.ts        # Sentry test endpoint
│
├── auth/
│   └── callback/
│       └── route.ts        # OAuth callback handler
│
├── login/
│   └── page.tsx            # Login page
│
├── test-sentry/
│   └── page.tsx            # Sentry error testing
│
├── layout.tsx              # Root layout (fonts, theme provider)
├── page.tsx                # Landing page (/)
├── globals.css             # Global styles and design tokens
├── global-error.tsx        # Global error boundary
└── not-found.tsx           # 404 page (future)
```

### Layout Hierarchy

```
Root Layout (app/layout.tsx)
  ├─ Landing Page (app/page.tsx)
  ├─ Login (app/login/page.tsx)
  └─ Dashboard Layout (app/(dashboard)/layout.tsx)
      └─ Dashboard Page (app/(dashboard)/dashboard/page.tsx)
```

## `/components` Structure

### Organization by Purpose

```
components/
├── ui/                     # shadcn/ui primitives (copy-paste)
│   ├── button.tsx          # Base button component
│   ├── card.tsx            # Card primitive
│   ├── dialog.tsx          # Modal/dialog
│   ├── input.tsx           # Form input
│   ├── scroll-area.tsx     # Custom scrollbar
│   ├── sidebar.tsx         # Sidebar primitive
│   ├── skeleton.tsx        # Loading skeleton
│   ├── tabs.tsx            # Tab navigation
│   └── theme-safe-animation.tsx  # Animation wrapper
│
├── dashboard/              # Dashboard-specific features
│   ├── app-header.tsx      # Top navigation bar
│   ├── app-shell.tsx       # Main layout shell
│   ├── app-sidebar.tsx     # Left navigation sidebar
│   ├── stats-overview.tsx  # KPI cards
│   └── theme-toggle.tsx    # Theme switcher button
│
├── landing/                # Landing page sections
│   ├── navbar.tsx          # Marketing navigation
│   ├── hero.tsx            # Hero section
│   ├── hero-section.tsx    # Alternative hero
│   ├── services.tsx        # Services grid
│   ├── about.tsx           # About section
│   ├── process.tsx         # Process timeline
│   ├── testimonials.tsx    # Client testimonials
│   ├── tracking-section.tsx # Tracking demo
│   ├── core-competencies.tsx
│   ├── operational-logic.tsx
│   ├── stats-cta.tsx
│   ├── trusted-by.tsx
│   ├── chat-widget.tsx     # Customer support chat
│   ├── chat-widget-v2.tsx  # Enhanced chat
│   ├── footer.tsx          # Footer
│   └── cta.tsx             # Call-to-action
│
├── tracking/               # Shipment tracking features
│   ├── tracking-form.tsx   # Search by tracking ID
│   └── tracker-card.tsx    # Shipment status card
│
├── shadcn-studio/          # Pre-built dashboard blocks
│   └── blocks/
│       ├── chart-sales-metrics.tsx
│       ├── datatable-transaction.tsx
│       ├── dropdown-profile.tsx
│       ├── statistics-card-01.tsx
│       ├── widget-product-insights.tsx
│       └── widget-total-earning.tsx
│
├── providers/              # Context providers
│   └── theme-provider.tsx  # next-themes wrapper
│
├── nav-main.tsx            # Main navigation links
├── nav-secondary.tsx       # Secondary navigation
└── nav-user.tsx            # User profile dropdown
```

### Component Categories

#### 1. UI Primitives (`components/ui/`)

- **Source**: shadcn/ui (Radix UI + Tailwind)
- **Customization**: Allowed via class overrides
- **Ownership**: Managed via `npx shadcn add`
- **Modification**: Avoid direct edits; wrap if needed

#### 2. Feature Components (`components/dashboard/`, `components/landing/`)

- **Purpose**: Business logic and data presentation
- **Server/Client**: Mixed (mark 'use client' when needed)
- **Imports**: Can import from `ui/` and `lib/`

#### 3. Layout Components (`app-shell.tsx`, `app-sidebar.tsx`)

- **Purpose**: Page structure and navigation
- **Server/Client**: Server Components by default
- **State**: Minimal; delegate to children

#### 4. Pre-built Blocks (`shadcn-studio/blocks/`)

- **Source**: shadcn Studio (community blocks)
- **Usage**: Copy-paste starting points
- **Customization**: Full editing allowed
- **Naming**: Keep original names for reference

## `/lib` Structure

```
lib/
├── supabase/               # Supabase client utilities
│   ├── client.ts           # Browser client
│   ├── server.ts           # Server client
│   └── middleware.ts       # Middleware client
│
├── mcp/                    # Model Context Protocol server
│   ├── shipment-server.ts  # Main MCP server
│   └── handlers/           # Protocol handlers (future)
│
├── utils.ts                # Utility functions (cn, etc.)
├── auth-helpers.ts         # Authentication utilities
├── logger.ts               # Server-side logging
├── env-validation.ts       # Environment variable validation
├── design-tokens.ts        # Design system constants
├── animation-config.ts     # Framer Motion presets
└── chartUtils.ts           # Chart.js utilities
```

### Library Rules

- **Pure functions only**: No side effects
- **Tree-shakeable**: Named exports
- **Type-safe**: Full TypeScript coverage
- **Documented**: JSDoc for public APIs

## `/hooks` Structure

```
hooks/
├── use-theme-safe-animations.ts  # Theme-aware animation control
└── use-tracking.ts               # Shipment tracking logic
```

### Hook Rules

- Prefix with `use`
- Client-side only ('use client' directive)
- Return stable references (useMemo, useCallback)
- No side effects in render phase

## `/types` Structure

```
types/
├── tracking.ts             # Shipment and tracking types
├── database.ts             # Supabase generated types (future)
└── global.d.ts             # Global type augmentation (future)
```

### Type Rules

- **No enums**: Use union types or const objects
- **No interfaces for data**: Use type aliases
- **Interfaces for components**: React component props only
- **Exported types**: PascalCase naming

## `/public` Structure

```
public/
├── images/                 # Static images
│   └── [organized by feature]
│
├── lottie/                 # Animation files
│   └── parcel.json         # Example Lottie animation
│
├── remixicon/              # Icon library assets
│   └── [auto-generated]
│
└── remixIcon_fonts/        # Icon fonts (legacy)
    └── [font files]
```

### Asset Rules

- **Images**: WebP/AVIF format, optimized <100KB
- **Lottie**: JSON files, minified
- **Icons**: SVG preferred, fonts as fallback
- **Naming**: kebab-case

## `/database` Structure

```
database/
├── migrations/             # SQL migration files
│   └── [timestamp]_[name].sql
│
└── schema.sql              # Current schema snapshot
```

## File Naming Conventions

### Components

- **Format**: `kebab-case.tsx`
- **Examples**: `app-header.tsx`, `stats-overview.tsx`

### Pages (App Router)

- **Format**: `page.tsx` (mandatory)
- **Layout**: `layout.tsx` (mandatory)
- **Loading**: `loading.tsx` (optional)
- **Error**: `error.tsx` (optional)

### API Routes

- **Format**: `route.ts` (mandatory)
- **Path**: Matches endpoint URL

### Utilities

- **Format**: `kebab-case.ts`
- **Examples**: `auth-helpers.ts`, `design-tokens.ts`

### Types

- **Format**: `kebab-case.ts`
- **Example**: `tracking.ts`

## Adding New Files

### New Page

```bash
# 1. Create page file
app/[route]/page.tsx

# 2. Optional: Add layout if needed
app/[route]/layout.tsx

# 3. Optional: Add loading state
app/[route]/loading.tsx

# 4. Optional: Add error boundary
app/[route]/error.tsx
```

### New Component

```bash
# 1. Determine category
components/[category]/[component-name].tsx

# 2. Create with 'use client' if interactive
'use client'
export function ComponentName() { ... }

# 3. Export from component file (no index.ts)
```

### New Utility

```bash
# 1. Create in lib/
lib/[utility-name].ts

# 2. Use named exports only
export function utilityFunction() { ... }
```

### New API Route

```bash
# 1. Create route handler
app/api/[endpoint]/route.ts

# 2. Export HTTP method handlers
export async function GET(req: Request) { ... }
export async function POST(req: Request) { ... }
```

## Import Path Aliases

### Configured Paths

```json
{
  "@/*": ["./*"]
}
```

### Usage Examples

```tsx
// Components
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/dashboard/app-header";

// Utilities
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

// Types
import type { Shipment } from "@/types/tracking";

// Hooks
import { useTracking } from "@/hooks/use-tracking";
```

## Rules for File Organization

### ✅ Do

- Group by feature/domain, not technical layer
- Keep related files close together
- Use consistent naming within a category
- Co-locate tests with source files (future)

### ❌ Don't

- Create deeply nested folders (max 3 levels)
- Use barrel exports (`index.ts`)
- Mix server and client code in same file
- Create "utils" dumping grounds

## File Size Constraints

- **Components**: <300 lines (split if larger)
- **Pages**: <200 lines (extract components)
- **Utilities**: <150 lines (single responsibility)
- **Types**: <500 lines (split by domain)

## Git Ignore

```
.next/
node_modules/
.env.local
.env.*.local
*.log
.DS_Store
tsconfig.tsbuildinfo
```

## Build Artifacts

- `.next/` - Next.js build output
- `tsconfig.tsbuildinfo` - TypeScript incremental build cache
- Generated by build process, never committed
