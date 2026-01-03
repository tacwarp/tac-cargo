# Tailwind CSS & Color System

## CRITICAL NOTICE
**The project previously had inconsistent color usage with hardcoded values and insufficient contrast ratios. All color refactoring is APPROVED and ENCOURAGED to enforce semantic tokens.**

## Color Format

### OKLCH (Mandatory)
**All colors must use OKLCH format** for perceptual uniformity and proper color interpolation.

```css
/* Format: oklch(lightness chroma hue / alpha) */
oklch(0.5 0.2 250)        /* No alpha */
oklch(0.5 0.2 250 / 0.5)  /* With alpha */
```

**Why OKLCH**:
- Perceptually uniform (equal lightness = equal perceived brightness)
- Better than HSL for accessibility
- Native browser support (Chrome/Edge, Firefox, Safari 15+)
- Smooth color interpolation

## Semantic Token System

### Design Philosophy
**Three-tier semantic system**:
1. **Neutral** - Backgrounds, text, borders
2. **Brand/Primary** - Actions, highlights, interactive elements
3. **Semantic** - Status indicators (success, warning, error, info)

### Token Structure
```
--{category}-{variant}-{state}
```

**Examples**:
- `--background` (default background)
- `--foreground` (default text)
- `--primary` (brand color)
- `--primary-foreground` (text on primary background)
- `--destructive` (error/danger color)

## Color Definitions

### Location
**File**: `app/globals.css`

### Dark Theme (Default)
```css
:root {
  /* Neutral Colors */
  --background: oklch(0.18 0.01 260);           /* Main background */
  --foreground: oklch(0.95 0.005 260);          /* Main text */
  
  --card: oklch(0.22 0.015 260);                /* Card background */
  --card-foreground: oklch(0.95 0.005 260);     /* Card text */
  
  --popover: oklch(0.22 0.015 260);             /* Popover background */
  --popover-foreground: oklch(0.95 0.005 260);  /* Popover text */
  
  --muted: oklch(0.28 0.02 252);                /* Muted elements */
  --muted-foreground: oklch(0.60 0.015 252);    /* Muted text */
  
  --border: oklch(0.32 0.03 252);               /* Border color */
  --input: oklch(0.32 0.03 252);                /* Input border */
  --ring: oklch(0.95 0.005 260);                /* Focus ring */
  
  /* Brand Colors */
  --primary: oklch(0.70 0.19 250);              /* Primary brand */
  --primary-foreground: oklch(0.15 0.01 260);   /* Text on primary */
  
  --secondary: oklch(0.28 0.02 252);            /* Secondary actions */
  --secondary-foreground: oklch(0.95 0.005 260);
  
  --accent: oklch(0.28 0.02 252);               /* Accent highlights */
  --accent-foreground: oklch(0.95 0.005 260);
  
  /* Semantic Colors */
  --destructive: oklch(0.55 0.22 25);           /* Error/danger */
  --destructive-foreground: oklch(0.95 0.005 260);
  
  --success: oklch(0.65 0.18 145);              /* Success state */
  --success-foreground: oklch(0.15 0.01 145);
  
  --warning: oklch(0.75 0.15 85);               /* Warning state */
  --warning-foreground: oklch(0.15 0.01 85);
  
  --info: oklch(0.65 0.18 230);                 /* Info state */
  --info-foreground: oklch(0.95 0.005 230);
  
  /* Extended Neutrals */
  --bg-elevated: oklch(0.26 0.015 260);         /* Elevated surfaces */
  --bg-subtle: oklch(0.19 0.01 260);            /* Subtle backgrounds */
  --glass: oklch(0.20 0.02 252 / 0.85);         /* Glass morphism */
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 oklch(0 0 0 / 0.3);
  --shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.4), 0 2px 4px -2px oklch(0 0 0 / 0.3);
  --shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.5), 0 4px 6px -4px oklch(0 0 0 / 0.4);
  --shadow-xl: 0 20px 25px -5px oklch(0 0 0 / 0.5), 0 8px 10px -6px oklch(0 0 0 / 0.4);
  --shadow-2xl: 0 25px 50px -12px oklch(0 0 0 / 0.6);
  --shadow-inner: inset 0 2px 4px 0 oklch(0 0 0 / 0.3);
}
```

