Enhanced Color Scheme for TAC Cargo
Looking at your current stack, here's the optimized OKLCH color scheme that will work perfectly with your existing setup:

@import "tailwindcss";

@layer base {
  :root {
    color-scheme: dark;

    /* Base - Deep navy with cargo/logistics feel */
    --background: oklch(0.14 0.025 245);
    --foreground: oklch(0.98 0.00 0);

    /* Cards - Elevated surfaces */
    --card: oklch(0.17 0.025 245);
    --card-foreground: oklch(0.98 0.00 0);

    /* Popover */
    --popover: oklch(0.17 0.025 245);
    --popover-foreground: oklch(0.98 0.00 0);

    /* Primary - Vibrant cyan/teal (logistics, movement, shipping) */
    --primary: oklch(0.68 0.20 195);
    --primary-foreground: oklch(0.12 0.025 245);

    /* Secondary - Subtle container */
    --secondary: oklch(0.22 0.03 245);
    --secondary-foreground: oklch(0.98 0.00 0);

    /* Muted */
    --muted: oklch(0.22 0.03 245);
    --muted-foreground: oklch(0.68 0.02 245);

    /* Accent - Electric blue for CTAs */
    --accent: oklch(0.62 0.26 240);
    --accent-foreground: oklch(1 0 0);

    /* Destructive - Coral red for delays/issues */
    --destructive: oklch(0.66 0.22 25);
    --destructive-foreground: oklch(1 0 0);

    /* Success - Fresh green for delivered */
    --success: oklch(0.72 0.18 152);
    --success-foreground: oklch(0.12 0.025 245);

    /* Warning - Amber for pending/in-transit */
    --warning: oklch(0.78 0.16 85);
    --warning-foreground: oklch(0.12 0.025 245);

    /* Info - Sky blue for notifications */
    --info: oklch(0.70 0.18 220);
    --info-foreground: oklch(0.12 0.025 245);

    /* Borders & inputs */
    --border: oklch(0.30 0.03 245);
    --input: oklch(0.30 0.03 245);
    --ring: oklch(0.68 0.20 195);

    /* Charts - Harmonious palette for analytics */
    --chart-1: oklch(0.68 0.20 195); /* Cyan - Primary */
    --chart-2: oklch(0.72 0.18 152); /* Green - Success */
    --chart-3: oklch(0.78 0.16 85);  /* Amber - Warning */
    --chart-4: oklch(0.62 0.26 240); /* Blue - Accent */
    --chart-5: oklch(0.70 0.20 320); /* Magenta - Highlight */

    /* Sidebar (if needed) */
    --sidebar: oklch(0.12 0.025 245);
    --sidebar-foreground: oklch(0.98 0.00 0);
    --sidebar-primary: oklch(0.68 0.20 195);
    --sidebar-primary-foreground: oklch(0.12 0.025 245);
    --sidebar-accent: oklch(0.22 0.03 245);
    --sidebar-accent-foreground: oklch(0.68 0.20 195);
    --sidebar-border: oklch(0.30 0.03 245);
    --sidebar-ring: oklch(0.68 0.20 195);

    --radius: 0.75rem;
  }

  .light {
    color-scheme: light;

    /* Base - Clean white with subtle warmth */
    --background: oklch(0.99 0.00 0);
    --foreground: oklch(0.14 0.025 245);

    /* Cards - Pure white with shadow elevation */
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.14 0.025 245);

    /* Popover */
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.14 0.025 245);

    /* Primary - Deeper teal for contrast */
    --primary: oklch(0.58 0.18 195);
    --primary-foreground: oklch(1 0 0);

    /* Secondary */
    --secondary: oklch(0.96 0.01 245);
    --secondary-foreground: oklch(0.14 0.025 245);

    /* Muted */
    --muted: oklch(0.96 0.01 245);
    --muted-foreground: oklch(0.52 0.02 245);

    /* Accent - Rich blue */
    --accent: oklch(0.52 0.24 240);
    --accent-foreground: oklch(1 0 0);

    /* Destructive */
    --destructive: oklch(0.60 0.20 25);
    --destructive-foreground: oklch(1 0 0);

    /* Success */
    --success: oklch(0.62 0.16 152);
    --success-foreground: oklch(1 0 0);

    /* Warning */
    --warning: oklch(0.68 0.14 85);
    --warning-foreground: oklch(0.14 0.025 245);

    /* Info */
    --info: oklch(0.60 0.16 220);
    --info-foreground: oklch(1 0 0);

    /* Borders & inputs */
    --border: oklch(0.90 0.01 245);
    --input: oklch(0.90 0.01 245);
    --ring: oklch(0.58 0.18 195);

    /* Charts - Adjusted for light background */
    --chart-1: oklch(0.58 0.18 195);
    --chart-2: oklch(0.62 0.16 152);
    --chart-3: oklch(0.68 0.14 85);
    --chart-4: oklch(0.52 0.24 240);
    --chart-5: oklch(0.64 0.18 320);

    /* Sidebar */
    --sidebar: oklch(0.97 0.00 0);
    --sidebar-foreground: oklch(0.14 0.025 245);
    --sidebar-primary: oklch(0.58 0.18 195);
    --sidebar-primary-foreground: oklch(1 0 0);
    --sidebar-accent: oklch(0.94 0.00 0);
    --sidebar-accent-foreground: oklch(0.58 0.18 195);
    --sidebar-border: oklch(0.90 0.01 245);
    --sidebar-ring: oklch(0.58 0.18 195);
  }
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground antialiased;
  }
}

