"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  RiArrowRightLine,
  RiGlobalLine,
  RiTimeLine,
  RiShieldCheckLine,
} from "@remixicon/react";
import Link from "next/link";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="bg-background selection:bg-primary/30 relative flex min-h-[90vh] items-center justify-center overflow-hidden"
    >
      {/* Abstract Deep Space Background */}
      <div className="absolute inset-0 z-0">

        <div className="bg-gradient-mesh absolute inset-0 opacity-20 blur-[100px]" />
        <div className="via-primary/50 absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />
        <div className="via-primary/50 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />

        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_70%,transparent_100%)]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container px-4 md:px-6">
        <motion.div
          style={{ y, opacity }}
          className="mx-auto flex max-w-5xl flex-col items-center space-y-8 text-center"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-primary/10 border-primary/30 text-primary inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
            </span>
            System Operational
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            className="text-foreground text-5xl leading-[1.1] font-bold tracking-tighter md:text-7xl lg:text-8xl"
          >
            The Imphal–Delhi
            <br />
            <span className="from-primary via-accent to-secondary animate-gradient-x bg-gradient-to-r bg-[length:200%_auto] bg-clip-text text-transparent">
              Logistics Corridor.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-muted-foreground max-w-2xl text-xl leading-relaxed font-light md:text-2xl"
          >
            Engineering precision in high-velocity freight. We bridge the
            distance between the Northeast and the Capital with absolute
            reliability.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col gap-4 pt-4 sm:flex-row"
          >
            <Link
              href="#tracking"
              className="group from-primary via-primary to-accent text-primary-foreground shadow-primary/25 hover:shadow-primary/30 focus-visible:ring-primary/50 relative inline-flex h-12 items-center justify-center overflow-hidden rounded-sm bg-gradient-to-r px-8 font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="mr-2">Track Shipment</span>
              <RiArrowRightLine className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              <div className="group-hover:animate-shimmer absolute inset-0 -z-10 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>

            <Link
              href="#services"
              className="border-border/50 bg-background/30 text-foreground/90 hover:bg-background/50 hover:border-primary/30 hover:text-foreground focus-visible:ring-primary/30 inline-flex h-12 items-center justify-center rounded-sm border px-8 font-semibold shadow-sm backdrop-blur-md transition-all duration-300 focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
            >
              View Rate Card
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="border-border/50 grid w-full max-w-4xl grid-cols-2 gap-8 border-t pt-12 md:grid-cols-4 md:gap-16"
          >
            {[
              { label: "Error Rate", value: "0.01%", icon: RiShieldCheckLine },
              { label: "Avg Transit", value: "14h", icon: RiTimeLine },
              { label: "Coverage", value: "100%", icon: RiGlobalLine },
              { label: "Uptime", value: "99.9%", icon: RiShieldCheckLine },
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative flex flex-col items-center space-y-3"
              >
                <stat.icon className="text-primary/60 mb-0.5 h-4 w-4" />
                <span className="text-foreground text-4xl font-bold tracking-tighter tabular-nums md:text-5xl">
                  {stat.value}
                </span>
                <div className="via-primary/50 h-px w-8 bg-gradient-to-r from-transparent to-transparent" />
                <span className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="bg-primary/5 pointer-events-none absolute top-1/2 left-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px]" />
      <div className="bg-accent/5 pointer-events-none absolute right-0 bottom-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full blur-[100px]" />
    </section>
  );
}