### Light Theme
```css
.light, :root:not(.dark) {
  &:where(:not(.dark, .dark *)) {
    /* Neutral Colors */
    --background: oklch(0.98 0.002 260);
    --foreground: oklch(0.15 0.01 260);
    
    --card: oklch(0.99 0.001 260);
    --card-foreground: oklch(0.15 0.01 260);
    
    --popover: oklch(0.99 0.001 260);
    --popover-foreground: oklch(0.15 0.01 260);
    
    --muted: oklch(0.92 0.005 252);
    --muted-foreground: oklch(0.45 0.015 252);
    
    --border: oklch(0.85 0.008 250);
    --input: oklch(0.85 0.008 250);
    --ring: oklch(0.15 0.01 260);
    
    /* Brand Colors */
    --primary: oklch(0.45 0.19 250);
    --primary-foreground: oklch(0.98 0.002 260);
    
    --secondary: oklch(0.92 0.005 252);
    --secondary-foreground: oklch(0.15 0.01 260);
    
    --accent: oklch(0.92 0.005 252);
    --accent-foreground: oklch(0.15 0.01 260);
    
    /* Semantic Colors */
    --destructive: oklch(0.55 0.22 25);
    --destructive-foreground: oklch(0.98 0.002 260);
    
    --success: oklch(0.50 0.18 145);
    --success-foreground: oklch(0.98 0.002 145);
    
    --warning: oklch(0.65 0.15 85);
    --warning-foreground: oklch(0.15 0.01 85);
    
    --info: oklch(0.55 0.18 230);
    --info-foreground: oklch(0.98 0.002 230);
    
    /* Extended Neutrals */
    --bg-elevated: oklch(0.96 0.003 260);
    --bg-subtle: oklch(0.94 0.004 260);
    --glass: oklch(0.95 0.005 252 / 0.92);
    
    /* Shadows */
    --shadow-sm: 0 1px 2px 0 oklch(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px oklch(0 0 0 / 0.08), 0 2px 4px -2px oklch(0 0 0 / 0.05);
    --shadow-lg: 0 10px 15px -3px oklch(0 0 0 / 0.10), 0 4px 6px -4px oklch(0 0 0 / 0.08);
    --shadow-xl: 0 20px 25px -5px oklch(0 0 0 / 0.12), 0 8px 10px -6px oklch(0 0 0 / 0.10);
    --shadow-2xl: 0 25px 50px -12px oklch(0 0 0 / 0.15);
    --shadow-inner: inset 0 2px 4px 0 oklch(0 0 0 / 0.05);
  }
}
```

## Tailwind Theme Extension

### Configuration (`app/globals.css`)
```css
@theme inline {
  /* Expose CSS variables to Tailwind */
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
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  
  /* Border radius tokens */
  --radius-sm: 0.25rem;
  --radius: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}
```

## Usage Patterns

### Semantic Classes (Preferred)
```tsx
// ✅ Good: Using semantic tokens
<div className="bg-card text-card-foreground border border-border">
  <h1 className="text-foreground">Title</h1>
  <p className="text-muted-foreground">Description</p>
  <button className="bg-primary text-primary-foreground">Action</button>
</div>
```

### Border Opacity Standards
```tsx
// Subtle dividers
<div className="border-t border-border/20" />

// Interactive elements
<button className="border border-border/30 hover:border-border/50" />

// Section headers
<header className="border-b border-border/40" />

// Primary borders (full opacity)
<div className="border border-border" />
```

### Shadow Utilities
```tsx
// Use theme-aware shadows
<div className="shadow-theme-lg" />

// Or CSS variables directly
<div style={{ boxShadow: 'var(--shadow-xl)' }} />

// Available utilities:
// shadow-theme-sm, shadow-theme-md, shadow-theme-lg,
// shadow-theme-xl, shadow-theme-2xl, shadow-theme-inner
```

### Utility Classes (Built-in)
```css
/* Pre-defined in globals.css */

.depth-surface {
  @apply bg-card text-card-foreground rounded-lg border border-border/20;
  box-shadow: var(--shadow-lg);
}

.glass-card {
  @apply backdrop-blur-xl rounded-lg border border-border/20;
  background: var(--glass);
  box-shadow: var(--shadow-xl);
}

.metric-card {
  @apply bg-card text-card-foreground rounded-lg border border-border/30 p-6;
  box-shadow: var(--shadow-md);
}

.chart-container {
  @apply depth-surface p-6;
}

.noise-overlay {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,...");
    opacity: 0.03;
    pointer-events: none;
  }
}
```

## Forbidden Patterns

### ❌ Hardcoded Colors
```tsx
// NEVER do this
<div className="bg-[#1a1a1a]" />
<div className="text-[#ffffff]" />
<div style={{ backgroundColor: '#1a1a1a' }} />
<div className="bg-slate-900" /> // No Tailwind color names
```

### ❌ Arbitrary OKLCH Values
```tsx
// NEVER do this
<div className="bg-[oklch(0.5_0.2_250)]" />
```

### ❌ RGB/HEX Colors
```tsx
// NEVER do this
<div className="bg-[rgb(26,26,26)]" />
<div className="bg-[#1a1a1a]" />
```

## Approved Patterns

### ✅ Semantic Tokens
```tsx
// ALWAYS do this
<div className="bg-card text-foreground" />
<button className="bg-primary text-primary-foreground" />
<div className="border border-border/40" />
```

### ✅ Opacity Modifiers
```tsx
// Use opacity with semantic colors
<div className="bg-card/80" />
<div className="text-muted-foreground/70" />
<div className="border-border/20" />
```

### ✅ State Variants
```tsx
// Proper hover/focus states
<button className="bg-primary hover:bg-primary/90 focus:ring-2 focus:ring-ring">
  Button
</button>
```

