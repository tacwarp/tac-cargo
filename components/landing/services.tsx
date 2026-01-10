"use client";

import { motion } from "framer-motion";
import {
  Plane,
  Truck,
  Box,
  FileCheck,
  MapPin,
  BarChart3,
  Code2,
} from "lucide-react";
import { LottieContainer } from "@/components/ui/lottie-container";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Services() {
  return (
    <section
      id="services"
      className="border-border bg-background relative overflow-hidden border-b py-24"
    >
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05]" />

      <div className="relative z-10 container mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="mb-16 flex flex-col items-start space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <div className="bg-primary h-px w-8" />
            <span className="text-primary font-mono text-sm tracking-widest uppercase">
              Core Competencies
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-foreground text-4xl font-bold tracking-tight md:text-5xl"
          >
            Infrastructure as a Service.
          </motion.h2>
        </div>

        {/* Bento Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {/* Card 1: Priority Air Freight */}
          <motion.div
            variants={item}
            className="group bg-secondary/20 hover:bg-secondary/30 relative overflow-hidden rounded-3xl border border-white/5 p-8 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-4 opacity-50 transition-opacity group-hover:opacity-100">
              <Plane className="text-primary/10 h-24 w-24 -rotate-12" />
            </div>
            <Plane className="text-primary mb-6 h-8 w-8" />
            <h3 className="text-foreground mb-2 text-xl font-medium">
              Priority Air Freight
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Guaranteed next-day connection between major hubs. Optimized for
              time-critical electronics and pharma.
            </p>
          </motion.div>

          {/* Card 2: Surface Haulage */}
          <motion.div
            variants={item}
            className="group bg-secondary/20 hover:bg-secondary/30 relative overflow-hidden rounded-3xl border border-white/5 p-8 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 p-4 opacity-50 transition-opacity group-hover:opacity-100">
              <Truck className="text-accent/10 h-24 w-24 -rotate-12" />
            </div>
            <Truck className="text-accent mb-6 h-8 w-8" />
            <h3 className="text-foreground mb-2 text-xl font-medium">
              Surface Haulage
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Cost-effective heavy cargo transport. GPS-monitored fleet with
              secure locking mechanisms.
            </p>
          </motion.div>

          {/* Card 3: Automated Sorting (Featured) */}
          <motion.div
            variants={item}
            className="group bg-secondary/20 hover:bg-secondary/30 relative col-span-1 overflow-hidden rounded-3xl border border-white/5 p-8 transition-all duration-300 md:col-span-2"
          >
            <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-1/2 opacity-80">
              <LottieContainer
                src="/lottie/Automated-Sorting.json"
                containerClassName="h-full w-full"
                className="h-full w-full object-cover"
              />
              <div className="to-secondary/20 absolute inset-0 bg-gradient-to-l from-transparent" />
            </div>
            <div className="relative z-10 w-2/3">
              <div className="bg-primary/10 text-primary mb-6 inline-flex rounded-2xl p-3">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-foreground mb-2 text-2xl font-medium">
                Automated Sorting
              </h3>
              <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                AI-driven warehousing reduces handling time by 40%. Smart
                categorization automatically routes packages to optimal shipping
                lanes.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Secure Warehousing */}
          <motion.div
            variants={item}
            className="group bg-secondary/20 hover:bg-secondary/30 relative overflow-hidden rounded-3xl border border-white/5 p-8 transition-all duration-300"
          >
            <Box className="text-foreground mb-6 h-8 w-8" />
            <h3 className="text-foreground mb-2 text-xl font-medium">
              Secure Warehousing
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Climate-controlled storage facilities at origin and destination
              nodes. 24/7 surveillance.
            </p>
          </motion.div>

          {/* Card 5: Regulatory Clearance */}
          <motion.div
            variants={item}
            className="group bg-secondary/20 hover:bg-secondary/30 relative overflow-hidden rounded-3xl border border-white/5 p-8 transition-all duration-300"
          >
            <FileCheck className="text-success mb-6 h-8 w-8" />
            <h3 className="text-foreground mb-2 text-xl font-medium">
              Regulatory Clearance
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Automated documentation handling for inter-state tax compliance
              and waybill generation.
            </p>
          </motion.div>

          {/* Card 6: Last Mile Precision */}
          <motion.div
            variants={item}
            className="group bg-secondary/20 hover:bg-secondary/30 relative overflow-hidden rounded-3xl border border-white/5 p-8 transition-all duration-300"
          >
            <MapPin className="text-warning mb-6 h-8 w-8" />
            <h3 className="text-foreground mb-2 text-xl font-medium">
              Last Mile Precision
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Doorstep delivery verification with biometric proof of receipt.
              Zero-contact options available.
            </p>
          </motion.div>

          {/* Card 7: Advanced Analytics */}
          <motion.div
            variants={item}
            className="group bg-secondary/20 hover:bg-secondary/30 relative overflow-hidden rounded-3xl border border-white/5 p-8 transition-all duration-300"
          >
            <BarChart3 className="text-info mb-6 h-8 w-8" />
            <h3 className="text-foreground mb-2 text-xl font-medium">
              Real-time Analytics
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Custom dashboards providing insights into shipping patterns,
              costs, and delivery performance.
            </p>
          </motion.div>

          {/* Card 8: API Integration */}
          <motion.div
            variants={item}
            className="group bg-secondary/20 hover:bg-secondary/30 relative overflow-hidden rounded-3xl border border-white/5 p-8 transition-all duration-300"
          >
            <Code2 className="mb-6 h-8 w-8 text-primary" />
            <h3 className="text-foreground mb-2 text-xl font-medium">
              Developer API
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              RESTful endpoints for seamless integration with your existing ERP
              and inventory systems.
            </p>
          </motion.div>

          {/* Card 10: Global Network (Visual) */}
          <motion.div
            variants={item}
            className="group from-primary/20 to-secondary/20 hover:border-primary/30 relative col-span-1 overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br p-0 transition-all duration-300 md:col-span-2 xl:col-span-2"
          >
            <div className="absolute inset-0 z-0 opacity-50">
              <LottieContainer
                src="/lottie/Global-Network.json"
                className="h-full w-full opacity-60 mix-blend-screen"
              />
            </div>
            <div className="from-background relative z-10 flex h-full flex-col justify-end bg-gradient-to-t via-transparent to-transparent p-8">
              <h3 className="text-foreground mb-2 text-2xl font-medium">
                Global Network
              </h3>
              <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
                Expanding beyond borders with strategic international
                partnerships. Seamless customs integration for cross-border
                freight.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