/* Additional utility classes for cargo-specific status colors */
@layer utilities {
  .status-delivered {
    @apply bg-success/10 text-success border-success/20;
  }
  
  .status-in-transit {
    @apply bg-warning/10 text-warning border-warning/20;
  }
  
  .status-delayed {
    @apply bg-destructive/10 text-destructive border-destructive/20;
  }
  
  .status-pending {
    @apply bg-info/10 text-info border-info/20;
  }
  
  .status-processing {
    @apply bg-primary/10 text-primary border-primary/20;
  }
}

Now here are my recommended package additions to enhance your TAC Cargo project:
📦 Recommended Package Additions
High Priority (Add These)

npm install @tanstack/react-query zustand date-fns react-hook-form zod sonner framer-motion vaul cmdk

Why these packages:

@tanstack/react-query - Essential for real-time shipment data fetching/caching
zustand - Lightweight state management for filters, user preferences
date-fns - Handle delivery dates, ETAs, timestamps (smaller than moment.js)
react-hook-form - Shipment creation forms, booking forms
zod - Schema validation with type safety
sonner - Beautiful toast notifications for shipment updates
framer-motion - Smooth animations for status transitions
vaul - Mobile-friendly bottom sheets for shipment details
cmdk - Command palette for quick actions (search shipments, create booking)

Medium Priority (Consider Adding)

npm install react-leaflet leaflet @tanstack/react-virtual embla-carousel-react nuqs

Why these:

react-leaflet + leaflet - Interactive maps for shipment tracking
@tanstack/react-virtual - Virtualize long shipment lists (performance)
embla-carousel-react - Image carousels for cargo photos
nuqs - Type-safe URL search params (great for filters)

Nice to Have (Add Later)

npm install react-pdf jspdf qrcode.react react-day-picker

🎯 Key Features to Build with This Stack

Real-time Shipment Tracking Dashboard
Interactive Map View (with react-leaflet)
Advanced Filtering (with nuqs for URL state)
Document Generation (shipping labels with react-pdf)
Mobile-First Design (with vaul for mobile sheets)
Command Palette (with cmdk for power users)
Notifications System (with sonner for updates)

The color scheme I provided adds success, warning, and info status colors specifically for cargo tracking states (delivered, in-transit, delayed, pending).

and also check: 🚀 Recommended Tech Stack & Libraries
Core Framework

Next.js 15 with App Router
React 19
TypeScript 5.7+
Tailwind CSS 4.0 (alpha)

UI Components & Animation

shadcn/ui - Already in use, perfect base
Framer Motion - Smooth animations for shipment tracking
Lucide React - Already in use, consistent icons
Vaul - Bottom sheets for mobile shipment details
cmdk - Command palette for quick actions

Data Visualization

Recharts - Already available, great for analytics
Chart.js - Already available, alternative option
tremor - Beautiful dashboard components
@visx/visx - Low-level viz primitives for custom charts

Maps & Geolocation

Mapbox GL JS / @vis.gl/react-google-maps - Live shipment tracking
Leaflet - Open source alternative
turf.js - Geospatial analysis (route optimization)

Real-time & Data

TanStack Query (React Query) - Server state management
Zustand - Client state management
Socket.io / Pusher - Real-time shipment updates
SWR - Alternative to React Query

Forms & Validation

React Hook Form - Shipment forms, bookings
Zod - Schema validation
Conform - Progressive form validation

Tables & Data Display

TanStack Table - Complex cargo manifests
ag-Grid - Enterprise-grade tables

Date & Time

date-fns - Lightweight date manipulation
Day.js - Alternative, smaller bundle

PDF & Documents

