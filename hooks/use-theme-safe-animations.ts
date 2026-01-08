"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";

export function useThemeSafeAnimations() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;

    if (currentTheme === "dark") {
      // Pause Framer Motion animations briefly to prevent layout thrashing
      const motionElements = document.querySelectorAll(
        "[data-framer-component-type]",
      );
      motionElements.forEach((el) => {
        const element = el as HTMLElement;
        element.style.animationPlayState = "paused";
      });

      // Resume after layout stabilization
      const timeoutId = setTimeout(() => {
        motionElements.forEach((el) => {
          const element = el as HTMLElement;
          element.style.animationPlayState = "running";
        });
      }, 50);

      return () => clearTimeout(timeoutId);
    }

    // Clean up any conflicting CSS classes
    document.body.classList.remove("shimmer-active", "animation-conflict");
  }, [theme, systemTheme]);

  return { theme, systemTheme };
}
