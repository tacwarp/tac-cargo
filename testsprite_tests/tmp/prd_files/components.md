# Component Architecture Rules

## Component Categories

### 1. UI Primitives (`components/ui/`)

**Purpose**: Reusable, unstyled base components from shadcn/ui

**Characteristics**:

- Built on Radix UI primitives
- Styled with Tailwind CSS
- No business logic
- Highly composable
- Accessible by default (ARIA)

**Examples**:

- `Button` - Interactive button with variants
- `Card` - Container with header/content/footer
- `Dialog` - Modal overlay
- `Input` - Form input field
- `Tabs` - Tab navigation

**Rules**:

- ❌ Do not modify primitive behavior
- ✅ Extend via composition or wrapper components
- ✅ Override styles via `className` prop
- ❌ Do not add data fetching

### 2. Feature Components (`components/dashboard/`, `components/landing/`)

**Purpose**: Domain-specific components with business logic

**Characteristics**:

- Can be Server or Client Components
- May fetch data (Server) or manage state (Client)
- Compose UI primitives
- Domain-specific styling

**Examples**:

- `StatsOverview` - Dashboard KPI cards
- `AppHeader` - Top navigation with user menu
- `TrackingForm` - Shipment search form
- `HeroSection` - Landing page hero

**Rules**:

- ✅ Server Component by default
- ✅ Mark `'use client'` only when needed
- ✅ Co-locate with related components
- ❌ Do not create "god components" (>300 lines)

### 3. Layout Components (`app-shell.tsx`, `app-sidebar.tsx`)

**Purpose**: Page structure and navigation containers

**Characteristics**:

- Server Components (usually)
- Minimal state
- Composition-focused
- Route-aware

**Examples**:

- `AppShell` - Main dashboard container
- `AppSidebar` - Navigation sidebar
- `AppHeader` - Top bar with actions

**Rules**:

- ✅ Delegate interactivity to children
- ✅ Use slots/children for composition
- ❌ Do not fetch data (delegate to pages)
- ✅ Accept navigation state as props

### 4. Pre-built Blocks (`shadcn-studio/blocks/`)

**Purpose**: Complex, production-ready dashboard components

**Characteristics**:

- Copy-paste from shadcn Studio
- Pre-styled with shadcn/ui
- Chart integrations (Recharts, Nivo)
- Table components (TanStack Table)

**Examples**:

- `ChartSalesMetrics` - Revenue chart widget
- `DatatableTransaction` - Sortable data table
- `WidgetProductInsights` - Analytics card
- `StatisticsCard01` - Metric display card

**Rules**:

- ✅ Customize freely (not installed via npm)
- ✅ Adapt to design system
- ❌ Do not rename (keep original name for reference)
- ✅ Extract reusable parts to `ui/`

## Server vs Client Components

### Server Component (Default)

**When to use**:

- No interactivity needed
- Data fetching required
- SEO-critical content
- Large dependencies (no client bundle cost)

**Capabilities**:

- Direct database/API access
- Server-only code (API keys safe)
- No useState, useEffect, event handlers
- Can import Client Components

**Example**:

```tsx
// No 'use client' directive
import { createClient } from "@/lib/supabase/server";

export async function DashboardStats() {
  const supabase = createClient();
  const { data } = await supabase.from("stats").select("*");

  return <div>{data.total}</div>;
}
```

### Client Component

**When to use**:

- Event handlers (onClick, onChange)
- React hooks (useState, useEffect, useContext)
- Browser APIs (localStorage, window)
- Third-party libraries requiring browser

**Requirements**:

- Must add `'use client'` directive at top
- Cannot import Server Components directly
- Can receive Server Components as children

**Example**:

```tsx
"use client";
import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Composition Pattern

**Preferred**: Pass Server Components as children to Client Components

```tsx
// Client Component (button logic)
"use client";
export function Accordion({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)}>Toggle</button>
      {open && children}
    </div>
  );
}