react-pdf / @react-pdf/renderer - Generate shipping labels
jsPDF - Alternative PDF generation

Notifications & Feedback

Sonner - Toast notifications for shipment updates
React Hot Toast - Alternative
Notyf - Minimal notifications

Utils & Performance

clsx / tailwind-merge - Class name handling
lodash-es - Tree-shakeable utilities
nanoid - Generate tracking numbers
sharp (server) - Image optimization for cargo photos

Testing

Vitest - Fast unit testing
Playwright - E2E testing
Testing Library - Component testing

Development

Prettier - Code formatting
ESLint - Linting
Husky - Git hooks
Turbo - Monorepo management (if needed)

🎯 Design Principles for Cargo Dashboard

Status-First Design - Prominent delivery status indicators
Scannable Layouts - Quick info parsing for logistics teams
Progressive Disclosure - Details on demand
Mobile-First - Drivers need mobile access
Real-time Feel - Live updates via WebSocket
Data Density - Show more info without clutter

npm install remixicon --save


use for the dashboard  "C:\tac-saas\tac-cargo\public\remixicon" "C:\tac-saas\tac-cargo\public\remixIcon_fonts"


Next.js
Everything you need to set up Tremor with Next.js.

Installation
Tremor is designed for React and requires React v18.2.0+

1
Create a new Next.js project:
In our terminal, we create a new Next.js project. Stick to Tailwind CSS, use the src/ directory and the app router.
npx create-next-app@16.1.1 my-project --ts --tailwind --eslint --app --src-dir && cd my-project

Next 14 will come with Tailwind v3 preinstalled, so we have to update to version 4, run:
npx @tailwindcss/upgrade

2
Install dependencies:
To install the core dependencies, run:

npm install tailwind-variants clsx tailwind-merge @remixicon/react

(Optional) If you plan to use all components, you can add all dependencies here:

npm install @radix-ui/react-accordion @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-radio-group @radix-ui/react-select @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip @radix-ui/react-toggle-group @radix-ui/react-toggle @internationalized/date date-fns@3.6.0 react-day-picker@8.10.1 recharts @react-aria/datepicker @react-stately/datepicker

3
Add font and dark mode background:
In all our examples, we use Geist Font. This is not required, use any other font you like. To install, run:

npm install geist

Then in your app/layout.tsx, add the font and dark mode background like this:

import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans"; // import font
import "./globals.css";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // add font to className, also add antialiased and dark mode
    <html lang="en" className={`${GeistSans.className} antialiased dark:bg-gray-950`}>
      <body>{children}</body>
    </html>
  );
}

4
Install @tailwindcss/forms
To install, run:

npm install -D @tailwindcss/forms

5
Update globals.css
In order for the animations to be applied correctly, we extend the globals.css. We also import the @tailwindcss/forms plugin.

