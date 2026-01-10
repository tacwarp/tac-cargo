"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { RiMore2Fill, RiMapPin2Fill, RiTruckLine } from "@remixicon/react";

interface ProgressCardProps {
  title: string;
  category: string;
  progress: number;
  totalItems: number;
  completedItems: number;
  imageUrl: string;
  mentorName: string; // Dispatcher Name
  mentorRole: string; // Role
  mentorAvatar: string;
  className?: string;
  colorTheme?: "indigo" | "pink" | "cyan" | "violet";
}

export function ProgressCard({
  title,
  category,
  progress,
  imageUrl,
  mentorName,
  mentorRole,
  mentorAvatar,
  className,
  colorTheme = "indigo",
}: ProgressCardProps) {
  const themeStyles = {
    indigo: {
      badge: "bg-primary/10 text-primary border-primary/20",
      progress: "bg-primary",
      glow: "shadow-primary/20",
    },
    pink: {
      badge: "bg-destructive/10 text-destructive border-destructive/20",
      progress: "bg-destructive",
      glow: "shadow-destructive/20",
    },
    cyan: {
      badge: "bg-success/10 text-success border-success/20",
      progress: "bg-success",
      glow: "shadow-success/20",
    },
    violet: {
      badge: "bg-primary/20 text-primary border-primary/30",
      progress: "bg-primary",
      glow: "shadow-primary/30",
    },
  };

  const theme = themeStyles[colorTheme];

  return (
    <div
      className={cn(
        "group bg-card border-border/50 relative rounded-2xl border p-3 pb-5 transition-all duration-500",
        "hover:border-primary/30 shadow-lg shadow-black/5 hover:-translate-y-1",
        theme.glow,
        className,
      )}
    >
      <div className="relative mb-4 h-44 overflow-hidden rounded-xl">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <Image
          alt={title}
          src={imageUrl}
          fill
          className="object-cover grayscale transition-transform duration-700 group-hover:scale-110 group-hover:grayscale-0"
        />

        {/* Map Button Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="scale-75 transform rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-100">
            <RiMapPin2Fill size={32} />
          </div>
        </div>

        <button className="hover:text-primary absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/70 backdrop-blur-md transition-colors hover:bg-white">
          <RiTruckLine size={16} />
        </button>
      </div>

      <div className="space-y-4 px-2">
        {/* Badge */}
        <span
          className={cn(
            "mb-1 inline-block rounded-md border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase",
            theme.badge,
          )}
        >
          {category}
        </span>

        {/* Title */}
        <h3 className="font-display text-foreground line-clamp-2 min-h-[3.5rem] text-lg leading-snug font-bold">
          {title}
        </h3>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="text-muted-foreground flex justify-between text-[10px] font-medium tracking-wide uppercase">
            <span>Transit Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                theme.progress,
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Mentor/Dispatcher Info */}
        <div className="border-border/40 flex items-center justify-between border-t pt-2">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image
                alt={mentorName}
                src={mentorAvatar}
                width={32}
                height={32}
                className="border-border rounded-full border object-cover shadow-sm"
              />
              <div className="border-card absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 bg-primary" />
            </div>
            <div>
              <p className="text-foreground font-body text-xs font-bold">
                {mentorName}
              </p>
              <p className="text-muted-foreground text-[10px] uppercase">
                {mentorRole}
              </p>
            </div>
          </div>

          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <RiMore2Fill size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
