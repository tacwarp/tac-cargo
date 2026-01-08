"use client";

import Lottie from "lottie-react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";

interface LottieContainerProps {
  src: string;
  className?: string;
  containerClassName?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  fallbackText?: string;
}

export function LottieContainer({
  src,
  className,
  containerClassName,
  loop = true,
  autoplay = true,
  fallbackText = "Animation unavailable",
}: LottieContainerProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAnimation = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch(src);
        if (!response.ok) throw new Error("Failed to fetch animation");
        const data = await response.json();
        setAnimationData(data);
      } catch (err) {
        console.error("Error loading Lottie:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (src) {
      fetchAnimation();
    }
  }, [src]);

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        containerClassName,
      )}
    >
      {/* Loading State */}
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Loader2 className="text-muted-foreground/20 h-6 w-6 animate-spin" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 p-4 text-center">
          <AlertCircle className="text-destructive/50 h-6 w-6" />
          <p className="text-muted-foreground text-xs">{fallbackText}</p>
        </div>
      )}

      {/* Player */}
      <div className={cn("h-full w-full", className)}>
        {animationData && !error && (
          <Lottie
            animationData={animationData}
            loop={loop}
            autoplay={autoplay}
            className="h-full w-full"
          />
        )}
      </div>
    </div>
  );
}