// Server Component (data fetching)
export async function Page() {
  const data = await fetchData();
  return (
    <Accordion>
      <ServerDataComponent data={data} />
    </Accordion>
  );
}
```

## Import Rules by Layer

### UI Primitives (`components/ui/`)

**Can import**:

- Radix UI primitives
- `@/lib/utils` (cn helper)
- Other UI primitives
- React (useState, useEffect if 'use client')

**Cannot import**:

- Feature components
- Data fetching utilities
- Business logic

### Feature Components

**Can import**:

- UI primitives
- Utilities from `lib/`
- Types from `types/`
- Hooks from `hooks/`
- Other feature components (same category)

**Cannot import**:

- Page-level components
- API route handlers
- Server-only utilities (unless Server Component)

### Layout Components

**Can import**:

- UI primitives
- Feature components
- Navigation utilities
- Auth helpers (Server Components)

**Cannot import**:

- Page-specific logic
- Direct data fetching (delegate to pages)

## Naming Conventions

### Component Files

```
kebab-case.tsx
```

**Examples**: `app-header.tsx`, `stats-overview.tsx`, `theme-toggle.tsx`

### Component Names (PascalCase)

```tsx
export function ComponentName() {}
```

### Props Interface

```tsx
interface ComponentNameProps {
  title: string;
  children?: React.ReactNode;
}

export function ComponentName({ title, children }: ComponentNameProps) {
  // ...
}
```

### Event Handlers

```tsx
interface ButtonProps {
  onClick?: () => void; // Prop
}

export function Button({ onClick }: ButtonProps) {
  const handleClick = () => {
    // Internal handler
    // logic
    onClick?.();
  };

  return <button onClick={handleClick}>Click</button>;
}
```

## Props vs Data Fetching

### Props (Preferred for Composition)

```tsx
interface CardProps {
  title: string;
  value: number;
  trend: "up" | "down";
}

export function MetricCard({ title, value, trend }: CardProps) {
  return (
    <div>
      {title}: {value}
    </div>
  );
}
```

### Data Fetching (Server Components Only)

```tsx
export async function MetricCard({ metricId }: { metricId: string }) {
  const data = await fetchMetric(metricId);
  return (
    <div>
      {data.title}: {data.value}
    </div>
  );
}
```

**Rule**: Prefer passing data as props from parent for better reusability

## shadcn/ui Usage Constraints

### Installation

```bash
npx shadcn@latest add [component]
```

**Location**: Automatically added to `components/ui/`

### Customization Points

1. **`components.json`** - Global configuration
2. **Tailwind theme** - Color tokens, spacing
3. **Component className** - Override styles
4. **Wrapper components** - Extend behavior

### Forbidden Modifications

❌ Do not modify Radix UI primitive imports  
❌ Do not change component file structure  
❌ Do not remove accessibility attributes

### Allowed Modifications

✅ Add new variants via `cva` (class-variance-authority)  
✅ Override default props  
✅ Add utility classes  
✅ Compose into higher-level components

**Example**:

```tsx
// ✅ Good: Extend via composition
export function PrimaryButton({ children, ...props }: ButtonProps) {
  return (
    <Button variant="default" size="lg" {...props}>
      {children}
    </Button>
  );
}

// ❌ Bad: Modify ui/button.tsx directly
```

## Component Organization Patterns

### Co-location

**Related files together**:

```
components/dashboard/
├── app-header.tsx
├── app-header-user-menu.tsx  (if complex enough)
├── app-header.test.tsx        (future)
└── app-header-skeleton.tsx    (loading state)
```

### Composition Over Inheritance

**Prefer**:

```tsx
// Compose smaller components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>{/* content */}</CardContent>
</Card>
```

**Avoid**:

```tsx
// ❌ Don't extend/inherit components
class CustomCard extends Card {}
```

### Render Props Pattern

**When multiple render strategies needed**:

```tsx
interface ListProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
}

export function List<T>({ data, renderItem }: ListProps<T>) {
  return <ul>{data.map(renderItem)}</ul>;
}

