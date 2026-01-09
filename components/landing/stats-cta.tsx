"use client";

import { ArrowRight, Box } from "lucide-react";
import { motion } from "framer-motion";

export function StatsCTA() {
  return (
    <section className="bg-background relative w-full overflow-hidden border-t border-white/5 py-20 lg:py-24">
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_40%)] opacity-5" />

      <div className="relative z-10 container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-playfair text-foreground text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              The Numbers <br />
              <span className="text-primary/80 italic">behind precision.</span>
            </h2>
            <p className="text-muted-foreground/80 mt-6 max-w-xl text-lg font-light">
              Reliability isn&apos;t a promise; it&apos;s a statistical certainty. These
              are the metrics that define the{" "}
              <span className="text-foreground font-medium">Imphal-Delhi</span>{" "}
              corridor.
            </p>
          </div>

          <div className="flex max-w-sm flex-col items-start gap-6 pt-4">
            <p className="text-muted-foreground text-sm">
              Real-time telemetry, chain-of-custody protocols, and zero-failure
              delivery commitments.
            </p>
            <a
              href="/dashboard/analytics"
              aria-label="View our operational metrics"
              className="group bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95"
            >
              View System Metrics
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-8">
          {/* Stat 1: Volume */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="from-primary/10 to-primary/5 border-primary/20 group relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border bg-gradient-to-br px-8 py-10"
          >
            <div
              className="absolute top-0 right-0 p-8 opacity-20 transition-opacity group-hover:opacity-40"
              aria-hidden="true"
            >
              <Box className="text-primary h-24 w-24 rotate-12" />
            </div>
            <div>
              <p className="text-primary mb-4 text-xs font-bold tracking-[0.2em] uppercase">
                Throughput
              </p>
              <p className="font-playfair text-foreground text-6xl font-medium tracking-tight sm:text-7xl">
                12k<span className="align-top text-4xl">+</span>
              </p>
              <p className="text-muted-foreground mt-2 text-lg">
                Monthly Shipments
              </p>
            </div>
            <p className="text-muted-foreground/80 mt-8 max-w-md text-sm leading-relaxed">
              Consignments successfully processed across the Northeast corridor
              with zero loss incidents in the last quarter.
            </p>
          </motion.article>

          {/* Stat 2: Reliability */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card group hover:border-primary/30 flex flex-col justify-between rounded-[2.5rem] border border-white/5 px-8 py-10 transition-colors"
          >
            <div>
              <p className="mb-4 text-xs font-bold tracking-[0.2em] text-success uppercase">
                Reliability
              </p>
              <div className="flex items-baseline gap-1">
                <p className="font-playfair text-foreground text-5xl font-medium tracking-tight sm:text-6xl">
                  99.9
                </p>
                <span className="text-muted-foreground text-2xl font-medium">
                  %
                </span>
              </div>
              <p className="text-muted-foreground mt-2 text-base">
                On-Time Delivery
              </p>
            </div>
            <p className="text-muted-foreground/60 mt-8 text-sm">
              Precision timing protocols ensure your cargo arrives exactly when
              predicted, regardless of terrain.
            </p>
          </motion.article>

          {/* Stat 3: Speed */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-card group hover:border-primary/30 flex flex-col justify-between rounded-[2.5rem] border border-white/5 px-8 py-10 transition-colors"
          >
            <div>
              <p className="mb-4 text-xs font-bold tracking-[0.2em] text-primary uppercase">
                Velocity
              </p>
              <div className="flex items-baseline gap-1">
                <p className="font-playfair text-foreground text-5xl font-medium tracking-tight sm:text-6xl">
                  48
                </p>
                <span className="text-muted-foreground text-2xl font-medium">
                  hrs
                </span>
              </div>
              <p className="text-muted-foreground mt-2 text-base">
                Max Transit Time
              </p>
            </div>
            <p className="text-muted-foreground/60 mt-8 text-sm">
              From Imphal to Delhi. We bridge the distance faster than any
              ground-based competitor.
            </p>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
