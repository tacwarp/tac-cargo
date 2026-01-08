"use client";

import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface RiveMapProps {
  className?: string;
  onLoad?: () => void;
}

export function RiveMap({ className, onLoad }: RiveMapProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const { RiveComponent, rive } = useRive({
    src: "/rive/animated-threat-map.riv",
    autoplay: true,
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      setIsLoaded(true);
      onLoad?.();
    },
  });

  useEffect(() => {
    if (rive) {
      rive.play();
    }
  }, [rive]);

  return (
    <div
      className={cn(
        "relative h-full min-h-[300px] w-full overflow-hidden rounded-xl",
        className,
      )}
    >
      {!isLoaded && (
        <div className="bg-card/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="border-primary size-8 animate-spin rounded-full border-2 border-t-transparent" />
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Loading Route Map
            </span>
          </div>
        </div>
      )}
      <RiveComponent className="h-full w-full" />
    </div>
  );
}
