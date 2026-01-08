/**
 * @fileoverview Design Token System
 * Centralized design tokens for spacing, typography, effects, status, and more
 * Always use semantic tokens instead of hardcoded values
 */

export const designTokens = {
  spacing: {
    section: "py-24",
    container: "px-4 md:px-6 lg:px-8",
  },

  typography: {
    hero: "text-6xl lg:text-7xl font-bold",
    h2: "text-4xl lg:text-5xl font-bold",
    h3: "text-2xl lg:text-3xl font-semibold",
    body: "text-lg",
    small: "text-sm",
    kpi: "font-mono tabular-nums font-bold tracking-tight",
  },

  effects: {
    glassMorphism: "backdrop-blur-xl bg-background/60 border border-white/20",
    glow: "shadow-2xl shadow-primary/50",
    hover: "hover:scale-105 transition-transform duration-300",
  },

  // Status color mappings for shipment states
  status: {
    pending: "bg-warning/10 text-warning border-warning/20",
    picked_up: "bg-primary/10 text-primary border-primary/20",
    in_transit: "bg-primary/10 text-primary border-primary/20",
    out_for_delivery: "bg-success/10 text-success border-success/20",
    delivered: "bg-success/10 text-success border-success/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
    exception: "bg-destructive/10 text-destructive border-destructive/20",
    delayed: "bg-warning/10 text-warning border-warning/20",
    processing: "bg-muted/50 text-muted-foreground border-muted",
  },

  // Elevation tokens for layering
  elevation: {
    card: "shadow-sm hover:shadow-md",
    popover: "shadow-md",
    modal: "shadow-xl",
    tooltip: "shadow-lg",
    dropdown: "shadow-lg",
  },

  // Animation duration constants
  duration: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
    slower: "500ms",
  },

  // Easing curves
  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    emphasized: "cubic-bezier(0.25, 0.1, 0.25, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
  },

  // Border radius scale
  radius: {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  },

  // Breakpoints for programmatic use
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// Export types for TypeScript
export type StatusVariant = keyof typeof designTokens.status;
export type ElevationLevel = keyof typeof designTokens.elevation;
export type AnimationDuration = keyof typeof designTokens.duration;
export type EasingCurve = keyof typeof designTokens.easing;

/**
 * Helper function to get status classes
 */
export function getStatusClasses(status: StatusVariant): string {
  return designTokens.status[status];
}

/**
 * Helper function to get elevation classes
 */
export function getElevationClasses(level: ElevationLevel): string {
  return designTokens.elevation[level];
}

