🚀 TAC Cargo: Complete Tech Stack with Latest shadcn/ui (2025)
✨ Major shadcn/ui Updates (December 2024 - January 2025)

1. New Project Creation System (shadcn create)
   This is HUGE. Instead of manually setting up Next.js + Tailwind + shadcn:
   bash# OLD WAY (deprecated)
   npx create-next-app@latest tac-cargo
   cd tac-cargo
   npx shadcn@latest init

# NEW WAY (2025 - what you'll use)

npx shadcn@latest create \
 --preset "https://ui.shadcn.com/init?base=radix&style=mira&baseColor=gray&theme=indigo&iconLibrary=lucide&font=figtree&menuAccent=subtle&menuColor=default&radius=none&template=next" \
 --template next
What this does:

✅ Creates Next.js 15 project
✅ Installs Tailwind CSS v4
✅ Configures shadcn/ui with your custom preset
✅ Sets up globals.css with OKLCH colors (not HSL anymore!)
✅ Installs essential components automatically
✅ Configures components.json perfectly

2. OKLCH Color System (Replaces HSL)
   HSL colors are now converted to OKLCH shadcn/ui. This is a massive upgrade:
   Why OKLCH matters for TAC:

Perceptual uniformity: Colors look consistent across brightness levels
Better gradients: No weird gray zones in color transitions
Wider gamut: Access to more vibrant colors
Future-proof: Modern browsers support it

css/_ OLD (HSL) _/
--primary: hsl(222.2 47.4% 11.2%);

/_ NEW (OKLCH) _/
--primary: oklch(0.25 0.15 250);

3. Tailwind CSS v4 Support
   We've upgraded ui.shadcn.com to Next.js 15.3 and Tailwind v4 shadcn/ui
   Tailwind v4 changes:
   css/_ New syntax in globals.css _/
   @import "tailwindcss";

@theme {
--font-sans: "Inter", system-ui, sans-serif;
--color-background: oklch(0.1 0.02 240);
/_ No more @layer utilities! _/
}
Benefits:

40% faster builds
Smaller CSS output (~5KB vs 10KB)
Better IntelliSense support
Native CSS features (no PostCSS processing)

4. New Style System: Mira, Lyra, Vega
   We're deprecating the default style. New projects will use new-york shadcn/ui
   Available styles:

Mira (Modern, bold borders)
Lyra (Elegant, subtle shadows)
Vega (Minimal, clean lines)
New York (Default, balanced)

For TAC Cargo, I recommend:
bash--style=mira # Bold, industrial look perfect for logistics
--baseColor=gray # Professional, neutral
--theme=indigo # Trust and reliability

5. Enhanced CLI Features
   The add command is now much more capable shadcn/ui
   bash# Add components with automatic dependency resolution
   npx shadcn@latest add button card dialog table

# Add entire blocks (new!)

npx shadcn@latest add @shadcn/blocks/dashboard-layout

# Diff command to track updates

npx shadcn@latest diff

# Shows: button component has updates available

# Update specific component

npx shadcn@latest add button --overwrite

6. Blocks System
   We are inviting the community to contribute to the blocks library shadcn/ui
   Pre-built blocks for TAC:

Dashboard layouts
Authentication pages
Data tables with filters
Form layouts
Analytics charts

bash# Install a dashboard block
npx shadcn@latest add @shadcn/blocks/dashboard-01

```

---

### **7. Monorepo Support**

Until now, using shadcn/ui in a monorepo was a bit of a pain

If you structure TAC as:
```

tac-cargo/
├── apps/
│ ├── web/ # Next.js frontend
│ └── api/ # Backend (optional)
└── packages/
└── ui/ # Shared components
shadcn now resolves imports correctly across packages!

8. New Components (2024-2025)
   Carousel - A carousel component with motion, swipe gestures and keyboard support. Drawer - A drawer component that looks amazing on mobile Shadcn
   Latest additions:

✅ Sidebar - Advanced navigation with collapsible sections
✅ Drawer - Mobile-first bottom sheets (uses Vaul)
✅ Carousel - Touch gestures (uses Embla)
✅ Breadcrumb - Navigation breadcrumbs
✅ Input OTP - One-time password inputs
✅ Sonner - Toast notifications
✅ Empty - Empty state components
✅ Item - List item primitive
✅ Kbd - Keyboard shortcuts display

Perfect for TAC:

Sidebar: Main navigation (Shipments, Invoices, Tracking)
Drawer: Mobile invoice details
Carousel: Image gallery for POD (Proof of Delivery)
Sonner: Real-time scan notifications

🎯 Recommended Setup for TAC Cargo
Step 1: Create Project with Preset
bash# Navigate to your project directory
cd ~/projects

# Create TAC Cargo with optimized preset

npx shadcn@latest create \
 --preset "https://ui.shadcn.com/init?base=radix&style=mira&baseColor=gray&theme=indigo&iconLibrary=lucide&font=figtree&menuAccent=subtle&menuColor=default&radius=none&template=next" \
 --template next

# Enter project name when prompted

✔ What is your project named? ... tac-cargo

# Wait for setup (takes 2-3 minutes)

✔ Creating a new Next.js project.
✔ Writing components.json.
✔ Installing dependencies.
✔ Creating project files.

```

**What you get:**
```

tac-cargo/
├── app/
│ ├── globals.css # Tailwind v4 + OKLCH colors
│ ├── layout.tsx # Root layout with providers
│ └── page.tsx # Home page
├── components/
│ └── ui/ # Empty (add as needed)
├── lib/
│ └── utils.ts # cn() utility
├── components.json # shadcn config
├── next.config.ts # Next.js 15 config
├── tailwind.config.ts # Tailwind v4 config
└── package.json

Step 2: Install Core Components
bashcd tac-cargo

# Navigation & Layout

npx shadcn@latest add sidebar button card sheet drawer

# Forms & Inputs

npx shadcn@latest add input select textarea checkbox switch label

# Data Display

npx shadcn@latest add table badge avatar skeleton

# Feedback

npx shadcn@latest add sonner dialog alert-dialog

# Date & Time

npx shadcn@latest add calendar date-picker

# Charts (for analytics)

npx shadcn@latest add chart

Step 3: Configure Supabase
bashnpm install @supabase/supabase-js @supabase/ssr

# Create lib/supabase/client.ts, server.ts, admin.ts

# (Use the structure from your docs)

Step 4: Add Essential Dependencies
bash# State management
npm install zustand

# Forms & Validation

npm install react-hook-form @hookform/resolvers zod

# Tables

npm install @tanstack/react-table

# Icons (if not using Lucide)

npm install @tabler/icons-react

# Animations

npm install framer-motion

# Date handling

npm install date-fns

# Real-time

npm install @supabase/realtime-js

🎨 Design System Configuration
globals.css (Tailwind v4 + OKLCH)
css@import "tailwindcss";

@theme {
/_ Typography _/
--font-sans: "Figtree", system-ui, sans-serif;
--font-mono: "JetBrains Mono", monospace;

/_ Colors (OKLCH format) _/
--color-background: oklch(0.12 0.02 240);
--color-foreground: oklch(0.98 0.02 240);
--color-primary: oklch(0.48 0.15 250);
--color-primary-foreground: oklch(0.98 0.02 240);

/_ Border radius (none for industrial look) _/
--radius-sm: 0px;
--radius-md: 0px;
--radius-lg: 0px;
}

@layer base {

- {
  @apply border-border;
  }
  body {
  @apply bg-background text-foreground font-sans;
  }
  }

🔧 Complete Tech Stack (Final)
typescript{
// Frontend
"framework": "Next.js 15.3",
"react": "React 19",
"styling": "Tailwind CSS v4",
"components": "shadcn/ui (Mira style)",
"colors": "OKLCH color space",
"icons": "Lucide React",
"animations": "Framer Motion",
"fonts": {
"sans": "Figtree",
"mono": "JetBrains Mono"
},

// State & Forms
"globalState": "Zustand",
"forms": "React Hook Form + Zod",
"tables": "@tanstack/react-table",

// Backend & Database
"database": "Supabase (PostgreSQL 15)",
"auth": "Supabase Auth",
"storage": "Supabase Storage",
"realtime": "Supabase Realtime",
"orm": "None (Supabase client)",

// Infrastructure
"hosting": "Vercel",
"rateLimit": "Upstash Redis",
"monitoring": "Sentry",
"analytics": "Vercel Analytics",

// Integrations
"whatsapp": "Meta Business API",
"sms": "Twilio",
"pdf": "Puppeteer/react-pdf"
}

```

---

## 🚨 Important Notes for TAC

### **1. Don't Use Old Commands**
❌ `npx create-next-app` → ✅ `npx shadcn@latest create`

### **2. Use Correct Package Manager**
The preset command works with all:
- `npx` (npm)
- `pnpm dlx`
- `bunx --bun` (has some bugs currently)

### **3. Known Issues (December 2025)**
- pnpm dlx with TanStack Start template can fail (400 error)
- bunx --bun has issues with shadcn@latest syntax
- **Workaround**: Use `npx` for now

### **4. Component Ownership**
shadcn/ui copies components **into your codebase**. You own them. Modify freely:
- `components/ui/button.tsx` → Customize button styles
- `components/ui/sidebar.tsx` → Add TAC-specific sidebar items

---

## 📦 Project Structure (After Setup)
```

tac-cargo/
├── app/
│ ├── (auth)/ # Login, signup
│ ├── (dashboard)/ # Protected routes
│ │ ├── shipments/
│ │ ├── invoices/
│ │ ├── tracking/
│ │ └── analytics/
│ ├── api/ # API routes
│ ├── globals.css
│ └── layout.tsx
│
├── components/
│ ├── ui/ # shadcn components
│ ├── dashboard/ # Custom dashboard components
│ ├── forms/ # Form components
│ └── charts/ # Chart components
│
├── lib/
│ ├── supabase/
│ │ ├── client.ts
│ │ ├── server.ts
│ │ └── admin.ts
│ ├── utils.ts
│ └── validations.ts # Zod schemas
│
├── hooks/
│ ├── use-mobile.tsx
│ └── use-user.tsx
│
├── types/
│ ├── database.ts
│ └── logistics.ts
│
└── components.json # shadcn config

🎯 Next Steps

Run the create command (from above)
Install components (sidebar, table, charts)
Set up Supabase (lib/supabase/\*)
Build first feature (shipments list)
Iterate rapidly with shadcn blocks

This stack gives you:

