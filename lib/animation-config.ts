/**
 * @fileoverview Strict Animation Configuration
 * @module lib/animation-config
 *
 * Animation ruleset to prevent layout reflow and scrollbar jitter.
 *
 * GOLDEN RULES:
 * 1. Only animate compositor-friendly properties: transform, opacity, filter
 * 2. NEVER animate layout-affecting properties: height, width, margin, padding, top/bottom/left/right
 * 3. Use contain: layout on animated containers
 * 4. Use will-change sparingly and only during animation
 */

import type { Transition, Variants } from "framer-motion";

// ============================================
// SAFE TRANSITION PRESETS
// ============================================

/**
 * Safe spring transition - uses transform only
 * Does NOT cause layout reflow
 */
export const safeSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};

/**
 * Safe tween transition for opacity/transform
 */
export const safeTween: Transition = {
  type: "tween",
  duration: 0.2,
  ease: [0.25, 0.1, 0.25, 1],
};

/**
 * Safe exit transition - quick fade out
 */
export const safeExit: Transition = {
  type: "tween",
  duration: 0.15,
  ease: "easeOut",
};

// ============================================
// SAFE ANIMATION VARIANTS
// ============================================

/**
 * Fade only - safest animation, no layout impact
 */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: safeTween,
  },
  exit: {
    opacity: 0,
    transition: safeExit,
  },
};

/**
 * Scale animation using transform only
 * Safe: Uses transform: scale() which is compositor-friendly
 */
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: safeSpring,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: safeExit,
  },
};

/**
 * Slide up animation using transform only
 * Safe: Uses transform: translateY() which is compositor-friendly
 */
export const slideUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: safeSpring,
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: safeExit,
  },
};

/**
 * Slide in from left using transform
 */
export const slideLeftVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: safeSpring,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: safeExit,
  },
};

/**
 * Stagger children container
 * No animation on container itself - only orchestrates children
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

/**
 * Stagger item - for use with staggerContainerVariants
 */
export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: safeTween,
  },
};

// ============================================
// HOVER/TAP ANIMATIONS (Safe)
// ============================================

/**
 * Safe hover scale - subtle and smooth
 */
export const safeHoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 },
};

/**
 * Safe tap scale - provides feedback
 */
export const safeTapScale = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

/**
 * Combined hover/tap props for interactive elements
 */
export const safeInteractiveProps = {
  whileHover: safeHoverScale,
  whileTap: safeTapScale,
};

// ============================================
// FORBIDDEN ANIMATIONS (DO NOT USE)
// ============================================

/**
 * @deprecated NEVER animate these properties - they cause layout reflow
 *
 * FORBIDDEN:
 * - height, minHeight, maxHeight
 * - width, minWidth, maxWidth
 * - margin, marginTop, marginBottom, marginLeft, marginRight
 * - padding, paddingTop, paddingBottom, paddingLeft, paddingRight
 * - top, right, bottom, left
 * - borderWidth
 * - fontSize
 * - lineHeight
 *
 * SAFE ALTERNATIVES:
 * - height → use scaleY or clipPath
 * - width → use scaleX or clipPath
 * - margin/padding → use transform: translate
 * - top/left/etc → use transform: translate
 */

// ============================================
// MOTION COMPONENT PROPS
// ============================================

/**
 * Default motion props for dashboard components
 * Provides smooth enter animation without layout impact
 */
export const dashboardMotionProps = {
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  variants: fadeVariants,
};

/**
 * Props for list items with stagger effect
 */
export const listItemMotionProps = {
  variants: staggerItemVariants,
};

/**
 * Props for card components
 */
export const cardMotionProps = {
  initial: "hidden",
  animate: "visible",
  variants: scaleVariants,
  ...safeInteractiveProps,
};

// ============================================
// LAYOUT ANIMATION CONFIG
// ============================================

/**
 * Safe layout animation config
 * Only use layout animations when absolutely necessary
 *
 * WARNING: layout animations CAN cause reflow
 * Use sparingly and test thoroughly
 */
export const safeLayoutTransition: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 40,
  mass: 0.5,
};

// ============================================
// VALIDATION HELPERS
// ============================================

const FORBIDDEN_PROPERTIES = [
  "height",
  "minHeight",
  "maxHeight",
  "width",
  "minWidth",
  "maxWidth",
  "margin",
  "marginTop",
  "marginBottom",
  "marginLeft",
  "marginRight",
  "padding",
  "paddingTop",
  "paddingBottom",
  "paddingLeft",
  "paddingRight",
  "top",
  "right",
  "bottom",
  "left",
  "borderWidth",
  "fontSize",
  "lineHeight",
];

/**
 * Validates animation variants for layout-safe properties
 * Use in development to catch unsafe animations
 * @param variants - Framer Motion variants object
 * @param name - Optional name for better error messages
 */
export function validateAnimationVariants(variants: Variants, name?: string): boolean {
  if (process.env.NODE_ENV !== "development") return true;

  for (const key of Object.keys(variants)) {
    const variant = variants[key];
    if (typeof variant === "object" && variant !== null) {
      for (const prop of Object.keys(variant)) {
        if (FORBIDDEN_PROPERTIES.includes(prop)) {
          console.warn(
            `[Animation Safety]${name ? ` (${name})` : ""} Forbidden property "${prop}" found in variant "${key}". ` +
              `This will cause layout reflow. Use transform or opacity instead.`,
          );
          return false;
        }
      }
    }
  }
  return true;
}

// ============================================
// MIGRATED CSS ANIMATIONS
// ============================================

/**
 * Scan animation (barcode scanner)
 * Migrated from CSS @keyframes scan
 */
export const scanVariants: Variants = {
  idle: { y: 0 },
  scanning: {
    y: ["0%", "100%", "0%"],
    transition: {
      duration: 2,
      ease: [0.4, 0, 0.2, 1],
      repeat: Infinity,
    },
  },
};

// Validate scanVariants in development
validateAnimationVariants(scanVariants, "scanVariants");

/**
 * Slow ping animation
 * Migrated from CSS @keyframes ping-slow
 */
export const pingSlowVariants: Variants = {
  idle: {
    scale: 1,
    opacity: 1,
  },
  pinging: {
    scale: [1, 2, 2],
    opacity: [1, 0, 0],
    transition: {
      duration: 3,
      ease: [0, 0, 0.2, 1],
      repeat: Infinity,
    },
  },
};

// Validate pingSlowVariants in development
validateAnimationVariants(pingSlowVariants, "pingSlowVariants");

/**
 * Shimmer animation
 * Migrated from CSS @keyframes shimmer
 */
export const shimmerVariants: Variants = {
  idle: { x: "-100%" },
  shimmering: {
    x: "100%",
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Validate shimmerVariants in development
validateAnimationVariants(shimmerVariants, "shimmerVariants");