// Usage
<List data={items} renderItem={(item) => <li>{item.name}</li>} />;
```

## State Management in Components

### Local State (useState)

**For**: Component-only state

```tsx
"use client";
export function Toggle() {
  const [open, setOpen] = useState(false);
  return <button onClick={() => setOpen(!open)}>Toggle</button>;
}
```

### Shared State (Context)

**For**: Deep prop drilling avoidance

```tsx
"use client";
const ThemeContext = createContext<Theme>("light");

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
```

### Server State (TanStack Query)

**For**: API data synchronization

```tsx
'use client'
import { useQuery } from '@tanstack/react-query'

export function ShipmentList() {
  const { data, isLoading } = useQuery({
    queryKey: ['shipments'],
    queryFn: fetchShipments,
  })

  if (isLoading) return <Skeleton />
  return <ul>{data.map(...)}</ul>
}
```

### Global State (Zustand)

**For**: Client-only cross-component state

```tsx
"use client";
import { create } from "zustand";

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

export function Counter() {
  const { count, increment } = useStore();
  return <button onClick={increment}>{count}</button>;
}
```

## Styling Rules

### Tailwind Utilities (Primary Method)

```tsx
<div className="bg-card flex items-center gap-4 rounded-lg p-4">Content</div>
```

### Conditional Classes

```tsx
import { cn } from "@/lib/utils";

<div
  className={cn(
    "base-class",
    isActive && "active-class",
    isDisabled ? "disabled-class" : "enabled-class",
  )}
>
  Content
</div>;
```

### Variant Patterns (cva)

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("base-styles", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      outline: "border border-input bg-background",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 px-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({ variant, size, children }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size })}>{children}</button>
  );
}
```

### Forbidden Styling Methods

❌ Inline styles (except dynamic values)  
❌ CSS Modules  
❌ styled-components / emotion  
❌ Hardcoded color values

## Performance Optimization

### Memoization

```tsx
"use client";
import { memo, useMemo, useCallback } from "react";

// Memoize expensive component
export const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  return <div>{/* render */}</div>;
});

// Memoize expensive calculation
function Component({ data }) {
  const processedData = useMemo(() => processData(data), [data]);
  return <div>{processedData}</div>;
}

// Memoize callback
function Component({ onSubmit }) {
  const handleSubmit = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### Code Splitting

```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./heavy-component"), {
  loading: () => <Skeleton />,
  ssr: false, // Client-only
});
```

### Image Optimization

```tsx
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={false} // Lazy load
/>;
```

## Accessibility Requirements

### Semantic HTML

```tsx
// ✅ Good
<button onClick={handleClick}>Click</button>

// ❌ Bad
<div onClick={handleClick}>Click</div>
```

### ARIA Attributes

```tsx
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  aria-controls="menu-id"
>
  Toggle
</button>
```

### Keyboard Navigation

```tsx
"use client";
export function Menu() {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      // Handle activation
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      Menu
    </div>
  );
}
```

### Focus Management

```tsx
"use client";
import { useRef, useEffect } from "react";

export function Dialog({ open }: { open: boolean }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  return (
    <dialog open={open}>
      <button ref={closeButtonRef}>Close</button>
    </dialog>
  );
}
```

## Testing Patterns (Future)

### Component Tests

```tsx
// app-header.test.tsx
import { render, screen } from "@testing-library/react";
import { AppHeader } from "./app-header";

test("renders user name", () => {
  render(<AppHeader user={{ name: "John" }} />);
  expect(screen.getByText("John")).toBeInTheDocument();
});
```

## Component Rules Summary

### ✅ Do

- Server Components by default
- Name exports (no default exports)
- TypeScript props interfaces
- Semantic HTML elements
- ARIA attributes for interactivity
- Tailwind for styling
- Compose from UI primitives
- Extract reusable logic to hooks

### ❌ Don't

- Client Components unless necessary
- Hardcoded colors
- Inline styles (except dynamic)
- Large components (>300 lines)
- Deep prop drilling (use Context)
- Modify shadcn/ui primitives directly
- Mix Server/Client code in one file
- Use class-based components