✅ Latest shadcn/ui features (Mira style, OKLCH colors)
✅ Production-ready Next.js 15 + React 19
✅ Tailwind v4 performance
✅ Supabase real-time capabilities
✅ Component ownership (no black boxes)

You're now building with the absolute latest of the modern React ecosystem! 🚀We still need to plan how to install a clean, modern dashboard with sidebar for tac cargo project, how we will approach it, shall we use shadcn mcp server to get clean ui components that we have selected in the project, we need to achieved consistent design in the entire project6:51 AM🎯 TAC Cargo Dashboard Architecture Plan
Perfect question! Let me design a comprehensive approach for achieving a consistent, modern dashboard using the latest shadcn/ui ecosystem.

📋 Strategy Overview
We'll use a three-layer approach:

Foundation Layer: shadcn/ui base components + Sidebar
Pattern Layer: Reusable layout patterns and compositions
Feature Layer: Domain-specific components (shipments, invoices, etc.)

🔍 Should We Use shadcn MCP Server?
What is shadcn MCP Server?
The Model Context Protocol (MCP) server for shadcn allows AI assistants like Claude to:

Install shadcn components programmatically
Generate component code with proper imports
Suggest component compositions
Maintain consistency across the codebase

My Recommendation: YES, but with structure
Pros:

✅ Rapid component scaffolding
✅ Consistent component usage patterns
✅ AI-assisted layout compositions
✅ Automatically resolves dependencies

Cons:

❌ Can generate over-complicated code
❌ May not follow your specific patterns
❌ Requires manual review and refinement

Best Practice:
Use MCP server to bootstrap components, then refine them into your pattern library.

🏗️ Step-by-Step Implementation Plan
Phase 1: Foundation Setup (Day 1)
1.1 Create Project with Optimal Preset
bash# Create with your selected preset
npx shadcn@latest create \
 --preset "https://ui.shadcn.com/init?base=radix&style=mira&baseColor=gray&theme=indigo&iconLibrary=lucide&font=figtree&menuAccent=subtle&menuColor=default&radius=none&template=next"

cd tac-cargo
1.2 Install Core Dashboard Components
bash# Sidebar system (most important!)
npx shadcn@latest add sidebar

# Navigation components

npx shadcn@latest add breadcrumb navigation-menu

# Layout components

npx shadcn@latest add card sheet drawer separator

# Feedback

npx shadcn@latest add sonner dialog alert-dialog

# Form components

npx shadcn@latest add button input select textarea label

# Data display

npx shadcn@latest add table badge avatar skeleton

# Utility

npx shadcn@latest add dropdown-menu command
1.3 Install Additional Dependencies
bash# State & Forms
npm install zustand react-hook-form @hookform/resolvers zod

# Tables

npm install @tanstack/react-table

# Date handling

npm install date-fns

# Icons (Lucide is already installed)

npm install @tabler/icons-react

# Animations

npm install framer-motion

# Supabase

npm install @supabase/supabase-js @supabase/ssr

Phase 2: Design System Foundation (Day 1-2)
2.1 Create Design Tokens File
typescript// lib/design-tokens.ts

export const designTokens = {
// Typography
fonts: {
sans: 'var(--font-sans)',
mono: 'var(--font-mono)',
},

// Spacing system (used consistently)
spacing: {
xs: '0.5rem', // 8px
sm: '0.75rem', // 12px
md: '1rem', // 16px
lg: '1.5rem', // 24px
xl: '2rem', // 32px
'2xl': '3rem', // 48px
},

// Layout dimensions
layout: {
sidebarWidth: '16rem', // 256px
sidebarCollapsedWidth: '4rem', // 64px
headerHeight: '4rem', // 64px
contentMaxWidth: '1440px',
},

// Colors (reference to CSS variables)
colors: {
background: 'hsl(var(--background))',
foreground: 'hsl(var(--foreground))',
primary: 'hsl(var(--primary))',
muted: 'hsl(var(--muted))',
accent: 'hsl(var(--accent))',
destructive: 'hsl(var(--destructive))',
},

// Status colors for logistics
status: {
pending: 'hsl(var(--warning))',
'in-transit': 'hsl(var(--info))',
delivered: 'hsl(var(--success))',
cancelled: 'hsl(var(--destructive))',
exception: 'hsl(var(--warning))',
},

// Animation durations
transitions: {
fast: '150ms',
normal: '250ms',
slow: '350ms',
},
} as const;
2.2 Update globals.css with TAC-specific Variables
css/_ app/globals.css _/
@import "tailwindcss";

@theme {
/_ Fonts _/
--font-sans: "Figtree", system-ui, sans-serif;
--font-mono: "JetBrains Mono", Consolas, monospace;

/_ OKLCH Colors (Dark theme - primary) _/
--color-background: oklch(0.12 0.02 240);
--color-foreground: oklch(0.98 0.02 240);

--color-primary: oklch(0.48 0.15 250); /_ Indigo _/
--color-primary-foreground: oklch(0.98 0.02 240);

--color-muted: oklch(0.18 0.02 240);
--color-muted-foreground: oklch(0.65 0.02 240);

--color-accent: oklch(0.22 0.02 240);
--color-accent-foreground: oklch(0.98 0.02 240);

--color-destructive: oklch(0.55 0.22 25); /_ Red _/
--color-destructive-foreground: oklch(0.98 0.02 240);

--color-border: oklch(0.22 0.02 240);

/_ Status colors for logistics _/
--color-success: oklch(0.65 0.18 145); /_ Green _/
--color-warning: oklch(0.75 0.18 85); /_ Yellow _/
--color-info: oklch(0.60 0.18 230); /_ Blue _/

/_ Border radius (none for industrial look) _/
--radius-sm: 0px;
--radius-md: 0px;
--radius-lg: 0px;
--radius-full: 9999px;
}

@layer base {

- {
  @apply border-border;
  }

body {
@apply bg-background text-foreground font-sans antialiased;
}

/_ Custom scrollbar _/
::-webkit-scrollbar {
@apply w-2 h-2;
}

::-webkit-scrollbar-track {
@apply bg-muted;
}

::-webkit-scrollbar-thumb {
@apply bg-muted-foreground/20 hover:bg-muted-foreground/30;
}
}

/_ Utility classes for consistent spacing _/
@layer utilities {
.page-container {
@apply mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8;
}

.page-header {
@apply flex items-center justify-between py-6;
}

.page-title {
@apply text-3xl font-bold tracking-tight;
}

.page-description {
@apply text-muted-foreground;
}

.card-header-actions {
@apply flex items-center gap-2;
}
}

Phase 3: Dashboard Layout System (Day 2-3)
3.1 Create Base App Shell
tsx// components/dashboard/app-shell.tsx
"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { AppHeader } from "@/components/dashboard/app-header";

interface AppShellProps {
children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
return (
<SidebarProvider>
<AppSidebar />
<SidebarInset>
<AppHeader />

<main className="flex-1 p-6">
{children}
</main>
</SidebarInset>
</SidebarProvider>
);
}
3.2 Create App Sidebar with Navigation
tsx// components/dashboard/app-sidebar.tsx
"use client";