### ✅ Dynamic CSS Variables
```tsx
// When dynamic color needed (rare)
<div style={{ backgroundColor: 'var(--accent)' }} />
```

## Component-Level Color Rules

### UI Primitives
**Must use**: Semantic tokens only
**Example** (`components/ui/button.tsx`):
```tsx
const buttonVariants = cva(
  "bg-primary text-primary-foreground hover:bg-primary/90",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
    },
  }
)
```

### Feature Components
**Must use**: Semantic tokens from UI primitives or direct tokens
**Example**:
```tsx
<Card className="bg-card">
  <CardHeader className="border-b border-border/40">
    <CardTitle className="text-foreground">Title</CardTitle>
  </CardHeader>
  <CardContent className="text-card-foreground">
    Content
  </CardContent>
</Card>
```

### Layout Components
**Must use**: Background and border tokens
**Example**:
```tsx
<aside className="bg-background border-r border-border">
  <nav className="bg-card">
    <a className="text-foreground hover:bg-accent">Link</a>
  </nav>
</aside>
```

## Accessibility Requirements

### Contrast Ratios (WCAG AA)
**Minimum requirements**:
- Normal text (< 18px): 4.5:1
- Large text (≥ 18px): 3:1
- UI components: 3:1

**Testing**:
```tsx
// Verify contrast in browser DevTools
// Or use automated tools (axe, Lighthouse)
```

### Color Independence
**Never rely on color alone** for information:
```tsx
// ❌ Bad: Color only
<span className="text-destructive">Error</span>

// ✅ Good: Color + icon + text
<span className="text-destructive flex items-center gap-2">
  <AlertCircle className="h-4 w-4" />
  Error: Invalid input
</span>
```

### Focus Indicators
**Always visible** and high contrast:
```tsx
<button className="focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background">
  Button
</button>
```

## Theme Switching

### Implementation
**Provider**: `next-themes` (`components/providers/theme-provider.tsx`)

**Toggle Component**:
```tsx
'use client'
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="bg-card text-foreground border border-border/30"
    >
      Toggle Theme
    </button>
  )
}
```

### Theme Persistence
**Storage**: localStorage (`theme` key)
**Default**: Dark mode
**System preference**: Respected if not set

## Adding New Colors

### Process
1. **Define in `:root`** (dark mode default)
2. **Override in `.light`** (light mode)
3. **Expose via `@theme inline`** if needed in Tailwind utilities
4. **Document usage** in this file
5. **Update components** to use new token

### Example: Adding "highlight" color
```css
:root {
  --highlight: oklch(0.75 0.15 60);
  --highlight-foreground: oklch(0.15 0.01 60);
}

.light {
  --highlight: oklch(0.85 0.10 60);
  --highlight-foreground: oklch(0.15 0.01 60);
}

@theme inline {
  --color-highlight: var(--highlight);
  --color-highlight-foreground: var(--highlight-foreground);
}
```

**Usage**:
```tsx
<div className="bg-highlight text-highlight-foreground">
  Highlighted content
</div>
```

## Migration Notes

### Legacy Issues (RESOLVED)
The project previously suffered from:
- Hardcoded color values (hex/rgb)
- Insufficient contrast ratios
- Inconsistent opacity usage
- Missing theme-aware shadows
- Visible borders too subtle

### Current Status (FIXED)
✅ All colors use semantic tokens  
✅ OKLCH format enforced  
✅ Proper contrast ratios (WCAG AA)  
✅ Theme-aware shadow system  
✅ Border visibility standardized  
✅ Glass morphism properly implemented

### Refactoring Permission
**AI/Codegen tools are AUTHORIZED to**:
- Replace hardcoded colors with semantic tokens
- Fix contrast ratio violations
- Update border opacity to standards
- Enforce OKLCH format
- Apply utility classes (depth-surface, glass-card, etc.)

## Linter Warnings (SAFE TO IGNORE)

The following CSS linter warnings are **expected and safe**:
```
Unknown at rule @plugin
Unknown at rule @custom-variant
Unknown at rule @theme
Unknown at rule @apply
```

These are valid Tailwind CSS v4 directives and function correctly at runtime.

## Rules Summary

### ✅ REQUIRED
- Use OKLCH format exclusively
- Use semantic tokens (never hardcoded values)
- Follow border opacity standards (/20, /30, /40)
- Use theme-aware shadows (shadow-theme-*)
- Maintain WCAG AA contrast ratios
- Support both light and dark themes
- Test theme switching in all components

### ❌ FORBIDDEN
- Hardcoded hex/rgb colors
- Arbitrary color values
- Tailwind color scale names (slate, gray, blue, etc.)
- Color-only information conveyance
- Insufficient contrast ratios
- Theme-specific hardcoded values

### 🔄 REFACTORING
- Replace all hardcoded colors → semantic tokens
- Update border opacity → standard values
- Fix contrast violations → WCAG AA compliant
- Convert inline styles → Tailwind utilities
- Apply utility classes → depth-surface, glass-card, metric-card
