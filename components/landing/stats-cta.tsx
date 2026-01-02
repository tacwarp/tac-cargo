"use client"

import { ArrowRight, Box, ShieldCheck, Timer } from "lucide-react"
import { motion } from "framer-motion"

export function StatsCTA() {
    return (
        <section className="relative w-full border-t border-white/5 bg-background py-20 lg:py-24 overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_40%)] opacity-5 pointer-events-none" />

            <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 mb-16">
                    <div className="max-w-2xl">
                        <h2 className="font-playfair text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] tracking-tight text-foreground">
                            The Numbers <br />
                            <span className="italic text-primary/80">behind precision.</span>
                        </h2>
                        <p className="mt-6 text-lg text-muted-foreground/80 font-light max-w-xl">
                            Reliability isn't a promise; it's a statistical certainty.
                            These are the metrics that define the <span className="text-foreground font-medium">Imphal-Delhi</span> corridor.
                        </p>
                    </div>

                    <div className="flex flex-col items-start gap-6 max-w-sm pt-4">
                        <p className="text-sm text-muted-foreground">
                            Real-time telemetry, chain-of-custody protocols, and zero-failure delivery commitments.
                        </p>
                        <a 
                            href="/dashboard/analytics" 
                            aria-label="View our operational metrics" 
                            className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        >
                            View System Metrics
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </a>
                    </div>
                </div>

                <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.5fr_1fr_1fr]">
                    {/* Stat 1: Volume */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-primary/5 px-8 py-10 border border-primary/20 flex flex-col justify-between relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity" aria-hidden="true">
                            <Box className="w-24 h-24 text-primary rotate-12" />
                        </div>
                        <div>
                            <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4">
                                Throughput
                            </p>
                            <p className="text-6xl sm:text-7xl font-playfair font-medium tracking-tight text-foreground">
                                12k<span className="text-4xl align-top">+</span>
                            </p>
                            <p className="mt-2 text-lg text-muted-foreground">
                                Monthly Shipments
                            </p>
                        </div>
                        <p className="mt-8 text-sm text-muted-foreground/80 max-w-md leading-relaxed">
                            Consignments successfully processed across the Northeast corridor with zero loss incidents in the last quarter.
                        </p>
                    </motion.article>

                    {/* Stat 2: Reliability */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="rounded-[2.5rem] bg-card px-8 py-10 border border-white/5 flex flex-col justify-between group hover:border-primary/30 transition-colors"
                    >
                        <div>
                            <p className="text-xs font-bold tracking-[0.2em] uppercase text-emerald-500 mb-4">
                                Reliability
                            </p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-5xl sm:text-6xl font-playfair font-medium tracking-tight text-foreground">
                                    99.9
                                </p>
                                <span className="text-2xl font-medium text-muted-foreground">%</span>
                            </div>
                            <p className="mt-2 text-base text-muted-foreground">
                                On-Time Delivery
                            </p>
                        </div>
                        <p className="mt-8 text-sm text-muted-foreground/60">
                            Precision timing protocols ensure your cargo arrives exactly when predicted, regardless of terrain.
                        </p>
                    </motion.article>

                    {/* Stat 3: Speed */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="rounded-[2.5rem] bg-card px-8 py-10 border border-white/5 flex flex-col justify-between group hover:border-primary/30 transition-colors"
                    >
                        <div>
                            <p className="text-xs font-bold tracking-[0.2em] uppercase text-blue-400 mb-4">
                                Velocity
                            </p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-5xl sm:text-6xl font-playfair font-medium tracking-tight text-foreground">
                                    48
                                </p>
                                <span className="text-2xl font-medium text-muted-foreground">hrs</span>
                            </div>
                            <p className="mt-2 text-base text-muted-foreground">
                                Max Transit Time
                            </p>
                        </div>
                        <p className="mt-8 text-sm text-muted-foreground/60">
                            From Imphal to Delhi. We bridge the distance faster than any ground-based competitor.
                        </p>
                    </motion.article>
                </div>
            </div>
        </section>
    )
}