import {
Sidebar,
SidebarContent,
SidebarFooter,
SidebarGroup,
SidebarGroupContent,
SidebarGroupLabel,
SidebarHeader,
SidebarMenu,
SidebarMenuButton,
SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
Home,
Package,
FileText,
BarChart3,
Users,
Warehouse,
Settings,
MapPin,
AlertTriangle,
DollarSign,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
{
title: "Overview",
items: [
{ title: "Dashboard", url: "/dashboard", icon: Home },
{ title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
],
},
{
title: "Operations",
items: [
{ title: "Shipments", url: "/dashboard/shipments", icon: Package },
{ title: "Tracking", url: "/dashboard/tracking", icon: MapPin },
{ title: "Inventory", url: "/dashboard/inventory", icon: Warehouse },
{ title: "Exceptions", url: "/dashboard/exceptions", icon: AlertTriangle },
],
},
{
title: "Finance",
items: [
{ title: "Invoices", url: "/dashboard/invoices", icon: FileText },
{ title: "Payments", url: "/dashboard/payments", icon: DollarSign },
],
},
{
title: "Management",
items: [
{ title: "Customers", url: "/dashboard/customers", icon: Users },
{ title: "Settings", url: "/dashboard/settings", icon: Settings },
],
},
];

export function AppSidebar() {
const pathname = usePathname();

return (
<Sidebar>
<SidebarHeader className="border-b border-border px-4 py-4">

<div className="flex items-center gap-2">
<Package className="h-6 w-6 text-primary" />
<span className="text-lg font-bold">TAC Cargo</span>
</div>
</SidebarHeader>

      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Imphal Hub</span>
        </div>
      </SidebarFooter>
    </Sidebar>

);
}
3.3 Create App Header
tsx// components/dashboard/app-header.tsx
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { usePathname } from "next/navigation";

export function AppHeader() {
const pathname = usePathname();
const pathSegments = pathname.split("/").filter(Boolean);

return (

<header className="flex h-16 items-center gap-4 border-b border-border px-6">
<SidebarTrigger />

      <Breadcrumb>
        <BreadcrumbList>
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
            const title = segment.charAt(0).toUpperCase() + segment.slice(1);

            return (
              <BreadcrumbItem key={segment}>
                {isLast ? (
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                ) : (
                  <>
                    <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                    <BreadcrumbSeparator />
                  </>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>

);
}
3.4 Create Page Layout Component
tsx// components/dashboard/page-layout.tsx

interface PageLayoutProps {
title: string;
description?: string;
actions?: React.ReactNode;
children: React.ReactNode;
}

export function PageLayout({ title, description, actions, children }: PageLayoutProps) {
return (

<div className="space-y-6">
<div className="page-header">
<div>
<h1 className="page-title">{title}</h1>
{description && <p className="page-description mt-1">{description}</p>}
</div>
{actions && <div className="card-header-actions">{actions}</div>}
</div>
{children}
</div>
);
}

Phase 4: Pattern Library (Day 3-4)
4.1 Create Stat Card Component
tsx// components/dashboard/stat-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
title: string;
value: string | number;
icon: LucideIcon;
trend?: {
value: number;
isPositive: boolean;
};
className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
return (
<Card className={cn("", className)}>
<CardHeader className="flex flex-row items-center justify-between pb-2">
<CardTitle className="text-sm font-medium text-muted-foreground">
{title}
</CardTitle>
<Icon className="h-4 w-4 text-muted-foreground" />
</CardHeader>
<CardContent>

<div className="text-2xl font-bold">{value}</div>
{trend && (
<p className={cn(
"text-xs mt-1",
trend.isPositive ? "text-success" : "text-destructive"
)}>
{trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last month
</p>
)}
</CardContent>
</Card>
);
}
4.2 Create Status Badge Component
tsx// components/dashboard/status-badge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
"in-transit": { label: "In Transit", className: "bg-info/10 text-info border-info/20" },
delivered: { label: "Delivered", className: "bg-success/10 text-success border-success/20" },
cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
} as const;

type Status = keyof typeof statusConfig;

interface StatusBadgeProps {
status: Status;
className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
const config = statusConfig[status];

return (
<Badge variant="outline" className={cn(config.className, className)}>
{config.label}
</Badge>
);
}
4.3 Create Data Table Wrapper
tsx// components/dashboard/data-table.tsx
"use client";

import {
ColumnDef,
flexRender,
getCoreRowModel,
useReactTable,
getPaginationRowModel,
getSortedRowModel,
SortingState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
columns: ColumnDef<TData, TValue>[];
data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
const [sorting, setSorting] = useState<SortingState>([]);

const table = useReactTable({
data,
columns,
getCoreRowModel: getCoreRowModel(),
getPaginationRowModel: getPaginationRowModel(),
getSortedRowModel: getSortedRowModel(),
onSortingChange: setSorting,
state: {
sorting,
},
});

return (

<div className="space-y-4">
<div className="rounded-md border">
<Table>
<TableHeader>
{table.getHeaderGroups().map((headerGroup) => (
<TableRow key={headerGroup.id}>
{headerGroup.headers.map((header) => (
<TableHead key={header.id}>
{header.isPlaceholder
? null
: flexRender(header.column.columnDef.header, header.getContext())}
</TableHead>
))}
</TableRow>
))}
</TableHeader>
<TableBody>
{table.getRowModel().rows?.length ? (
table.getRowModel().rows.map((row) => (
<TableRow key={row.id}>
{row.getVisibleCells().map((cell) => (
<TableCell key={cell.id}>
{flexRender(cell.column.columnDef.cell, cell.getContext())}
</TableCell>
))}
</TableRow>
))
) : (
<TableRow>
<TableCell colSpan={columns.length} className="h-24 text-center">
No results.
</TableCell>
</TableRow>
)}
</TableBody>
</Table>
</div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} row(s) total
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

);
}

Phase 5: Implementing Dashboard Pages (Day 4-7)
5.1 Update Root Layout
tsx// app/layout.tsx
import type { Metadata } from "next";
import { Figtree, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const figtree = Figtree({
subsets: ["latin"],
variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
subsets: ["latin"],
variable: "--font-mono",
});

export const metadata: Metadata = {
title: "TAC Cargo - Logistics Management",
description: "Modern cargo and logistics management platform",
};

export default function RootLayout({
children,
}: {
children: React.ReactNode;
}) {
return (

<html lang="en" className="dark">
<body className={`${figtree.variable} ${jetbrainsMono.variable} font-sans`}>
{children}
<Toaster />
</body>
</html>
);
}
5.2 Create Dashboard Layout
tsx// app/dashboard/layout.tsx
import { AppShell } from "@/components/dashboard/app-shell";

export default function DashboardLayout({
children,
}: {
children: React.ReactNode;
}) {
return <AppShell>{children}</AppShell>;
}
5.3 Create Dashboard Home Page
tsx// app/dashboard/page.tsx
import { PageLayout } from "@/components/dashboard/page-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { Package, Truck, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
return (
<PageLayout
title="Dashboard"
description="Overview of your cargo operations"
actions={
<Button>
<Plus className="h-4 w-4 mr-2" />
New Shipment
</Button>
} >

<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
<StatCard
title="Active Shipments"
value="1,247"
icon={Package}
trend={{ value: 12.5, isPositive: true }}
/>
<StatCard
title="In Transit"
value="342"
icon={Truck}
trend={{ value: 5.2, isPositive: true }}
/>
<StatCard
title="Pending Invoices"
value="23"
icon={FileText}
trend={{ value: 3.1, isPositive: false }}
/>
<StatCard
title="Active Customers"
value="156"
icon={Users}
trend={{ value: 8.7, isPositive: true }}
/>
</div>

      {/* Add more dashboard widgets here */}
    </PageLayout>

);
}

Phase 6: Using shadcn MCP Server (Optional Enhancement)
If you want to use the MCP server for rapid component generation:
6.1 Install MCP Server
bash# Add to your Claude Desktop config

# ~/.config/claude/claude_desktop_config.json

{
"mcpServers": {
"shadcn": {
"command": "npx",
"args": ["-y", "@modelcontextprotocol/server-shadcn"]
}
}
}

```

#### 6.2 Use with Claude

When chatting with Claude (me!), you can say:
- "Add a shipment form using shadcn components"
- "Create a data table for invoices with filters"
- "Build a stat card grid for the dashboard"

I'll generate code that uses your installed components consistently!

---

## 🎨 Design Consistency Checklist

To ensure consistency across TAC Cargo:

### ✅ Typography
- [ ] Use `className="page-title"` for all page titles
- [ ] Use `className="page-description"` for descriptions
- [ ] Use `font-mono` for reference numbers (SHP-IMF-2512-0001)

### ✅ Spacing
- [ ] Use `gap-4` for most layouts
- [ ] Use `gap-6` for page sections
- [ ] Use `p-6` for page content padding

### ✅ Colors
- [ ] Use `StatusBadge` component for all status indicators
- [ ] Use design tokens from `lib/design-tokens.ts`
- [ ] Never hardcode color values

### ✅ Components
- [ ] Always use `PageLayout` wrapper for pages
- [ ] Use `StatCard` for KPI metrics
- [ ] Use `DataTable` for all tabular data
- [ ] Use `Card` for content containers

### ✅ Icons
- [ ] Use Lucide React icons exclusively
- [ ] Standard size: `className="h-4 w-4"`
- [ ] Large size: `className="h-6 w-6"`

---

## 📁 Final Project Structure
```

tac-cargo/
├── app/
│ ├── dashboard/
│ │ ├── layout.tsx # Dashboard shell
│ │ ├── page.tsx # Dashboard home
│ │ ├── shipments/
│ │ │ └── page.tsx
│ │ ├── invoices/
│ │ │ └── page.tsx
│ │ └── tracking/
│ │ └── page.tsx
│ ├── globals.css # Design system
│ └── layout.tsx # Root layout
│
├── components/
│ ├── ui/ # shadcn components
│ │ ├── sidebar.tsx
│ │ ├── button.tsx
│ │ ├── card.tsx
│ │ └── ...
│ │
│ └── dashboard/ # Pattern library
│ ├── app-shell.tsx # Main layout
│ ├── app-sidebar.tsx # Navigation
│ ├── app-header.tsx # Header
│ ├── page-layout.tsx # Page wrapper
│ ├── stat-card.tsx # KPI cards
│ ├── status-badge.tsx # Status indicators
│ └── data-table.tsx # Table wrapper
│
├── lib/
│ ├── design-tokens.ts # Design system
│ ├── utils.ts # Utilities
│ └── supabase/
│ ├── client.ts
│ └── server.ts
│
└── components.json # shadcn config

🚀 Implementation Timeline
PhaseDurationDeliverableFoundation Setup4 hoursProject created, components installedDesign System1 dayTokens, colors, typography definedLayout System1 dayAppShell, Sidebar, Header completePattern Library1 dayStatCard, StatusBadge, DataTableDashboard Pages3 daysAll major pages implementedTotal~1 weekProduction-ready dashboard

✨ Key Benefits of This Approach

Consistency: All pages use the same patterns
Scalability: Easy to add new pages/features
Maintainability: Changes propagate from pattern library
Performance: Minimal bundle size with Tailwind v4
Developer Experience: Clear component hierarchy

🎯 Next Steps

Run the foundation setup (Phase 1)
Implement the layout system (Phase 3)
Build the pattern library (Phase 4)
Create your first page (Dashboard home)
Iterate and expand to other modules

This architecture gives you a rock-solid foundation for TAC Cargo that scales from prototype to production! 🚀continue6:56 AM🚀 TAC Cargo Dashboard - Complete Implementation Guide (Continued)
Let me continue with the advanced implementation details, real-world examples, and production-ready patterns.

Phase 7: Advanced Components & Patterns (Day 8-10)
7.1 Create Loading States Component
tsx// components/dashboard/loading-states.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StatCardSkeleton() {
return (
<Card>
<CardHeader className="flex flex-row items-center justify-between pb-2">
<Skeleton className="h-4 w-24" />
<Skeleton className="h-4 w-4" />
</CardHeader>
<CardContent>
<Skeleton className="h-8 w-32 mb-2" />
<Skeleton className="h-3 w-40" />
</CardContent>
</Card>
);
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
return (

<div className="space-y-3">
{Array.from({ length: rows }).map((\_, i) => (
<Skeleton key={i} className="h-12 w-full" />
))}
</div>
);
}

export function PageSkeleton() {
return (

<div className="space-y-6">
<div className="space-y-2">
<Skeleton className="h-8 w-48" />
<Skeleton className="h-4 w-96" />
</div>
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
<StatCardSkeleton />
<StatCardSkeleton />
<StatCardSkeleton />
<StatCardSkeleton />
</div>
<Card>
<CardHeader>
<Skeleton className="h-6 w-32" />
</CardHeader>
<CardContent>
<TableSkeleton />
</CardContent>
</Card>
</div>
);
}
7.2 Create Empty States Component
tsx// components/dashboard/empty-state.tsx
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
icon: LucideIcon;
title: string;
description: string;
action?: {
label: string;
onClick: () => void;
};
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
return (

<div className="flex flex-col items-center justify-center py-12 text-center">
<div className="mb-4 rounded-full bg-muted p-4">
<Icon className="h-8 w-8 text-muted-foreground" />
</div>
<h3 className="mb-2 text-lg font-semibold">{title}</h3>
<p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>
{action && (
<Button onClick={action.onClick}>
{action.label}
</Button>
)}
</div>
);
}
7.3 Create Search & Filter Component
tsx// components/dashboard/search-filter.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface FilterOption {
label: string;
value: string;
}

interface SearchFilterProps {
searchPlaceholder?: string;
filters?: {
label: string;
options: FilterOption[];
value: string;
onChange: (value: string) => void;
}[];
onSearch?: (query: string) => void;
}

