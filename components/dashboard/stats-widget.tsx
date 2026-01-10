"use client";

import { cn } from "@/lib/utils";
import { RiMore2Fill } from "@remixicon/react";
import Image from "next/image";

interface StatsWidgetProps {
  userName: string;
  greeting: string;
  message: string;
  userAvatar: string;
  completionPercentage: number;
  className?: string;
}

export function StatsWidget({
  userName,
  greeting,
  message,
  userAvatar,
  completionPercentage,
  className,
}: StatsWidgetProps) {
  // Calculate SVG arc for progress circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  return (
    <div
      className={cn(
        "bg-card dark:bg-card/50 group relative overflow-hidden rounded-3xl p-6 shadow-xl shadow-black/5",
        className,
      )}
    >
      {/* Background Decor */}
      <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full blur-2xl" />

      {/* Header */}
      <div className="font-body relative z-10 flex items-start justify-between">
        <span className="font-display text-foreground text-lg font-bold">
          Efficiency
        </span>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <RiMore2Fill size={20} />
        </button>
      </div>

      {/* Circular Progress & Avatar */}
      <div className="relative mt-8 mb-6 flex justify-center">
        {/* SVG Progress Circle */}
        <div className="relative h-48 w-48">
          <svg className="h-full w-full -rotate-90 transform">
            {/* Track */}
            <circle
              className="text-muted/20"
              strokeWidth="3"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="96"
              cy="96"
            />
            {/* Progress */}
            <circle
              className="text-primary transition-all duration-1000 ease-out"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="96"
              cy="96"
            />
          </svg>

          {/* Avatar Centered */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <div className="relative">
              <div className="bg-primary/20 absolute inset-0 animate-pulse rounded-full blur-md" />
              <Image
                alt={userName}
                src={userAvatar}
                width={112}
                height={112}
                className="border-card relative z-10 rounded-full border-4 object-cover"
              />
            </div>
          </div>

          {/* Percentage Badge */}
          <div className="bg-primary text-primary-foreground absolute top-0 right-4 animate-bounce rounded-full border border-white/20 px-2.5 py-1 text-xs font-bold shadow-lg">
            {completionPercentage}%
          </div>
        </div>
      </div>

      {/* Greeting Text */}
      <div className="relative z-10 text-center">
        <h3 className="font-display text-foreground text-2xl font-bold">
          {greeting} <span className="animate-wiggle inline-block">⚡</span>
        </h3>
        <p className="text-muted-foreground mx-auto mt-2 max-w-[200px] text-sm leading-relaxed">
          {message}
        </p>
      </div>

      {/* Mini Bar Chart */}
      <div className="bg-muted/30 border-border/50 mt-8 w-full rounded-2xl border p-4 backdrop-blur-sm">
        <div className="flex h-24 items-end justify-between gap-3">
          {[40, 70, 50, 90, 30].map((height, i) => (
            <div
              key={i}
              className="group/bar flex w-full flex-col items-center gap-2"
            >
              <div
                className={cn(
                  "group-hover/bar:bg-primary w-full rounded-t-sm transition-all duration-500 ease-out",
                  height === 90
                    ? "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.4)]"
                    : "bg-primary/20",
                )}
                style={{ height: `${height}%` }}
              />
              <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
                {["M", "T", "W", "T", "F"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
