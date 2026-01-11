"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "@remixicon/react";

interface HeroBannerProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  className?: string;
}

export function HeroBanner({
  title,
  subtitle,
  ctaText = "View Global Map",
  ctaLink = "#",
  className,
}: HeroBannerProps) {
  return (
    <div
      className={cn(
        "group relative flex min-h-[320px] w-full flex-col justify-center overflow-hidden rounded-2xl p-8 md:p-12",
        "shadow-primary/10 border-primary/10 border shadow-2xl",
        "bg-card" /* Ensure background color for contrast in light mode */,
        className,
      )}
    >
      {/* Background Image Layer with Blur and Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-overlay transition-transform duration-[20s] hover:scale-110"
        style={{ backgroundImage: "url(/assets/hero-logistics.png)" }}
      />

      {/* Background Layer: Animated Gradient Mesh */}
      <div className="bg-background/60 absolute inset-0 z-0 backdrop-blur-[2px]" />

      {/* Mesh Gradients - Layered Color Temperatures */}
      <div className="bg-gradient-radial from-primary/20 animate-mesh-rotate absolute top-[-50%] left-[-20%] h-[800px] w-[800px] rounded-full to-transparent opacity-50 blur-[120px]" />
      <div className="bg-gradient-radial from-accent/20 absolute right-[-10%] bottom-[-20%] h-[600px] w-[600px] animate-pulse rounded-full to-transparent opacity-40 blur-[100px]" />

      {/* Noise Overlay for Industrial Texture */}
      <div className="noise-overlay absolute inset-0 z-0 opacity-[0.4] mix-blend-overlay" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] bg-[size:40px_40px]" />

      {/* Content Container */}
      <div className="relative z-10 max-w-2xl space-y-6">
        <div className="bg-primary/10 border-primary/20 inline-flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur-md">
          <span className="bg-success h-1.5 w-1.5 animate-pulse rounded-full shadow-[0_0_8px_rgba(var(--success),0.5)]" />
          <span className="text-foreground/80 font-body text-[10px] font-bold tracking-[0.2em] uppercase">
            System Operational
          </span>
        </div>

        <h1 className="font-display text-foreground text-4xl leading-[1.1] font-bold tracking-tight drop-shadow-sm md:text-5xl lg:text-6xl">
          {title.split(" <br/> ").map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h1>

        <div className="from-primary via-accent h-1 w-24 rounded-full bg-gradient-to-r to-transparent" />

        <p className="text-muted-foreground font-body max-w-lg text-lg leading-relaxed">
          {subtitle}
        </p>

        <div className="pt-4">
          <Link href={ctaLink}>
            <Button className="group/btn bg-primary text-primary-foreground hover:bg-primary/90 animate-orbit-glow relative overflow-hidden rounded-full border-none px-8 py-6 font-bold tracking-wide">
              <span className="relative z-10 flex items-center gap-3">
                {ctaText}
                <span className="bg-background text-foreground flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 group-hover/btn:translate-x-1">
                  <RiArrowRightLine size={18} />
                </span>
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Abstract Shapes */}
      <div className="border-primary/10 absolute top-1/2 right-12 h-64 w-64 -translate-y-1/2 rotate-12 transform rounded-full border opacity-20 blur-[1px]" />
      <div className="border-primary/5 absolute top-1/2 right-24 h-48 w-48 -translate-y-1/2 -rotate-12 transform rounded-full border opacity-30 blur-[0.5px]" />
    </div>
  );
}