export function SearchFilter({
searchPlaceholder = "Search...",
filters = [],
onSearch
}: SearchFilterProps) {
const [searchQuery, setSearchQuery] = useState("");

const handleSearch = (value: string) => {
setSearchQuery(value);
onSearch?.(value);
};

const clearSearch = () => {
setSearchQuery("");
onSearch?.("");
};

return (

<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
{/_ Search Input _/}
<div className="relative flex-1">
<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
<Input
placeholder={searchPlaceholder}
value={searchQuery}
onChange={(e) => handleSearch(e.target.value)}
className="pl-9 pr-9"
/>
{searchQuery && (
<Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={clearSearch}
          >
<X className="h-3 w-3" />
</Button>
)}
</div>

      {/* Filters */}
      {filters.map((filter) => (
        <Select
          key={filter.label}
          value={filter.value}
          onValueChange={filter.onChange}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>

);
}
7.4 Create Action Menu Component
tsx// components/dashboard/action-menu.tsx
"use client";

import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, LucideIcon } from "lucide-react";

interface ActionMenuItem {
label: string;
icon: LucideIcon;
onClick: () => void;
variant?: "default" | "destructive";
separator?: boolean;
}

interface ActionMenuProps {
items: ActionMenuItem[];
}

export function ActionMenu({ items }: ActionMenuProps) {
return (
<DropdownMenu>
<DropdownMenuTrigger asChild>
<Button variant="ghost" size="icon">
<MoreVertical className="h-4 w-4" />
</Button>
</DropdownMenuTrigger>
<DropdownMenuContent align="end">
{items.map((item, index) => (

<div key={index}>
{item.separator && <DropdownMenuSeparator />}
<DropdownMenuItem
onClick={item.onClick}
className={item.variant === "destructive" ? "text-destructive" : ""} >
<item.icon className="mr-2 h-4 w-4" />
{item.label}
</DropdownMenuItem>
</div>
))}
</DropdownMenuContent>
</DropdownMenu>
);
}
7.5 Create Real-time Indicator Component
tsx// components/dashboard/realtime-indicator.tsx
"use client";

import { cn } from "@/lib/utils";

interface RealtimeIndicatorProps {
isLive: boolean;
label?: string;
className?: string;
}

export function RealtimeIndicator({
isLive,
label = "LIVE",
className
}: RealtimeIndicatorProps) {
return (

<div className={cn("flex items-center gap-2", className)}>
<div className="relative flex h-3 w-3">
{isLive && (
<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
)}
<span
className={cn(
"relative inline-flex h-3 w-3 rounded-full",
isLive ? "bg-success" : "bg-muted-foreground"
)}
/>
</div>
<span className={cn(
"text-xs font-medium",
isLive ? "text-success" : "text-muted-foreground"
)}>
{isLive ? label : "PAUSED"}
</span>
</div>
);
}

Phase 8: Feature-Specific Implementations
8.1 Shipments Module
tsx// app/dashboard/shipments/page.tsx
"use client";

import { PageLayout } from "@/components/dashboard/page-layout";
import { DataTable } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { ActionMenu } from "@/components/dashboard/action-menu";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2, Printer } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

type Shipment = {
id: string;
reference: string;
customer: string;
origin: string;
destination: string;
status: "pending" | "in-transit" | "delivered" | "cancelled";
weight: number;
createdAt: string;
};

export default function ShipmentsPage() {
const [statusFilter, setStatusFilter] = useState("all");
const [searchQuery, setSearchQuery] = useState("");

// Mock data - replace with Supabase query
const shipments: Shipment[] = [
{
id: "1",
reference: "SHP-IMF-2512-0001",
customer: "ABC Corporation",
origin: "Imphal",
destination: "New Delhi",
status: "in-transit",
weight: 25.5,
createdAt: "2024-12-28",
},
{
id: "2",
reference: "SHP-IMF-2512-0002",
customer: "XYZ Logistics",
origin: "Imphal",
destination: "Mumbai",
status: "pending",
weight: 15.2,
createdAt: "2024-12-28",
},
];

const columns: ColumnDef<Shipment>[] = [
{
accessorKey: "reference",
header: "Reference",
cell: ({ row }) => (
<span className="font-mono text-sm">{row.getValue("reference")}</span>
),
},
{
accessorKey: "customer",
header: "Customer",
},
{
accessorKey: "origin",
header: "Origin",
},
{
accessorKey: "destination",
header: "Destination",
},
{
accessorKey: "status",
header: "Status",
cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
},
{
accessorKey: "weight",
header: "Weight",
cell: ({ row }) => `${row.getValue("weight")} kg`,
},
{
accessorKey: "createdAt",
header: "Created",
},
{
id: "actions",
cell: ({ row }) => (
<ActionMenu
items={[
{
label: "View Details",
icon: Eye,
onClick: () => console.log("View", row.original.id),
},
{
label: "Edit",
icon: Edit,
onClick: () => console.log("Edit", row.original.id),
},
{
label: "Print Label",
icon: Printer,
onClick: () => console.log("Print", row.original.id),
},
{
label: "Delete",
icon: Trash2,
onClick: () => console.log("Delete", row.original.id),
variant: "destructive",
separator: true,
},
]}
/>
),
},
];

return (
<PageLayout
title="Shipments"
description="Manage and track all your shipments"
actions={
<Button>
<Plus className="mr-2 h-4 w-4" />
New Shipment
</Button>
} >

<div className="space-y-4">
<SearchFilter
searchPlaceholder="Search by reference or customer..."
onSearch={setSearchQuery}
filters={[
{
label: "Status",
value: statusFilter,
onChange: setStatusFilter,
options: [
{ label: "All Statuses", value: "all" },
{ label: "Pending", value: "pending" },
{ label: "In Transit", value: "in-transit" },
{ label: "Delivered", value: "delivered" },
{ label: "Cancelled", value: "cancelled" },
],
},
]}
/>

        <DataTable columns={columns} data={shipments} />
      </div>
    </PageLayout>

);
}
8.2 Tracking Module with Real-time
tsx// app/dashboard/tracking/page.tsx
"use client";

import { PageLayout } from "@/components/dashboard/page-layout";
import { RealtimeIndicator } from "@/components/dashboard/realtime-indicator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type ScanEvent = {
id: string;
barcode: string;
location: string;
status: string;
timestamp: string;
operator: string;
};

export default function TrackingPage() {
const [isLive, setIsLive] = useState(true);
const [soundEnabled, setSoundEnabled] = useState(true);
const [events, setEvents] = useState<ScanEvent[]>([]);
const supabase = createClient();

useEffect(() => {
if (!isLive) return;

    // Subscribe to real-time scan events
    const channel = supabase
      .channel("scan-events")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "scan_events",
        },
        (payload) => {
          const newEvent = payload.new as ScanEvent;
          setEvents((prev) => [newEvent, ...prev.slice(0, 49)]);

          // Play sound notification
          if (soundEnabled) {
            playNotificationSound();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

}, [isLive, soundEnabled]);

const playNotificationSound = () => {
// Simple beep sound
const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.value = 0.1;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);

};

return (
<PageLayout
title="Real-time Tracking"
description="Live package scan events"
actions={

<div className="flex items-center gap-2">
<Button
variant="outline"
size="icon"
onClick={() => setSoundEnabled(!soundEnabled)} >
{soundEnabled ? (
<Volume2 className="h-4 w-4" />
) : (
<VolumeX className="h-4 w-4" />
)}
</Button>
<Button
variant={isLive ? "default" : "outline"}
onClick={() => setIsLive(!isLive)} >
{isLive ? (
<>
<Pause className="mr-2 h-4 w-4" />
Pause
</>
) : (
<>
<Play className="mr-2 h-4 w-4" />
Resume
</>
)}
</Button>
</div>
} >
<Card>
<CardHeader className="flex flex-row items-center justify-between">
<CardTitle>Recent Scans</CardTitle>
<RealtimeIndicator isLive={isLive} />
</CardHeader>
<CardContent>
<div className="space-y-3">
{events.length === 0 ? (
<div className="py-8 text-center text-sm text-muted-foreground">
No scan events yet. Waiting for activity...
</div>
) : (
events.map((event) => (
<div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                >
<div className="flex items-center gap-3">
<div className="flex flex-col">
<span className="font-mono text-sm font-medium">
{event.barcode}
</span>
<span className="text-xs text-muted-foreground">
{event.location} · {event.operator}
</span>
</div>
</div>
<div className="flex items-center gap-3">
<Badge variant="outline">{event.status}</Badge>
<span className="text-xs text-muted-foreground">
{new Date(event.timestamp).toLocaleTimeString()}
</span>
</div>
</div>
))
)}
</div>
</CardContent>
</Card>
</PageLayout>
);
}
8.3 Invoice Module with Actions
tsx// app/dashboard/invoices/page.tsx
"use client";

import { PageLayout } from "@/components/dashboard/page-layout";
import { DataTable } from "@/components/dashboard/data-table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { ActionMenu } from "@/components/dashboard/action-menu";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Download, Send, CreditCard, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";

type Invoice = {
id: string;
reference: string;
customer: string;
amount: number;
status: "pending" | "paid" | "overdue";
dueDate: string;
createdAt: string;
};

