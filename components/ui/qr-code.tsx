"use client";

import { QRCodeCanvas } from "qrcode.react";
import { useTheme } from "next-themes";
import { useEffect, useState, useCallback } from "react";

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
  const [colors, setColors] = useState<{ bg: string; fg: string } | null>(null);

  const resolveColors = useCallback(() => {
    if (typeof globalThis === "undefined") return null;

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
  }, [resolvedTheme]);

  // Hydration-safe mounting check
  useEffect(() => {
    setMounted(true);
    
    // Resolve colors immediately after mounting
    const resolved = resolveColors();
    setColors(resolved);
  }, [resolveColors]);

  // Update colors when theme changes after initial mount
  useEffect(() => {
    if (mounted) {
      const resolved = resolveColors();
      setColors(resolved);
    }
  }, [resolvedTheme, resolveColors, mounted]);

  if (!mounted || !colors) {
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
