"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <section
      id="about"
      className="bg-background border-border relative overflow-hidden border-b py-32"
    >
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_center,_var(--gradient-mid)_0%,_transparent_70%)] opacity-10" />
      </div>

      <div className="relative z-10 container mx-auto max-w-[1000px] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary/80 mb-6 block font-mono text-xs tracking-widest uppercase">
            Our Philosophy
          </span>
          <h2 className="text-foreground mb-8 text-4xl leading-tight font-bold tracking-tighter sm:text-5xl md:text-6xl">
            We don&apos;t just move cargo.
            <br />
            We eliminate{" "}
            <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
              uncertainty.
            </span>
          </h2>
          <p className="text-muted-foreground mx-auto mb-16 max-w-2xl text-lg leading-relaxed font-light">
            Founded in 2010, TAC was built on a single premise: The connection
            between Northeast India and the National Capital Region was
            inefficient. We rebuilt it from the ground up, integrating
            technology, aviation partnerships, and a proprietary ground fleet to
            create a seamless corridor.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 md:grid-cols-4"
        >
          {[
            { value: "15+", label: "Years Active" },
            { value: "50k+", label: "Deliveries" },
            { value: "24/7", label: "Support Ops" },
            { value: "0%", label: "Hidden Fees" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-background/50 p-8 backdrop-blur-sm transition-colors hover:bg-white/5"
            >
              <div className="text-foreground mb-2 text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
              <div className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