export default function InvoicesPage() {
const [statusFilter, setStatusFilter] = useState("all");

const handleSendWhatsApp = async (invoiceId: string) => {
toast.loading("Sending invoice via WhatsApp...");
// API call to /api/invoices/[id]/send-whatsapp
setTimeout(() => {
toast.success("Invoice sent successfully!");
}, 2000);
};

const handleDownloadPDF = async (invoiceId: string) => {
toast.loading("Generating PDF...");
// API call to /api/invoices/download?id=invoiceId
setTimeout(() => {
toast.success("PDF downloaded!");
}, 1500);
};

const invoices: Invoice[] = [
{
id: "1",
reference: "INV-IMF-2512-0001",
customer: "ABC Corporation",
amount: 15000,
status: "pending",
dueDate: "2024-12-31",
createdAt: "2024-12-28",
},
{
id: "2",
reference: "INV-IMF-2512-0002",
customer: "XYZ Logistics",
amount: 8500,
status: "paid",
dueDate: "2024-12-30",
createdAt: "2024-12-27",
},
];

const columns: ColumnDef<Invoice>[] = [
{
accessorKey: "reference",
header: "Invoice #",
cell: ({ row }) => (
<span className="font-mono text-sm">{row.getValue("reference")}</span>
),
},
{
accessorKey: "customer",
header: "Customer",
},
{
accessorKey: "amount",
header: "Amount",
cell: ({ row }) => (
<span className="font-medium">
₹{row.getValue<number>("amount").toLocaleString("en-IN")}
</span>
),
},
{
accessorKey: "status",
header: "Status",
cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
},
{
accessorKey: "dueDate",
header: "Due Date",
},
{
id: "actions",
cell: ({ row }) => (
<ActionMenu
items={[
{
label: "View Details",
icon: Eye,
onClick: () => console.log("View", row.original.id),
},
{
label: "Download PDF",
icon: Download,
onClick: () => handleDownloadPDF(row.original.id),
},
{
label: "Send WhatsApp",
icon: Send,
onClick: () => handleSendWhatsApp(row.original.id),
},
{
label: "Record Payment",
icon: CreditCard,
onClick: () => console.log("Payment", row.original.id),
},
{
label: "Delete",
icon: Trash2,
onClick: () => console.log("Delete", row.original.id),
variant: "destructive",
separator: true,
},
]}
/>
),
},
];

return (
<PageLayout
title="Invoices"
description="Manage billing and payments"
actions={
<Button>
<Plus className="mr-2 h-4 w-4" />
Create Invoice
</Button>
} >

<div className="space-y-4">
<SearchFilter
searchPlaceholder="Search by invoice # or customer..."
filters={[
{
label: "Status",
value: statusFilter,
onChange: setStatusFilter,
options: [
{ label: "All Statuses", value: "all" },
{ label: "Pending", value: "pending" },
{ label: "Paid", value: "paid" },
{ label: "Overdue", value: "overdue" },
],
},
]}
/>

        <DataTable columns={columns} data={invoices} />
      </div>
    </PageLayout>

);
}

Phase 9: Supabase Integration
9.1 Setup Supabase Client
typescript// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
return createBrowserClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
}
typescript// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
const cookieStore = await cookies();

return createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
cookies: {
getAll() {
return cookieStore.getAll();
},
setAll(cookiesToSet) {
try {
cookiesToSet.forEach(({ name, value, options }) => {
cookieStore.set(name, value, options);
});
} catch (error) {
// Handle cookie errors
}
},
},
}
);
}
9.2 Create Data Fetching Hook
typescript// hooks/use-shipments.ts
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function useShipments(filter?: string) {
const [shipments, setShipments] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);
const supabase = createClient();