Show less
@import "tailwindcss";
@plugin "@tailwindcss/forms";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --animate-hide: hide 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --animate-slide-down-and-fade: slideDownAndFade 150ms
    cubic-bezier(0.16, 1, 0.3, 1);
  --animate-slide-left-and-fade: slideLeftAndFade 150ms
    cubic-bezier(0.16, 1, 0.3, 1);
  --animate-slide-up-and-fade: slideUpAndFade 150ms
    cubic-bezier(0.16, 1, 0.3, 1);
  --animate-slide-right-and-fade: slideRightAndFade 150ms
    cubic-bezier(0.16, 1, 0.3, 1);
  --animate-accordion-open: accordionOpen 150ms cubic-bezier(0.87, 0, 0.13, 1);
  --animate-accordion-close: accordionClose 150ms cubic-bezier(0.87, 0, 0.13, 1);
  --animate-dialog-overlay-show: dialogOverlayShow 150ms
    cubic-bezier(0.16, 1, 0.3, 1);
  --animate-dialog-content-show: dialogContentShow 150ms
    cubic-bezier(0.16, 1, 0.3, 1);
  --animate-drawer-slide-left-and-fade: drawerSlideLeftAndFade 150ms
    cubic-bezier(0.16, 1, 0.3, 1);
  --animate-drawer-slide-right-and-fade: drawerSlideRightAndFade 150ms ease-in;

  @keyframes hide {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  @keyframes slideDownAndFade {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideLeftAndFade {
    from {
      opacity: 0;
      transform: translateX(6px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes slideUpAndFade {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideRightAndFade {
    from {
      opacity: 0;
      transform: translateX(-6px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes accordionOpen {
    from {
      height: 0px;
    }
    to {
      height: var(--radix-accordion-content-height);
    }
  }
  @keyframes accordionClose {
    from {
      height: var(--radix-accordion-content-height);
    }
    to {
      height: 0px;
    }
  }
  @keyframes dialogOverlayShow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes dialogContentShow {
    from {
      opacity: 0;
      transform: translate(-50%, -45%) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  @keyframes drawerSlideLeftAndFade {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes drawerSlideRightAndFade {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
}

6
Add utilities and helpers
Our components depend on a few utilities. You can read more about them in the Utilities section.

Create a new lib folder in /src. Add a new utils.ts file inside. Paste the following utilities into this file.

Show less
// Tremor Raw cx [v0.0.0]

import clsx, { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args))
}

// Tremor focusInput [v0.0.2]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 dark:focus:ring-blue-700/30",
  // border color
  "focus:border-blue-500 dark:focus:border-blue-700",
]

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
]

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
]

Next, we add the chart utilities. Add a new chartUtils.ts file and paste the following code into this file.

Show less
// Tremor Raw chartColors [v0.1.0]

export type ColorUtility = "bg" | "stroke" | "fill" | "text"

export const chartColors = {
  blue: {
    bg: "bg-blue-500",
    stroke: "stroke-blue-500",
    fill: "fill-blue-500",
    text: "text-blue-500",
  },
  emerald: {
    bg: "bg-emerald-500",
    stroke: "stroke-emerald-500",
    fill: "fill-emerald-500",
    text: "text-emerald-500",
  },
  violet: {
    bg: "bg-violet-500",
    stroke: "stroke-violet-500",
    fill: "fill-violet-500",
    text: "text-violet-500",
  },
  amber: {
    bg: "bg-amber-500",
    stroke: "stroke-amber-500",
    fill: "fill-amber-500",
    text: "text-amber-500",
  },
  gray: {
    bg: "bg-gray-500",
    stroke: "stroke-gray-500",
    fill: "fill-gray-500",
    text: "text-gray-500",
  },
  cyan: {
    bg: "bg-cyan-500",
    stroke: "stroke-cyan-500",
    fill: "fill-cyan-500",
    text: "text-cyan-500",
  },
  pink: {
    bg: "bg-pink-500",
    stroke: "stroke-pink-500",
    fill: "fill-pink-500",
    text: "text-pink-500",
  },
  lime: {
    bg: "bg-lime-500",
    stroke: "stroke-lime-500",
    fill: "fill-lime-500",
    text: "text-lime-500",
  },
  fuchsia: {
    bg: "bg-fuchsia-500",
    stroke: "stroke-fuchsia-500",
    fill: "fill-fuchsia-500",
    text: "text-fuchsia-500",
  },
} as const satisfies {
  [color: string]: {
    [key in ColorUtility]: string
  }
}

export type AvailableChartColorsKeys = keyof typeof chartColors

export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors,
) as Array<AvailableChartColorsKeys>

export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[],
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>()
  categories.forEach((category, index) => {
    categoryColors.set(category, colors[index % colors.length])
  })
  return categoryColors
}

export const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility,
): string => {
  const fallbackColor = {
    bg: "bg-gray-500",
    stroke: "stroke-gray-500",
    fill: "fill-gray-500",
    text: "text-gray-500",
  }
  return chartColors[color]?.[type] ?? fallbackColor[type]
}

// Tremor Raw getYAxisDomain [v0.0.0]

export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined,
) => {
  const minDomain = autoMinValue ? "auto" : minValue ?? 0
  const maxDomain = maxValue ?? "auto"
  return [minDomain, maxDomain]
}

// Tremor Raw hasOnlyOneValueForKey [v0.1.0]

export function hasOnlyOneValueForKey(
  array: any[],
  keyToCheck: string,
): boolean {
  const val: any[] = []

  for (const obj of array) {
    if (Object.prototype.hasOwnProperty.call(obj, keyToCheck)) {
      val.push(obj[keyToCheck])
      if (val.length > 1) {
        return false
      }
    }
  }

  return true
}


7
Notes on your project structure
When adding components, we recommend adding them to a components directory inside /src. Here is an example on how we'd structure our app:

.
├── src
│   ├── app
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── Accordion.tsx
│   │   ├── Badge.tsx
│   │   └── ...
│   └── lib
│       ├── utils.ts
│       └── chartUtils.ts
├── package-lock.json
├── package.json
├── postcss.config.js
└── tsconfig.json
Dark mode usage:

For all examples, we use bg-gray-950 as the overall background color. You can add this to your <html className="dark:bg-gray-950"> tag.

Font smoothing (antialiasing):

On our website, we apply font smoothing and recommend you do the same. Simply add the antialiased utility to the HTML tag <html className="antialiased">.
