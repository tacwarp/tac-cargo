"use client";

import RadialOrbitalTimeline, { TimelineItem } from "@/components/ui/radial-orbital-timeline";
import { Truck, Package, CheckCircle2, MapPin, BarChart3, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const operationalData: TimelineItem[] = [
    {
        id: 1,
        title: "Initiate Consignment",
        date: "PHASE 01",
        content: "Schedule pickup via dashboard or API. Automated waybill generation and biometric tagging at origin hub.",
        category: "Initiation",
        icon: Package,
        relatedIds: [2],
        status: "completed",
        energy: 100,
    },
    {
        id: 2,
        title: "Transit & Telemetry",
        date: "PHASE 02",
        content: "Real-time GPS tracking across the Imphal-Delhi corridor. Automated status updates at every checkpoint via IoT sensors.",
        category: "Transit",
        icon: Truck,
        relatedIds: [1, 3, 5],
        status: "in-progress",
        energy: 85,
    },
    {
        id: 3,
        title: "Secure Handover",
        date: "PHASE 03",
        content: "Verified delivery with digital signature. Instant proof-of-delivery (POD) synced to your dashboard blocks.",
        category: "Delivery",
        icon: CheckCircle2,
        relatedIds: [2, 4],
        status: "pending",
        energy: 45,
    },
    {
        id: 4,
        title: "Analytics Review",
        date: "PHASE 04",
        content: "Post-delivery performance analysis and cost optimization reporting based on route efficiency.",
        category: "Analytics",
        icon: BarChart3,
        relatedIds: [3],
        status: "pending",
        energy: 30,
    },
    {
        id: 5,
        title: "Security Audit",
        date: "PROTOCOL",
        content: "Continuous background verification of transit nodes to ensure cargo integrity and zero-tamper policies.",
        category: "Security",
        icon: ShieldCheck,
        relatedIds: [2],
        status: "in-progress",
        energy: 95,
    }
];

export function OperationalLogic() {
    return (
        <section className="py-24 bg-background relative overflow-hidden min-h-screen flex flex-col items-center justify-center">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-8 text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-2 mb-4"
                    >
                        <div className="h-px w-8 bg-primary" />
                        <span className="font-mono text-sm uppercase tracking-widest text-primary">Operational Logic</span>
                        <div className="h-px w-8 bg-primary" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
                    >
                        Precision from <span className="text-gradient-primary">Origin</span> to <span className="text-gradient-primary">Destination</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-muted-foreground"
                    >
                        Our autonomous logistics protocol ensures transparency and security at every node of the supply chain.
                    </motion.p>
                </div>

                <div className="relative -mt-20 scale-90 md:scale-100">
                    <RadialOrbitalTimeline timelineData={operationalData} />
                </div>
            </div>
        </section>
    );
}