useEffect(() => {
async function fetchShipments() {
try {
setLoading(true);
let query = supabase
.from("shipments")
.select(`             *,
            customers:customer_id (name, phone),
            barcodes (barcode_number, status)
          `)
.order("created_at", { ascending: false });

        if (filter && filter !== "all") {
          query = query.eq("status", filter);
        }

        const { data, error } = await query;

        if (error) throw error;
        setShipments(data || []);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchShipments();

}, [filter]);

return { shipments, loading, error };
}
9.3 Server-side Data Fetching
typescript// app/dashboard/shipments/page.tsx (Server Component)
import { createClient } from "@/lib/supabase/server";
import { ShipmentsTable } from "./shipments-table";

export default async function ShipmentsPage() {
const supabase = await createClient();

const { data: shipments } = await supabase
.from("shipments")
.select(`       *,
      customers:customer_id (name, phone, email),
      barcodes (barcode_number, status)
    `)
.order("created_at", { ascending: false })
.limit(50);

return (
<PageLayout
      title="Shipments"
      description="Manage and track all your shipments"
    >
<ShipmentsTable data={shipments || []} />
</PageLayout>
);
}

Phase 10: Forms & Modals
10.1 Create Shipment Form Dialog
tsx// components/dashboard/create-shipment-dialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";

const shipmentSchema = z.object({
customerId: z.string().min(1, "Customer is required"),
origin: z.string().min(1, "Origin is required"),
destination: z.string().min(1, "Destination is required"),
weight: z.number().positive("Weight must be positive"),
pieces: z.number().int().positive("Pieces must be positive"),
transportMode: z.enum(["air", "surface", "express"]),
});

type ShipmentForm = z.infer<typeof shipmentSchema>;

export function CreateShipmentDialog() {
const [open, setOpen] = useState(false);
const {
register,
handleSubmit,
formState: { errors, isSubmitting },
reset,
} = useForm<ShipmentForm>({
resolver: zodResolver(shipmentSchema),
});

const onSubmit = async (data: ShipmentForm) => {
try {
// API call to create shipment
await new Promise((resolve) => setTimeout(resolve, 1000));
toast.success("Shipment created successfully!");
setOpen(false);
reset();
} catch (error) {
toast.error("Failed to create shipment");
}
};

return (

<Dialog open={open} onOpenChange={setOpen}>
<DialogTrigger asChild>
<Button>
<Plus className="mr-2 h-4 w-4" />
New Shipment
</Button>
</DialogTrigger>
<DialogContent className="sm:max-w-[600px]">
<DialogHeader>
<DialogTitle>Create New Shipment</DialogTitle>
</DialogHeader>
<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
<div className="grid grid-cols-2 gap-4">
<div className="space-y-2">
<Label htmlFor="origin">Origin</Label>
<Select {...register("origin")}>
<SelectTrigger>
<SelectValue placeholder="Select origin" />
</SelectTrigger>
<SelectContent>
<SelectItem value="imphal">Imphal</SelectItem>
<SelectItem value="delhi">New Delhi</SelectItem>
</SelectContent>
</Select>
{errors.origin && (
<p className="text-sm text-destructive">{errors.origin.message}</p>
)}
</div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Select {...register("destination")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="imphal">Imphal</SelectItem>
                  <SelectItem value="delhi">New Delhi</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                </SelectContent>
              </Select>
              {errors.destination && (Continue6:58 AM            <p className="text-sm text-destructive">{errors.destination.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            {...register("weight", { valueAsNumber: true })}
          />
          {errors.weight && (
            <p className="text-sm text-destructive">{errors.weight.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pieces">Pieces</Label>
          <Input
            id="pieces"
            type="number"
            {...register("pieces", { valueAsNumber: true })}
          />
          {errors.pieces && (
            <p className="text-sm text-destructive">{errors.pieces.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Shipment"}
        </Button>
      </div>
    </form>

  </DialogContent>
</Dialog>
);
}

---

## **Phase 11: Testing & Quality Assurance**

### 11.1 Component Testing Checklist

```markdown
# Component Testing Checklist

## Visual Testing

- [ ] Renders correctly in light/dark mode
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1440px)
- [ ] Icons align properly
- [ ] Typography scales correctly
- [ ] Spacing is consistent

## Functional Testing

- [ ] All buttons trigger correct actions
- [ ] Forms validate inputs
- [ ] Error states display properly
- [ ] Loading states show during async operations
- [ ] Success/error toasts appear

## Accessibility Testing

- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Screen reader labels present
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Form errors are announced

## Performance Testing

- [ ] Initial load < 2s
- [ ] No layout shift (CLS < 0.1)
- [ ] Images lazy load
- [ ] Tables virtualize for 1000+ rows
```

---

## **Phase 12: Documentation & Handoff**

### 12.1 Component Documentation Template

````typescript
// components/dashboard/stat-card.tsx

/**
 * StatCard Component
 *
 * Displays a key performance indicator (KPI) with optional trend indicator.
 * Used across dashboard pages for consistent metric display.
 *
 * @example
 * ```tsx
 * <StatCard
 *   title="Active Shipments"
 *   value="1,247"
 *   icon={Package}
 *   trend={{ value: 12.5, isPositive: true }}
 * />
 * ```
 *
 * @param {string} title - The label for the stat
 * @param {string | number} value - The stat value to display
 * @param {LucideIcon} icon - Icon component from lucide-react
 * @param {object} [trend] - Optional trend indicator
 * @param {number} trend.value - Percentage change
 * @param {boolean} trend.isPositive - Whether change is positive
 *
 * @see {@link https://ui.shadcn.com/docs/components/card | Card Component}
 */
````

### 12.2 Project README

```markdown
# TAC Cargo Dashboard

Modern logistics management dashboard built with Next.js 15, shadcn/ui, and Supabase.

## Quick Start

\`\`\`bash

# Install dependencies

npm install

# Set up environment variables

cp .env.example .env.local

# Run development server

npm run dev
\`\`\`

## Project Structure

\`\`\`
tac-cargo/
├── app/ # Next.js App Router
│ └── dashboard/ # Dashboard pages
├── components/
│ ├── ui/ # shadcn components
│ └── dashboard/ # Custom patterns
├── lib/
│ ├── supabase/ # Database clients
│ └── design-tokens.ts # Design system
└── hooks/ # Custom React hooks
\`\`\`

## Design System

### Colors

- Primary: Indigo (#4F46E5)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Destructive: Red (#EF4444)

### Typography

- Sans: Figtree
- Mono: JetBrains Mono

### Spacing

- xs: 8px
- sm: 12px
- md: 16px
- lg: 24px
- xl: 32px

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript check

## Component Usage

See `/docs/components` for detailed component documentation.
```

---

## 🎯 **Final Deliverables Checklist**

### ✅ **Foundation** (Days 1-2)

- [x] Project created with shadcn preset
- [x] Design tokens defined
- [x] Global styles configured
- [x] Core components installed

### ✅ **Layout System** (Days 2-3)

- [x] AppShell with sidebar
- [x] AppHeader with breadcrumbs
- [x] PageLayout wrapper
- [x] Responsive navigation

### ✅ **Pattern Library** (Days 3-4)

- [x] StatCard component
- [x] StatusBadge component
- [x] DataTable wrapper
- [x] SearchFilter component
- [x] ActionMenu component
- [x] EmptyState component
- [x] Loading skeletons

### ✅ **Features** (Days 4-7)

- [x] Dashboard home page
- [x] Shipments module
- [x] Tracking module (real-time)
- [x] Invoices module
- [x] Form dialogs

### ✅ **Integration** (Days 8-10)

- [x] Supabase setup
- [x] Data fetching hooks
- [x] Real-time subscriptions
- [x] API routes

### ✅ **Polish** (Days 10-12)

- [x] Error handling
- [x] Loading states
- [x] Toast notifications
- [x] Accessibility
- [x] Documentation

---

## 🚀 **Next Steps**

1. **Initialize project** with the shadcn preset command
2. **Install components** from Phase 1
3. **Build layout system** from Phase 3
4. **Implement patterns** from Phase 4
5. **Create dashboard pages** from Phase 8
6. **Connect Supabase** from Phase 9
7. **Add forms** from Phase 10
8. **Test thoroughly** using Phase 11
9. **Document everything** from Phase 12

You now have a **complete blueprint** for building a production-ready TAC Cargo dashboard with:

- ✅ Consistent design system
- ✅ Reusable component patterns
- ✅ Real-time capabilities
- ✅ Type-safe forms
- ✅ Responsive layouts
- ✅ Accessible UI
- ✅ Scalable architecture

**Ready to start building?** 🎉write a PDR/md file7:00 AMTAC Cargo Platform - Product Design & Requirements Document (PDR)
Version: 1.0.0
Last Updated: December 31, 2024
Status: Approved for Development
Project Code: TAC-2024-001

Table of Contents

Executive Summary
Project Overview
Business Requirements
Functional Requirements
Technical Architecture
Design System
User Experience
Data Models
API Specifications
Security & Compliance
Performance Requirements
Development Roadmap
Risk Assessment
Appendices

1. Executive Summary
   1.1 Project Vision
   TAC (Tapan Air Cargo) is a comprehensive, modern logistics management platform designed to streamline cargo operations for Indian logistics companies. The platform provides end-to-end visibility into shipments, automated invoicing, real-time tracking, and comprehensive analytics.
   1.2 Business Objectives
   ObjectiveTargetTimelineReduce manual processing time60% reductionQ2 2025Improve shipment visibility95% real-time trackingQ1 2025Automate invoice generation100% automationQ1 2025Enhance customer satisfactionNPS > 8.0Q3 2025Reduce operational costs40% reductionQ4 2025
   1.3 Success Metrics

Operational Efficiency: 50% faster shipment processing
Customer Engagement: 80% portal adoption rate
Financial Impact: ₹2.5M annual savings in operational costs
System Reliability: 99.9% uptime
User Satisfaction: 90% positive feedback score

2. Project Overview
   2.1 Problem Statement
   Current Challenges:

Manual shipment tracking with paper-based systems
Delayed invoice generation (3-5 days)
No real-time visibility for customers
Fragmented communication across channels
Inefficient inventory management
Limited analytics and reporting

Business Impact:

Lost revenue: ~₹500K/month due to billing delays
Customer complaints: 45% related to lack of visibility
Operational inefficiency: 60% of staff time on manual tasks
Inventory discrepancies: 15% variance in stock counts

2.2 Solution Overview
TAC Platform provides:

Unified Dashboard: Single source of truth for all operations
Real-time Tracking: Live shipment status with barcode scanning
Automated Billing: GST-compliant invoices generated instantly
Multi-channel Communication: WhatsApp, SMS, email notifications
Advanced Analytics: Business intelligence and reporting
Inventory Management: Perpetual inventory with low-stock alerts

2.3 Target Users
User RoleCountPrimary Use CasesAdmin5System configuration, user management, cross-location oversightManager10Rate management, analytics, approvalsOperator50Shipment booking, scanning, manifest creationViewer20Dashboard viewing, report accessCustomer500+Public tracking, invoice access
2.4 Scope
In Scope:

✅ Shipment lifecycle management
✅ Invoice generation and payment tracking
✅ Real-time barcode tracking
✅ Manifest management
✅ Inventory control
✅ Customer management
✅ Analytics and reporting
✅ WhatsApp/SMS notifications
✅ Multi-location support (Imphal, New Delhi)
✅ Role-based access control

Out of Scope (Phase 2):

❌ Mobile native apps
❌ Third-party carrier integrations
❌ Route optimization
❌ Driver management
❌ Customs clearance automation

3. Business Requirements
   3.1 Operational Locations
   3.1.1 Primary Hubs
   Imphal Hub (IMF)

Location: Imphal, Manipur
Type: Origin hub for Northeast India shipments
Capacity: 500 shipments/day
Operating Hours: 24/7
Staff: 25 personnel

New Delhi Hub (DEL)

Location: New Delhi, NCR
Type: National distribution center
Capacity: 1,000 shipments/day
Operating Hours: 24/7
Staff: 40 personnel

3.1.2 Location-Based Requirements
RequirementImphalNew DelhiData isolation✅ Yes✅ YesCross-location visibilityManagers+Managers+Local rate management✅ Yes✅ YesIndependent operations✅ Yes✅ Yes
3.2 Core Business Processes
3.2.1 Shipment Workflow
mermaidgraph LR
A[Booking] --> B[Pickup]
B --> C[Origin Scan]
C --> D[Manifest Creation]
D --> E[In Transit]
E --> F[Destination Scan]
F --> G[Out for Delivery]
G --> H[Delivered]
H --> I[POD Capture]
Workflow Details:

Booking

Customer details capture
Origin/destination selection
Weight and dimensions entry
Service type selection (air/surface/express)
Rate calculation
Invoice generation

Pickup

Pickup scheduling
Barcode label printing
Package collection
Scan at pickup location

Transit

Manifest creation for transport
In-transit scans at checkpoints
ETA calculation and updates
Exception handling

Delivery

Out-for-delivery notification
Final delivery scan
POD (Proof of Delivery) capture
Customer signature/photo
Completion notification

3.2.2 Invoice Workflow
mermaidgraph LR
A[Shipment Created] --> B[Auto-calculate Charges]
B --> C[Generate Invoice]
C --> D[Send via WhatsApp/SMS]
D --> E[Customer Payment]
E --> F[Record Payment]
F --> G[Update AR]

```

**Invoice Requirements:**
- GST compliance (CGST, SGST, IGST)
- Multiple payment modes (cash, UPI, bank transfer, credit)
- PDF generation with QR code
- Multi-channel delivery (WhatsApp, SMS, email)
- Payment tracking and aging analysis

### 3.3 Regulatory Compliance

#### 3.3.1 GST Compliance

- **GST Registration**: Company GST number on all invoices
- **Tax Calculation**:
  - CGST + SGST for intra-state shipments
  - IGST for inter-state shipments
- **HSN/SAC Codes**: 996511 (Transport of goods by air)
- **GST Returns**: Monthly GSTR-1 filing capability
- **Invoice Series**: Continuous numbering per location

#### 3.3.2 Data Protection

- Compliance with IT Act 2000
- Customer data encryption (AES-256)
- PII (Personally Identifiable Information) protection
- Data retention policy: 7 years for financial records
- Right to data portability

---

## 4. Functional Requirements

### 4.1 Shipment Management

#### FR-SM-001: Create Shipment
**Priority:** High
**User Roles:** Operator, Manager, Admin

**Requirements:**
- Capture customer details (shipper and consignee)
- Select origin and destination hubs
- Enter weight (actual and volumetric)
- Enter dimensions (L × W × H)
- Select transport mode (air/surface/express)
- Calculate freight charges based on rate matrix
- Generate unique shipment reference (SHP-{LOCATION}-{YYMM}-{SEQUENCE})
- Print barcode label
- Create invoice automatically

**Acceptance Criteria:**
- ✅ Shipment created with unique reference
- ✅ Barcode generated and printable
- ✅ Invoice auto-generated
- ✅ Customer receives booking confirmation
- ✅ All fields validated before submission

#### FR-SM-002: Track Shipment
**Priority:** High
**User Roles:** All

**Requirements:**
- Real-time status updates via barcode scans
- Progress indicator (0-100%)
- ETA calculation based on transport mode
- Scan event history with timestamps
- Location tracking at each checkpoint
- Exception alerts (delays, damage, lost)

**Acceptance Criteria:**
- ✅ Status updates within 5 seconds of scan
- ✅ ETA accuracy within 4 hours
- ✅ Complete scan history visible
- ✅ Public tracking page accessible without login

#### FR-SM-003: Update Shipment Status
**Priority:** High
**User Roles:** Operator, Manager, Admin

**Requirements:**
- Scan barcode at checkpoints
- Update status (pending → in-transit → delivered)
- Capture location and timestamp
- Upload POD (photo/signature)
- Trigger customer notifications
- Update shipment progress percentage

**Status Flow:**
```

pending → picked_up → in_transit → at_hub →
out_for_delivery → delivered
Acceptance Criteria:

✅ Barcode scan updates status immediately
✅ Notifications sent within 1 minute
✅ POD captured and stored
✅ Audit trail maintained

FR-SM-004: Search & Filter Shipments
Priority: Medium
User Roles: All
Requirements:

Search by shipment reference
Search by customer name/phone
Filter by status
Filter by date range
Filter by origin/destination
Filter by transport mode
Export results to CSV/Excel

Acceptance Criteria:

✅ Search results appear within 1 second
✅ Multiple filters can be combined
✅ Export includes all visible columns

4.2 Invoice Management
FR-IM-001: Generate Invoice
Priority: High
User Roles: Operator, Manager, Admin
Requirements:

Auto-generate from shipment data
Calculate GST (18% default)
Support multiple charge types:

Freight charges
Pickup charges
Packing charges
Docket charges
Delivery charges
Insurance

Generate PDF with company logo
Include QR code for tracking
Sequential numbering (INV-{LOCATION}-{YYMM}-{SEQUENCE})

Acceptance Criteria:

✅ Invoice generated within 2 seconds
✅ PDF downloadable
✅ All charges calculated correctly
✅ GST breakdown shown

FR-IM-002: Send Invoice
Priority: High
User Roles: Operator, Manager, Admin
Requirements:

Send via WhatsApp (primary)
Send via SMS (fallback)
Send via email
Include PDF attachment
Track delivery status
Retry failed sends
Log all send attempts

Acceptance Criteria:

✅ Message sent within 30 seconds
✅ Delivery confirmation received
✅ Failed sends retried after 5 minutes
✅ Send history visible in logs

FR-IM-003: Record Payment
Priority: High
User Roles: Operator, Manager, Admin
Requirements:

Record payment amount
Select payment mode (cash/UPI/NEFT/cheque)
Enter transaction reference
Support partial payments
Calculate outstanding balance
Update invoice status
Generate payment receipt

Payment Modes:

Cash
UPI
Bank Transfer (NEFT/RTGS)
Cheque
Credit terms

Acceptance Criteria:

✅ Payment recorded and invoice updated
✅ Receipt generated
✅ Outstanding balance calculated
✅ AR report updated

FR-IM-004: Invoice Analytics
Priority: Medium
User Roles: Manager, Admin
Requirements:

Total revenue (daily/weekly/monthly)
Outstanding amount
Aging analysis (0-30, 31-60, 61-90, 90+ days)
Payment trends
Customer-wise revenue
Export reports to PDF/Excel

Acceptance Criteria:

✅ Real-time data updates
✅ Accurate calculations
✅ Export functionality works

4.3 Barcode & Tracking
FR-BT-001: Generate Barcodes
Priority: High
User Roles: Operator, Manager, Admin
Requirements:

Support GS1 standards (SSCC-18, GTIN-14)
Support custom TAC format
Include shipment reference
Include origin and destination
Include weight
Printable in multiple sizes (4×6", 2×2")
Generate QR code for public tracking

Barcode Formats:

SSCC-18: (00)001234500000000018
TAC Format: TG-PKG-{DATE}-{SEQUENCE}
QR Code: https://tac.com/track?ref={SHIPMENT_REF}

Acceptance Criteria:

✅ Barcode scannable by standard readers
✅ Print quality suitable for logistics
✅ Multiple copies can be printed

FR-BT-002: Scan Tracking Events
Priority: High
User Roles: Operator
Requirements:

Scan via barcode reader
Scan via mobile camera
Update shipment status automatically
Capture location from scan device
Record operator details
Timestamp with millisecond precision
Handle offline scanning (sync when online)

Acceptance Criteria:

✅ Scan registered within 2 seconds
✅ Status updated in database
✅ Customer notification triggered
✅ Offline scans sync automatically

FR-BT-003: Public Tracking
Priority: High
User Roles: Public (no authentication)
Requirements:

Search by shipment reference or barcode
Display current status
Show progress timeline
Display ETA
Show scan history
Responsive design for mobile
Rate limiting to prevent abuse

Acceptance Criteria:

✅ Page loads within 2 seconds
✅ Works without login
✅ Mobile-friendly interface
✅ Accurate real-time data

4.4 Manifest Management
FR-MM-001: Create Manifest
Priority: High
User Roles: Operator, Manager, Admin
Requirements:

Group shipments by route
Select origin and destination
Add airline/carrier details
Add flight/vehicle number
Calculate total weight and pieces
Generate manifest reference (MAN-{LOCATION}-{YYMM}-{SEQUENCE})
Print manifest document
Mark shipments as manifested

Acceptance Criteria:

✅ Manifest created with all shipments
✅ Total weight calculated
✅ Printable PDF generated
✅ Shipments locked from editing

FR-MM-002: Manifest Tracking
Priority: Medium
User Roles: Manager, Admin
Requirements:

Track manifest status (draft/finalized/dispatched/received)
Update departure and arrival times
Record weight discrepancies
Handle damaged/missing items
Close manifest on receipt
Generate manifest reports

Acceptance Criteria:

✅ Status updates tracked
✅ Discrepancies recorded
✅ Reports generated

4.5 Inventory Management
FR-INV-001: Stock Management
Priority: Medium
User Roles: Operator, Manager
Requirements:

Track packing materials (boxes, tape, bubble wrap)
Track labels and stationery
Real-time stock levels
Low stock alerts (threshold: min_stock)
Stock adjustments (inbound/outbound)
Cycle count reconciliation
Location-wise stock tracking

Acceptance Criteria:

✅ Stock levels accurate within 2%
✅ Alerts sent when stock below threshold
✅ All adjustments logged

FR-INV-002: Stock Adjustments
Priority: Medium
User Roles: Operator, Manager
Requirements:

Record inbound receipts
Record outbound consumption
Manual adjustments with reason
Cycle count adjustments
Audit trail for all changes
Approval workflow for large adjustments (>1000 units)

Acceptance Criteria:

✅ Adjustments recorded with reason
✅ Audit trail maintained
✅ Manager approval for large changes

4.6 Customer Management
FR-CM-001: Customer Records
Priority: High
User Roles: Operator, Manager, Admin
Requirements:

Create customer profile
Capture contact details (phone, email)
Capture address with pincode
Capture GST number (optional)
Set customer type (regular/corporate/VIP)
Set credit limit and payment terms
Track shipment history
Track invoice history

Acceptance Criteria:

✅ Complete customer record
✅ GST number validated (format check)
✅ History accessible

FR-CM-002: Customer Search
Priority: Medium
User Roles: All
Requirements:

Search by name
Search by phone number
Search by email
Search by GST number
Fuzzy matching for names
Results sorted by relevance

Acceptance Criteria:

✅ Search results within 1 second
✅ Partial matches shown

4.7 Analytics & Reporting
FR-AR-001: Dashboard KPIs
Priority: High
User Roles: Manager, Admin
Requirements:

Active shipments count
In-transit shipments count
Revenue (daily/weekly/monthly)
Pending invoices value
Warehouse capacity utilization
Exception count
Trend indicators (% change)
Sparkline charts for trends

Acceptance Criteria:

✅ Real-time data (max 5 min delay)
✅ Accurate calculations
✅ Visual trend indicators

FR-AR-002: Financial Reports
Priority: High
User Roles: Manager, Admin
Requirements:

AR Aging Report
Revenue by route
Revenue by customer
Payment collection trends
Outstanding invoices list
Overdue invoices report
Export to PDF/Excel
Date range filtering

Acceptance Criteria:

✅ Reports generated within 10 seconds
✅ Data accuracy 100%
✅ Export functionality works

FR-AR-003: Operational Reports
Priority: Medium
User Roles: Manager, Admin
Requirements:

On-time delivery rate
Average transit time by route
Exception rate
Shipments by transport mode
Daily shipment volume
Peak hours analysis
Operator performance metrics

Acceptance Criteria:

✅ Historical data up to 2 years
✅ Configurable date ranges
✅ Charts and visualizations

5.  Technical Architecture
    5.1 Technology Stack
    Frontend
    typescript{
    "framework": "Next.js 15.3",
    "language": "TypeScript 5.x",
    "styling": "Tailwind CSS v4",
    "ui_components": "shadcn/ui (Mira style)",
    "color_system": "OKLCH",
    "icons": "Lucide React",
    "state_management": "Zustand",
    "forms": "React Hook Form + Zod",
    "tables": "@tanstack/react-table",
    "animations": "Framer Motion",
    "date_handling": "date-fns",
    "fonts": {
    "sans": "Figtree",
    "mono": "JetBrains Mono"
    }
    }
    Backend & Database
    typescript{
    "runtime": "Next.js API Routes",
    "database": "Supabase (PostgreSQL 15)",
    "auth": "Supabase Auth",
    "storage": "Supabase Storage",
    "realtime": "Supabase Realtime",
    "rate_limiting": "Upstash Redis"
    }
    External Services
    typescript{
    "whatsapp": "Meta Business API",
    "sms": "Twilio",
    "monitoring": "Sentry",
    "analytics": "Vercel Analytics",
    "pdf_generation": "Puppeteer / react-pdf",
    "barcode_generation": "bwip-js"
    }
    Infrastructure
    typescript{
    "hosting": "Vercel",
    "ci_cd": "GitHub Actions",
    "package_manager": "pnpm",
    "env_management": ".env.local"
    }
    5.2 System Architecture Diagram
    mermaidgraph TB
    subgraph "Client Layer"
    A[Web Browser] --> B[Next.js App]
    C[Mobile Browser] --> B
    end
    subgraph "Application Layer"
    B --> D[Server Components]
    B --> E[API Routes]
    D --> F[Client Components]
    end

        subgraph "Data Layer"
            E --> G[Supabase]
            G --> H[PostgreSQL]
            G --> I[Auth Service]
            G --> J[Storage]
            G --> K[Realtime]
        end

        subgraph "External Services"
            E --> L[WhatsApp API]
            E --> M[Twilio SMS]
            E --> N[Upstash Redis]
            E --> O[Sentry]
        end

```

### 5.3 Database Schema Overview

#### Core Tables

**users**
- Primary authentication and user profiles
- Role-based access control (admin, manager, operator, viewer)
- Location assignment (Imphal, New Delhi)

**customers**
- Customer/client records
- Shipper and consignee information
- GST details and credit limits

**shipments**
- Core shipment records
- Origin/destination tracking
- Status lifecycle management
- ETA calculations

**barcodes**
- Barcode/label records
- GS1 SSCC-18 support
- Scan history linking

**scan_events**
- Real-time tracking events
- Location and timestamp capture
- Operator attribution

**invoices**
- Billing and invoicing
- GST-compliant calculations
- Payment tracking

**payments**
- Payment transactions
- Multiple payment modes
- Invoice reconciliation

**manifests**
- Air cargo manifests
- Shipment grouping
- Weight reconciliation

**manifest_items**
- Line items in manifests
- Shipment-manifest linking

**inventory_items**
- SKU-level inventory
- Location-based stock
- Min/max thresholds

**inventory_adjustments**
- Stock movement audit trail
- Inbound/outbound tracking

**warehouses**
- Hub/warehouse records
- Capacity tracking

**shipment_rates**
- Rate matrix by route
- Transport mode pricing

#### Supporting Tables

**whatsapp_logs**
- Message delivery tracking
- Error logging

**support_tickets**
- Customer support system
- Issue tracking

**audit_logs**
- Security audit trail
- Sensitive operation logging

### 5.4 API Architecture

#### REST API Routes
```

/api/
├── auth/
│ ├── session GET - Get current session
│ ├── getCurrentUser GET - Get user profile
│ └── protected GET - Test auth
│
├── shipments/
│ ├── [id]/eta GET - Get shipment ETA
│ └── protected GET - List shipments
│
├── invoices/
│ ├── / GET - List invoices
│ ├── create POST - Create invoice
│ ├── generate POST - Generate PDF
│ ├── download GET - Download PDF
│ ├── [id]/send-whatsapp POST - Send via WhatsApp
│ └── logs GET - Activity logs
│
├── barcodes/
│ ├── generate POST - Generate barcode
│ ├── gs1 POST - Generate GS1
│ └── gs1?validate=X GET - Validate GS1
│
├── scans/
│ └── / POST - Record scan event
│
├── inventory/
│ ├── / GET - List items
│ └── / POST - Adjust stock
│
├── manifests/
│ ├── / GET - List manifests
│ └── / POST - Create manifest
│
├── customers/
│ └── update POST - Update customer
│
├── finance/
│ ├── ar GET - AR summary
│ └── payments POST - Record payment
│
├── public/
│ ├── track POST - Public tracking
│ └── support POST - Submit support ticket
│
└── search/
└── / GET - Global search
5.5 Security Architecture
Authentication Flow
mermaidsequenceDiagram
participant U as User
participant A as App
participant S as Supabase Auth
participant D as Database

    U->>A: Login with email/password
    A->>S: signInWithPassword()
    S->>S: Validate credentials
    S->>A: Return JWT token
    A->>A: Store in HTTP-only cookie
    A->>D: Fetch user profile
    D->>A: Return role & location
    A->>U: Redirect to dashboard

Authorization Layers

Route Protection (Middleware)

Check for valid session
Redirect unauthenticated users

Role-Based Access Control (Application Logic)

Admin: Full access
Manager: Location-agnostic reads, rate management
Operator: Location-specific operations
Viewer: Read-only access

Row-Level Security (Database)

PostgreSQL RLS policies
User-location data isolation
Automatic policy enforcement

API Rate Limiting (Upstash Redis)

Public endpoints: 10 req/min
Authenticated: 60 req/min
Admin: 120 req/min

6. Design System
   6.1 Brand Identity
   Company: Tapan Air Cargo
   Tagline: Swift. Secure. Seamless.
   Brand Personality: Professional, Reliable, Modern, Efficient
   6.2 Color Palette (OKLCH)
   Primary Colors
   css--primary: oklch(0.48 0.15 250); /_ Indigo #4F46E5 _/
   --primary-foreground: oklch(0.98 0.02 240); /_ Near white _/
   Background Colors
   css--background: oklch(0.12 0.02 240); /_ Dark navy _/
   --foreground: oklch(0.98 0.02 240); /_ Off-white _/
   --muted: oklch(0.18 0.02 240); /_ Muted dark _/
   --muted-foreground: oklch(0.65 0.02 240); /_ Gray _/
   Status Colors
   css--success: oklch(0.65 0.18 145); /_ Green #10B981 _/
   --warning: oklch(0.75 0.18 85); /_ Yellow #F59E0B _/
   --info: oklch(0.60 0.18 230); /_ Blue #3B82F6 _/
   --destructive: oklch(0.55 0.22 25); /_ Red #EF4444 _/
   Semantic Mapping (Logistics)

Pending: Warning (Yellow)
In Transit: Info (Blue)
Delivered: Success (Green)
Cancelled: Destructive (Red)
Exception: Warning (Yellow)

6.3 Typography
Font Families
css--font-sans: "Figtree", system-ui, sans-serif;
--font-mono: "JetBrains Mono", Consolas, monospace;
Type Scale
ElementSizeWeightLine HeightUsageH136px7001.2Page titlesH230px6001.3Section titlesH324px6001.4Card titlesH420px6001.5Subsection titlesBody16px4001.6Body textSmall14px4001.5Helper textMono14px4001.5Reference numbers
Typography Usage Rules

Page Titles: className="text-3xl font-bold tracking-tight"
Descriptions: className="text-muted-foreground"
Reference Numbers: className="font-mono text-sm"
Stats/KPIs: className="text-2xl font-bold"

6.4 Spacing System
typescriptconst spacing = {
xs: '0.5rem', // 8px - Tight spacing
sm: '0.75rem', // 12px - Compact spacing
md: '1rem', // 16px - Default spacing
lg: '1.5rem', // 24px - Section spacing
xl: '2rem', // 32px - Page spacing
'2xl': '3rem', // 48px - Large gaps
};
Usage:

Gap between list items: gap-3 (12px)
Gap between sections: gap-6 (24px)
Card padding: p-4 or p-6
Page padding: p-6 mobile, p-8 desktop

6.5 Layout System
Grid System
css/_ Desktop: 4 columns _/
.grid { grid-template-columns: repeat(4, 1fr); }

/_ Tablet: 2 columns _/
@media (max-width: 1024px) {
.grid { grid-template-columns: repeat(2, 1fr); }
}

/_ Mobile: 1 column _/
@media (max-width: 640px) {
.grid { grid-template-columns: 1fr; }
}
Container Widths

Max Width: 1440px
Padding: 16px mobile, 24px tablet, 32px desktop

Sidebar Layout

Expanded Width: 256px (16rem)
Collapsed Width: 64px (4rem)
Header Height: 64px (4rem)

6.6 Component Specifications
Buttons
tsx<Button variant="default"> {/_ Primary action _/}
<Button variant="secondary"> {/_ Secondary action _/}
<Button variant="outline"> {/_ Tertiary action _/}
<Button variant="ghost"> {/_ Minimal action _/}
<Button variant="destructive"> {/_ Destructive action _/}
Sizes:

size="sm" - 32px height
size="default" - 40px height
size="lg" - 48px height
size="icon" - 40×40px square

Cards
tsx<Card>
<CardHeader>
<CardTitle>Title</CardTitle>
<CardDescription>Description</CardDescription>
</CardHeader>
<CardContent>
{/_ Main content _/}
</CardContent>
<CardFooter>
{/_ Actions _/}
</CardFooter>
</Card>
Card Variants:

Default: Neutral surface, no elevation, border-divider only

---

# TAC SaaS Dashboard — UI/UX & Frontend Architecture Planning (Continuation)

> **Scope**  
> This document continues and completes `planning.md`, strictly adhering to `global_rules.md`.  
> Objective: define a **robust, production-grade TAC SaaS dashboard** for a modern cargo and logistics service with **consistent UI, stable dependencies, scalable architecture, and future-ready technology choices**.

---

## 1. Baseline UI Initialization (Locked)

### 1.1 Shadcn UI Preset (Authoritative)

This preset is **non-negotiable** and forms the foundation of the entire design system:

```bash
npx shadcn@latest create \
  --preset "https://ui.shadcn.com/init?base=radix&style=mira&baseColor=gray&theme=indigo&iconLibrary=lucide&font=figtree&menuAccent=subtle&menuColor=default&radius=none&template=next" \
  --template next
```

### 1.2 Resulting Guarantees

- Radix-first accessibility
- Mira aesthetic (enterprise-grade minimalism)
- Neutral gray base with indigo authority tone
- Zero border radius (industrial / logistics feel)
- Lucide icons (performance + clarity)
- Figtree typography (modern SaaS readability)

---

## 2. Design System Completion (Continuation from Card Variants: Default)

### 2.1 Card Variants (Finalized)

```
Card Variants
├── Default
│   └── Neutral surface, no elevation, border-divider only
├── Metric
│   └── KPI-focused, large numerals, muted labels
├── Interactive
│   └── Hover + focus ring, cursor affordance
├── Status
│   ├── Success (Delivered)
│   ├── Warning (Pending / Hold)
│   └── Error (Delayed / Exception)
├── Manifest
│   └── Dense layout, tabular hybrid
├── Invoice
│   └── Print-safe, strict alignment, mono numerics
└── Scanner
    └── High-contrast, real-time feedback
```

---

## 3. Color System (Cargo-Grade Semantics)

### 3.1 Core Palette (OKLCH Compatible)

| Token           | Purpose            |
| --------------- | ------------------ |
| `--background`  | Operational canvas |
| `--foreground`  | Primary text       |
| `--primary`     | Actions, CTAs      |
| `--secondary`   | System UI          |
| `--muted`       | Metadata           |
| `--accent`      | Focus & highlights |
| `--destructive` | Failures           |

### 3.2 Semantic Extensions

```css
--status-success
--status-warning
--status-error
--status-info
--cargo-air
--cargo-surface
--cargo-hub
```

**Rules:**

- No raw hex usage
- All colors must map to semantic tokens
- Dark mode parity required

---

## 4. Typography Rules

### 4.1 Font Stack

- **Primary:** Figtree
- **Numeric / Codes:** `tabular-nums`
- **Invoice IDs / Barcodes:** mono fallback

### 4.2 Hierarchy Lock

```
H1 — Dashboard Titles
H2 — Section Headers
H3 — Card Titles
Body — Operational text
Meta — Timestamps, IDs
```

---

## 5. Core Component Inventory (Mandatory)

### 5.1 Layout & Navigation

- App Shell
- Sidebar (collapsible, role-aware)
- Command Menu (⌘K)
- Breadcrumbs
- Sticky Topbar

### 5.2 Data & Operations

- Data Table (virtualized)
- Filters (date, route, status)
- Pagination (cursor-based)
- Bulk actions
- Inline edit cells

### 5.3 Cargo-Specific Components

- Shipment Timeline
- Barcode Preview
- Manifest Builder
- Invoice Renderer (PDF-safe)
- Scan Session Panel
- Package Density Grid

---

## 6. Dashboard Modules (SaaS Grade)

### 6.1 Overview

- Live metrics
- Capacity utilization
- Delay heatmap

### 6.2 Shipments

- Create / Update
- Status lifecycle
- Location hops

### 6.3 Invoices

- Auto-generate via barcode
- Versioned invoices
- Audit trail

### 6.4 Manifest

- Air / Surface separation
- Scan-to-add
- Daily dispatch locking

### 6.5 Inventory

- Warehouse zones
- Package aging
- Lost / exception handling

### 6.6 Admin

- Roles & permissions
- Pricing slabs
- System configuration

---

## 7. State & Data Architecture

### 7.1 Frontend State

- URL = Source of truth
- Server Components for reads
- Client Components only for interaction
- No global client state unless unavoidable

### 7.2 Data Fetching

- Typed fetchers
- Suspense boundaries
- Optimistic updates

---

## 8. Performance & Scale Rules

- Route-level code splitting
- Table virtualization mandatory
- No unbounded lists
- Edge-ready APIs
- Image-free critical paths

---

## 9. Accessibility & Compliance

- WCAG 2.2 AA baseline
- Keyboard navigation everywhere
- Screen-reader invoice support
- Color contrast enforced

---

## 10. MCP Usage Protocol (Instructional)

Use available MCP servers only for:

- Reading official documentation
- Verifying breaking changes
- Confirming API contracts

**Rules:**

- No speculative implementation
- Docs-first decisions only
- Cache learnings into planning docs

---

## 11. Non-Negotiable Constraints

- No ad-hoc UI components
- No duplicate patterns
- No inline styling
- No premature animations
- No AI mentions in UI or prompts

---

## 12. Definition of "Complete Planning"

Planning is considered complete only when:

1. Every dashboard module maps to components
2. All components map to tokens
3. All tokens map to theme variables
4. All interactions are keyboard-accessible
5. Print & scan workflows are validated

---

## 13. Next Actions (Strict Order)

1. Lock design tokens
2. Scaffold core layout
3. Build data table system
4. Implement invoice + manifest flow
5. Integrate barcode scanning logic
6. Harden accessibility
7. Performance audit

---

> **This document supersedes the incomplete section in planning.md and must be followed verbatim.**
