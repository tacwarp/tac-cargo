'use client'

import { Package, Truck, CheckCircle2 } from "lucide-react"

export function Process() {
  return (
    <section id="network" className="border-b border-border bg-background py-24">
      <div className="container mx-auto max-w-[1400px] px-6">
        <div className="mb-20 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <span className="mb-4 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Operational Logic</span>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Precision from <span className="text-muted-foreground">Origin</span> to <span className="text-muted-foreground">Destination.</span>
            </h2>
          </div>
          <div className="font-mono text-xs text-muted-foreground">
            {`// EXECUTION_PROTOCOL_V2.0`}
          </div>
        </div>

        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Connector Line */}
          <div className="absolute left-0 top-12 hidden h-px w-full bg-border md:block" />

          {/* Step 1 */}
          <div className="group relative bg-background pt-12 md:pt-0">
            <div className="absolute left-0 top-0 mb-6 flex h-8 w-8 items-center justify-center border border-border bg-background font-mono text-xs font-medium text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary md:relative md:top-auto md:mb-8">
              01
            </div>
            <div className="mb-6 flex items-center gap-4">
              <Package className="h-6 w-6 text-foreground stroke-[1.5]" />
              <h3 className="text-lg font-medium text-foreground">Initiate Consignment</h3>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Schedule pickup via dashboard or API. Automated waybill generation and biometric tagging at origin hub.
            </p>
          </div>

          {/* Step 2 */}
          <div className="group relative bg-background pt-12 md:pt-0">
            <div className="absolute left-0 top-0 mb-6 flex h-8 w-8 items-center justify-center border border-border bg-background font-mono text-xs font-medium text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary md:relative md:top-auto md:mb-8">
              02
            </div>
            <div className="mb-6 flex items-center gap-4">
              <Truck className="h-6 w-6 text-foreground stroke-[1.5]" />
              <h3 className="text-lg font-medium text-foreground">Transit & Telemetry</h3>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Real-time GPS tracking across the Imphal-Delhi corridor. Automated status updates at every checkpoint.
            </p>
          </div>

          {/* Step 3 */}
          <div className="group relative bg-background pt-12 md:pt-0">
            <div className="absolute left-0 top-0 mb-6 flex h-8 w-8 items-center justify-center border border-border bg-background font-mono text-xs font-medium text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary md:relative md:top-auto md:mb-8">
              03
            </div>
            <div className="mb-6 flex items-center gap-4">
              <CheckCircle2 className="h-6 w-6 text-foreground stroke-[1.5]" />
              <h3 className="text-lg font-medium text-foreground">Secure Handover</h3>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Verified delivery with digital signature. Instant proof-of-delivery (POD) synced to your dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
