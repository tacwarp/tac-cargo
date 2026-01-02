'use client'

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Package, Truck, CheckCircle2 } from "lucide-react"

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  })

  // Animation for the connecting line
  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"])

  const steps = [
    {
      id: "01",
      title: "Initiate Consignment",
      description: "Schedule pickup via dashboard or API. Automated waybill generation and biometric tagging at origin hub.",
      icon: Package,
      color: "text-primary"
    },
    {
      id: "02",
      title: "Transit & Telemetry",
      description: "Real-time GPS tracking across the Imphal-Delhi corridor. Automated status updates at every checkpoint.",
      icon: Truck,
      color: "text-accent"
    },
    {
      id: "03",
      title: "Secure Handover",
      description: "Verified delivery with digital signature. Instant proof-of-delivery (POD) synced to your dashboard.",
      icon: CheckCircle2,
      color: "text-success"
    }
  ]

  return (
    <section id="process" ref={containerRef} className="relative py-32 bg-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute right-0 top-1/4 w-1/3 h-1/2 bg-gradient-to-b from-primary/5 to-transparent blur-3xl -z-10" />

      <div className="container mx-auto max-w-[1200px] px-6">
        
        {/* Header */}
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              <div className="h-px w-8 bg-primary" />
              <span className="font-mono text-sm uppercase tracking-widest text-primary">Operational Logic</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
            >
              Precision from <span className="text-muted-foreground">Origin</span> to <span className="text-foreground">Destination.</span>
            </motion.h2>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-mono text-xs text-primary/60 bg-primary/5 px-4 py-2 rounded-full border border-primary/10"
          >
            {`// EXECUTION_PROTOCOL_V2.0`}
          </motion.div>
        </div>

        {/* Process Steps */}
        <div className="relative">
          {/* Vertical Line (Desktop) */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block">
            <motion.div 
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-primary via-accent to-success origin-top"
            />
          </div>

          <div className="space-y-12 md:space-y-24 relative pl-16 md:pl-0">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex flex-col md:flex-row gap-8 md:gap-16 items-start ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Content Side */}
                  <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'} pt-4`}>
                    <div className={`inline-flex items-center gap-3 mb-4 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                      <span className={`font-mono text-4xl font-bold opacity-20 ${step.color}`}>{step.id}</span>
                      <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-md ml-0 mr-auto md:mx-0">
                      {step.description}
                    </p>
                  </div>

                  {/* Center Node */}
                  <div className="relative flex-shrink-0 z-10 hidden md:flex">
                    <div className="w-14 h-14 rounded-full bg-background border-4 border-background shadow-xl flex items-center justify-center relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-full" />
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${step.color.replace('text-', 'border-')} bg-background`}>
                        <step.icon className={`w-5 h-5 ${step.color}`} />
                      </div>
                    </div>
                  </div>

                  {/* Empty Side for balance */}
                  <div className="flex-1 hidden md:block" />
                  
                  {/* Mobile Version Node */}
                  <div className="flex md:hidden absolute left-0 w-14 h-full items-start justify-center">
                     <div className="w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center z-10 mt-1">
                        <step.icon className={`w-5 h-5 ${step.color}`} />
                     </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
