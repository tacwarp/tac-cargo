"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeAwareQRCodeProps {
  value: string;
  size?: number;
  className?: string;
  bgColor?: string;
  fgColor?: string;
  level?: "L" | "M" | "Q" | "H";
  "aria-label"?: string;
}

/**
 * Theme-aware QR Code wrapper component
 * 
 * Resolves CSS variables to actual colors for QRCodeCanvas library
 * which doesn't support CSS custom properties directly.
 * 
 * Uses resolvedTheme to avoid hydration mismatches and
 * resolves actual CSS variable values from computed styles.
 */
export function ThemeAwareQRCode({
  value,
  size = 64,
  className,
  bgColor,
  fgColor,
  level = "M",
  "aria-label": ariaLabel,
}: ThemeAwareQRCodeProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Standard hydration mismatch fix
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Compute colors during render if client-side, otherwise use defaults
  // We avoid effect-based state updates here to prevent cascading renders
  const getThemeColors = () => {
    if (!mounted || typeof globalThis === "undefined") {
      // Default to "light" assumptions server-side/hydration
      return { bg: "#ffffff", fg: "#0a0a0a" };
    }

    // Try to resolve CSS variables from computed styles
    const root = document.documentElement;
    const styles = getComputedStyle(root);
    const bgVar = styles.getPropertyValue("--background").trim();
    const fgVar = styles.getPropertyValue("--foreground").trim();

    if (bgVar && fgVar) {
      const bgHex = oklchToHex(bgVar) || (resolvedTheme === "dark" ? "#0a0a0a" : "#ffffff");
      const fgHex = oklchToHex(fgVar) || (resolvedTheme === "dark" ? "#fafafa" : "#0a0a0a");
      return { bg: bgHex, fg: fgHex };
    }

    return resolvedTheme === "dark"
      ? { bg: "#0a0a0a", fg: "#fafafa" }
      : { bg: "#ffffff", fg: "#0a0a0a" };
  };

  const colors = getThemeColors();

  if (!mounted) {
    return (
      <div
        className={className}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }

  return (
    <QRCodeCanvas
      value={value}
      size={size}
      bgColor={bgColor || colors.bg}
      fgColor={fgColor || colors.fg}
      level={level}
      className={className}
      role="img"
      aria-label={ariaLabel || `QR code for: ${value}`}
    />
  );
}

/**
 * Converts OKLCH color string to hex
 * Falls back to null if conversion fails
 */
function oklchToHex(oklch: string): string | null {
  try {
    if (!oklch.startsWith("oklch")) return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = oklch;
    ctx.fillRect(0, 0, 1, 1);

    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch {
    return null;
  }
}
