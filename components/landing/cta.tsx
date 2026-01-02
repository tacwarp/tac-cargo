'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { RiArrowRightLine, RiRocketLine } from "@remixicon/react"

export function CTA() {
  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--gradient-start)_0%,_transparent_70%)] opacity-20" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
      </div>

      <div className="container relative z-10 mx-auto max-w-[1000px] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-white/70">Limited Capacity Slots Available</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
            Ready to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary animate-gradient-x">
              Initiate Transit?
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-xl text-white/50 font-light leading-relaxed">
            Join the logistics network engineering the future of the Northeast corridor. 
            Instant quotes, zero friction, absolute reliability.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link 
              href="#tracking" 
              className="group relative w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-200" />
              <span className="relative w-full sm:w-auto px-8 py-4 bg-background rounded-lg leading-none flex items-center justify-center gap-2 text-white font-bold tracking-wide uppercase border border-white/10 hover:bg-white/5 transition-colors">
                Start Shipping
                <RiRocketLine className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </Link>

            <Link 
              href="#services" 
              className="group w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-lg"
            >
              <span className="w-full sm:w-auto px-8 py-4 bg-transparent rounded-lg leading-none flex items-center justify-center gap-2 text-white/70 font-medium tracking-wide uppercase border border-white/10 hover:bg-white/5 hover:text-white transition-all">
                View Network
                <RiArrowRightLine className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
