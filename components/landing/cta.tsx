"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RiArrowRightLine, RiRocketLine } from "@remixicon/react";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-black py-32">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--gradient-start)_0%,_transparent_70%)] opacity-20" />
        <div className="via-primary absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent to-transparent opacity-50" />
      </div>

      <div className="relative z-10 container mx-auto max-w-[1000px] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
            <span className="bg-success flex h-2 w-2 animate-pulse rounded-full" />
            <span className="font-mono text-xs tracking-widest text-white/70 uppercase">
              Limited Capacity Slots Available
            </span>
          </div>

          <h2 className="text-5xl font-bold tracking-tighter text-white md:text-7xl">
            Ready to <br />
            <span className="from-primary to-primary animate-gradient-x bg-gradient-to-r via-white bg-clip-text text-transparent">
              Initiate Transit?
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed font-light text-white/50">
            Join the logistics network engineering the future of the Northeast
            corridor. Instant quotes, zero friction, absolute reliability.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 pt-8 sm:flex-row">
            <Link
              href="#tracking"
              className="group focus-visible:ring-primary relative w-full rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none sm:w-auto"
            >
              <div className="from-primary to-accent absolute -inset-1 rounded-lg bg-gradient-to-r opacity-40 blur transition duration-200 group-hover:opacity-100" />
              <span className="bg-background relative flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-8 py-4 leading-none font-bold tracking-wide text-white uppercase transition-colors hover:bg-white/5 sm:w-auto">
                Start Shipping
                <RiRocketLine
                  className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                />
              </span>
            </Link>

            <Link
              href="#services"
              className="group focus-visible:ring-primary w-full rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none sm:w-auto"
            >
              <span className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-transparent px-8 py-4 leading-none font-medium tracking-wide text-white/70 uppercase transition-all hover:bg-white/5 hover:text-white sm:w-auto">
                View Network
                <RiArrowRightLine
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
