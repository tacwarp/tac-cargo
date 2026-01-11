"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Target, Globe, Award } from "lucide-react";
import Image from "next/image";

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
  };

  return (
    <section className="bg-background relative flex min-h-[95vh] w-full flex-col justify-center overflow-hidden py-20 lg:py-32">
      {/* Background Image with Gradient Mask */}
      <div
        className="absolute inset-0 z-0 select-none"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <Image
          src="/images/tac-hero-bg.jpeg"
          alt="TAC Cargo Logistics Network"
          fill
          className="object-cover opacity-40 contrast-125 grayscale-[20%] saturate-50 dark:opacity-40"
          priority
        />
        <div className="from-background via-background/60 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="bg-grid absolute inset-0 opacity-20" />
      </div>


      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Content */}
          <div className="flex flex-col items-start space-y-8 lg:col-span-7">
            {/* Badge */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="border-primary/20 bg-primary/10 hover:bg-primary/15 inline-flex items-center gap-2 rounded-sm border px-4 py-1.5 backdrop-blur-md transition-colors"
            >
              <Award className="text-primary h-4 w-4" />
              <span className="text-primary text-xs font-medium tracking-wider uppercase">
                Premier Logistics Partner
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="font-manrope text-foreground text-5xl leading-[0.9] font-medium tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl"
            >
              Delivering
              <br />
              <span className="from-foreground to-muted-foreground bg-gradient-to-br bg-clip-text pr-4 text-transparent">
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
              className="text-muted-foreground max-w-xl text-lg leading-relaxed font-light sm:text-xl"
            >
              Customer-first logistics built on experience, precision, and
              trust.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUpVariant}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <button
                aria-label="Request a logistics quote"
                className="group bg-foreground text-background hover:bg-foreground/90 hover:shadow-primary/20 relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-sm px-8 py-4 text-sm font-medium transition-all hover:shadow-lg"
              >
                <span className="relative z-10">Get a Quote</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                aria-label="Track your shipment"
                className="group border-input bg-background/50 text-foreground hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-3 rounded-sm border px-8 py-4 text-sm font-medium backdrop-blur-sm transition-all"
              >
                <Play className="h-4 w-4 fill-current opacity-70 transition-opacity group-hover:opacity-100" />
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
            className="w-full lg:col-span-5"
          >
            {/* Glass Card Container */}
            <div className="border-border/50 bg-card/30 hover:shadow-primary/5 relative overflow-hidden rounded-3xl border p-1 shadow-2xl backdrop-blur-xl transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />

              <div className="bg-card/40 relative space-y-8 rounded-[20px] border border-black/5 border-white/5 p-6 sm:p-8 dark:border-white/5">
                {/* Primary Stat */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 ring-primary/20 text-primary flex h-14 w-14 items-center justify-center rounded-2xl ring-1">
                    <Target className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="font-manrope text-foreground text-4xl font-medium tracking-tight">
                      150+
                    </div>
                    <div className="text-muted-foreground font-sans text-sm">
                      Projects Delivered
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Client Satisfaction
                    </span>
                    <span className="text-foreground font-medium">98%</span>
                  </div>
                  <div className="bg-muted/50 h-2 w-full overflow-hidden rounded-sm">
                    <div className="from-primary to-primary/60 h-full w-[98%] rounded-sm bg-gradient-to-r" />
                  </div>
                </div>

                {/* Divider */}
                <div className="via-border h-px w-full bg-gradient-to-r from-transparent to-transparent" />

                {/* Secondary Stats Grid */}
                <div className="divide-border/40 flex justify-between gap-4 divide-x">
                  {[
                    { value: "5+", label: "Years" },
                    { value: "24/7", label: "Support" },
                    { value: "100%", label: "Quality" },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="group flex-1 cursor-default px-2 text-center"
                    >
                      <div className="text-foreground text-5xl font-medium transition-transform duration-300 group-hover:scale-105">
                        {stat.value}
                      </div>
                      <div className="text-muted-foreground mt-1 text-[10px] tracking-wider uppercase">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Marquee Placeholder */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-muted-foreground text-sm font-medium">
                    Featured Clients
                  </h3>
                  <div className="mask-image-linear-fade relative flex overflow-hidden">
                    <div className="animate-marquee flex gap-8 whitespace-nowrap opacity-60 grayscale transition-all duration-500 hover:grayscale-0">
                      {[1, 2, 3, 4].map((id) => (
                        <div key={id} className="flex h-8 items-center gap-2">
                          <Globe className="text-muted-foreground h-5 w-5" />
                          <span className="text-muted-foreground text-sm font-medium">
                            Client {id}
                          </span>
                        </div>
                      ))}
                      {[1, 2, 3, 4].map((id) => (
                        <div
                          key={`dup-${id}`}
                          className="flex h-8 items-center gap-2"
                        >
                          <Globe className="text-muted-foreground h-5 w-5" />
                          <span className="text-muted-foreground text-sm font-medium">
                            Client {id}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Status Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center gap-1.5 rounded-sm border border-success/20 bg-success/10 px-2.5 py-1 text-[10px] font-medium text-success">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
                    SYSTEM ACTIVE
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-sm border border-warning/20 bg-warning/10 px-2.5 py-1 text-[10px] font-medium text-warning">
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
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .mask-image-linear-fade {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 10%,
            black 90%,
            transparent
          );
        }
      `}</style>
    </section>
  );
}
