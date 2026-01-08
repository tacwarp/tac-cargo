"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Package, Truck, CheckCircle2 } from "lucide-react";

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Animation for the connecting line
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  const steps = [
    {
      id: "01",
      title: "Initiate Consignment",
      description:
        "Schedule pickup via dashboard or API. Automated waybill generation and biometric tagging at origin hub.",
      icon: Package,
      color: "text-primary",
    },
    {
      id: "02",
      title: "Transit & Telemetry",
      description:
        "Real-time GPS tracking across the Imphal-Delhi corridor. Automated status updates at every checkpoint.",
      icon: Truck,
      color: "text-accent",
    },
    {
      id: "03",
      title: "Secure Handover",
      description:
        "Verified delivery with digital signature. Instant proof-of-delivery (POD) synced to your dashboard.",
      icon: CheckCircle2,
      color: "text-success",
    },
  ];

  return (
    <section
      id="process"
      ref={containerRef}
      className="bg-background relative overflow-hidden py-32"
    >
      {/* Background Elements */}
      <div className="from-primary/5 absolute top-1/4 right-0 -z-10 h-1/2 w-1/3 bg-gradient-to-b to-transparent blur-3xl" />

      <div className="container mx-auto max-w-[1200px] px-6">
        {/* Header */}
        <div className="mb-24 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <div className="bg-primary h-px w-8" />
              <span className="text-primary font-mono text-sm tracking-widest uppercase">
                Operational Logic
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-foreground text-4xl font-bold tracking-tight md:text-5xl"
            >
              Precision from{" "}
              <span className="text-muted-foreground">Origin</span> to{" "}
              <span className="text-foreground">Destination.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-primary/60 bg-primary/5 border-primary/10 rounded-full border px-4 py-2 font-mono text-xs"
          >
            {`// EXECUTION_PROTOCOL_V2.0`}
          </motion.div>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Vertical Line (Desktop) */}
          <div className="bg-border absolute top-0 bottom-0 left-[27px] hidden w-px -translate-x-1/2 md:left-1/2 md:block">
            <motion.div
              style={{ height: lineHeight }}
              className="from-primary via-accent to-success w-full origin-top bg-gradient-to-b"
            />
          </div>

          <div className="relative space-y-12 pl-16 md:space-y-24 md:pl-0">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex flex-col items-start gap-8 md:flex-row md:gap-16 ${isEven ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Content Side */}
                  <div
                    className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"} pt-4`}
                  >
                    <div
                      className={`mb-4 inline-flex items-center gap-3 ${isEven ? "md:flex-row-reverse" : ""}`}
                    >
                      <span
                        className={`font-mono text-4xl font-bold opacity-20 ${step.color}`}
                      >
                        {step.id}
                      </span>
                      <h3 className="text-foreground text-2xl font-bold">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground mr-auto ml-0 max-w-md text-lg leading-relaxed md:mx-0">
                      {step.description}
                    </p>
                  </div>

                  {/* Center Node */}
                  <div className="relative z-10 hidden flex-shrink-0 md:flex">
                    <div className="bg-background border-background relative flex h-14 w-14 items-center justify-center rounded-full border-4 shadow-xl">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step.color.replace("text-", "border-")} bg-background`}
                      >
                        <step.icon className={`h-5 w-5 ${step.color}`} />
                      </div>
                    </div>
                  </div>

                  {/* Empty Side for balance */}
                  <div className="hidden flex-1 md:block" />

                  {/* Mobile Version Node */}
                  <div className="absolute left-0 flex h-full w-14 items-start justify-center md:hidden">
                    <div className="bg-background border-border z-10 mt-1 flex h-10 w-10 items-center justify-center rounded-full border-2">
                      <step.icon className={`h-5 w-5 ${step.color}`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
