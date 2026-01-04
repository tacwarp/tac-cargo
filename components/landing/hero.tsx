'use client'

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { RiArrowRightLine, RiGlobalLine, RiTimeLine, RiShieldCheckLine } from "@remixicon/react"
import Link from "next/link"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background selection:bg-primary/30">
      {/* Abstract Deep Space Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--gradient-start)_0%,_transparent_60%)] opacity-20 blur-[100px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Content Container */}
      <div className="container relative z-10 px-4 md:px-6">
        <motion.div 
          style={{ y, opacity }}
          className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto"
        >
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono tracking-[0.2em] uppercase backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            System Operational
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.65, 0.3, 0.9] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] text-foreground"
          >
            The Imphal–Delhi
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient-x bg-[length:200%_auto]">
              Logistics Corridor.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light"
          >
            Engineering precision in high-velocity freight. We bridge the distance between the Northeast and the Capital with absolute reliability.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link href="#tracking" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-sm bg-gradient-to-r from-primary via-primary to-accent px-8 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50">
              <span className="mr-2">Track Shipment</span>
              <RiArrowRightLine className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </Link>
            
            <Link href="#services" className="inline-flex h-12 items-center justify-center rounded-sm border border-border/50 bg-background/30 backdrop-blur-md px-8 font-semibold text-foreground/90 shadow-sm transition-all duration-300 hover:bg-background/50 hover:border-primary/30 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50">
              View Rate Card
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-12 border-t border-border/50 w-full max-w-4xl"
          >
            {[
              { label: "Error Rate", value: "0.01%", icon: RiShieldCheckLine },
              { label: "Avg Transit", value: "14h", icon: RiTimeLine },
              { label: "Coverage", value: "100%", icon: RiGlobalLine },
              { label: "Uptime", value: "99.9%", icon: RiShieldCheckLine },
            ].map((stat, i) => (
              <div key={i} className="group flex flex-col items-center space-y-3 relative">
                <stat.icon className="w-4 h-4 text-primary/60 mb-0.5" />
                <span className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground tabular-nums">{stat.value}</span>
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] translate-y-1/3 translate-x-1/3 pointer-events-none" />
    </section>
  )
}
