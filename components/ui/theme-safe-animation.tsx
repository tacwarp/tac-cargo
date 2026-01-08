"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThemeSafeAnimationProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  shimmer?: boolean;
  pauseInDark?: boolean;
}

export function ThemeSafeAnimation({
  children,
  shimmer = false,
  pauseInDark = false,
  className,
  ...props
}: ThemeSafeAnimationProps) {
  return (
    <motion.div
      className={cn(
        pauseInDark &&
          "dark:[animation-play-state:paused] dark:hover:[animation-play-state:running]",
        shimmer && "dark:bg-none dark:[&::after]:hidden",
        className,
      )}
      data-shimmer-disabled={shimmer ? "true" : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
