'use client'

import { motion } from "framer-motion"

export function About() {
  return (
    <section id="about" className="bg-background py-32 border-b border-border relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 opacity-20">
         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--gradient-mid)_0%,_transparent_70%)] opacity-10" />
      </div>

      <div className="container mx-auto max-w-[1000px] px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="mb-6 block font-mono text-xs uppercase tracking-widest text-primary/80">Our Philosophy</span>
          <h2 className="mb-8 text-4xl font-bold tracking-tighter text-foreground leading-tight sm:text-5xl md:text-6xl">
            We don&apos;t just move cargo.<br />
            We eliminate <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">uncertainty.</span>
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-lg font-light leading-relaxed text-muted-foreground">
            Founded in 2010, TAC was built on a single premise: The connection between Northeast India and the National Capital Region was inefficient. We rebuilt it from the ground up, integrating technology, aviation partnerships, and a proprietary ground fleet to create a seamless corridor.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-2xl overflow-hidden md:grid-cols-4"
        >
          {[
            { value: "15+", label: "Years Active" },
            { value: "50k+", label: "Deliveries" },
            { value: "24/7", label: "Support Ops" },
            { value: "0%", label: "Hidden Fees" }
          ].map((stat, i) => (
            <div key={i} className="bg-background/50 backdrop-blur-sm p-8 hover:bg-white/5 transition-colors">
              <div className="mb-2 text-3xl font-bold tracking-tight text-foreground">{stat.value}</div>
              <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
