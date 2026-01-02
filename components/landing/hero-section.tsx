'use client'

import { motion } from "framer-motion"
import { ArrowRight, Play, Star, Target, Globe, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
    const fadeUpVariant = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.8,
                ease: [0.215, 0.61, 0.355, 1.0] as const,
            },
        }),
    }

    return (
        <section className="relative min-h-[95vh] w-full overflow-hidden bg-background flex flex-col justify-center py-20 lg:py-32">
            {/* Background Image with Gradient Mask */}
            <div
                className="absolute inset-0 z-0 select-none"
                style={{
                    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                }}
            >
                <Image
                    src="/images/tac-hero-bg.jpeg"
                    alt="TAC Cargo Logistics Network"
                    fill
                    className="object-cover opacity-40 grayscale-[20%] contrast-125 saturate-50 dark:opacity-40 opacity-20"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] dark:bg-grid-white/[0.02] bg-grid-black/[0.05]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">

                    {/* Left Content */}
                    <div className="lg:col-span-7 flex flex-col items-start space-y-8">

                        {/* Badge */}
                        <motion.div
                            custom={0}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariant}
                            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur-md transition-colors hover:bg-primary/15"
                        >
                            <Award className="h-4 w-4 text-primary" />
                            <span className="text-xs font-medium uppercase tracking-wider text-primary">
                                Premier Logistics Partner
                            </span>
                        </motion.div>

                        <motion.h1
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariant}
                            className="font-manrope text-5xl font-medium tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-8xl leading-[0.9]"
                        >
                            Delivering
                            <br />
                            <span className="bg-gradient-to-br from-primary to-[#ffcd75] bg-clip-text text-transparent pr-4">
                                Certainty.
                            </span>
                            <br />
                            For Over 15 Years.
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariant}
                            className="max-w-xl text-lg text-muted-foreground sm:text-xl font-light leading-relaxed"
                        >
                            Customer-first logistics built on experience, precision, and trust.
                        </motion.p>

                        <motion.div
                            custom={3}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUpVariant}
                            className="flex flex-col gap-4 sm:flex-row"
                        >
                            <button aria-label="Request a logistics quote" className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground px-8 py-4 text-sm font-medium text-background transition-all hover:bg-foreground/90 hover:shadow-lg hover:shadow-primary/20">
                                <span className="relative z-10">Get a Quote</span>
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </button>

                            <button aria-label="Track your shipment" className="group inline-flex items-center justify-center gap-3 rounded-full border border-input bg-background/50 px-8 py-4 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:bg-accent hover:text-accent-foreground">
                                <Play className="h-4 w-4 fill-current opacity-70 group-hover:opacity-100 transition-opacity" />
                                <span>Track Shipment</span>
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Stats Card */}
                    <motion.div
                        custom={4}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUpVariant}
                        className="lg:col-span-5 w-full"
                    >
                        {/* Glass Card Container */}
                        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card/30 p-1 shadow-2xl backdrop-blur-xl transition-all hover:shadow-primary/5">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

                            <div className="relative rounded-[20px] bg-card/40 p-6 sm:p-8 space-y-8 border border-white/5 dark:border-white/5 border-black/5">

                                {/* Primary Stat */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20 text-primary">
                                        <Target className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <div className="font-manrope text-4xl font-medium text-foreground tracking-tight">150+</div>
                                        <div className="text-sm text-muted-foreground font-sans">Projects Delivered</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Client Satisfaction</span>
                                        <span className="font-medium text-foreground">98%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50">
                                        <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-primary to-primary/60" />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />

                                {/* Secondary Stats Grid */}
                                <div className="flex justify-between gap-4">
                                    {[
                                        { value: "5+", label: "Years" },
                                        { value: "24/7", label: "Support" },
                                        { value: "100%", label: "Quality" }
                                    ].map((stat, idx) => (
                                        <div key={idx} className="flex-1 text-center group cursor-default">
                                            <div className="text-2xl font-medium text-foreground group-hover:scale-105 transition-transform duration-300">
                                                {stat.value}
                                            </div>
                                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                                                {stat.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Marquee Placeholder */}
                                <div className="space-y-4 pt-2">
                                    <h3 className="text-sm font-medium text-muted-foreground">Featured Clients</h3>
                                    <div className="relative flex overflow-hidden mask-image-linear-fade">
                                        <div className="animate-marquee flex gap-8 whitespace-nowrap opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                                            {[1, 2, 3, 4].map(id => (
                                                <div key={id} className="flex h-8 items-center gap-2">
                                                    <Globe className="h-5 w-5 text-muted-foreground" />
                                                    <span className="text-sm font-medium text-muted-foreground">Client {id}</span>
                                                </div>
                                            ))}
                                            {[1, 2, 3, 4].map(id => (
                                                <div key={`dup-${id}`} className="flex h-8 items-center gap-2">
                                                    <Globe className="h-5 w-5 text-muted-foreground" />
                                                    <span className="text-sm font-medium text-muted-foreground">Client {id}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Status Pills */}
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-1 text-[10px] font-medium text-green-500">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                                        SYSTEM ACTIVE
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-medium text-amber-500">
                                        <Star className="h-3 w-3 fill-current" />
                                        PREMIUM TIER
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* CSS for Marquee - Adding style tag here to avoid global css pollution for this specific component trick */}
            <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .mask-image-linear-fade {
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
        </section>
    )
}
