import { Plane, Truck, Box, FileCheck, MapPin, BarChart3, Code2, Leaf } from "lucide-react"
import { LottieContainer } from "@/components/ui/lottie-container"

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden border-b border-border bg-background py-16 lg:py-24">
      <div className="container mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="mb-12 lg:mb-16">
          <span className="mb-4 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Core Competencies</span>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">Infrastructure as a Service.</h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          
          {/* Card 1: Priority Air Freight */}
          <div className="group flex min-h-[280px] flex-col justify-between bg-card p-6 transition-colors hover:bg-muted/20 lg:min-h-[320px] lg:p-8">
            <div>
              <Plane className="mb-6 h-6 w-6 text-foreground/80 stroke-[1.5]" />
              <h3 className="mb-2 text-base font-medium text-foreground">Priority Air Freight</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Guaranteed next-day connection between major hubs. Optimized for time-critical electronics and pharma.</p>
            </div>
          </div>

          {/* Card 2: Surface Haulage */}
          <div className="group flex min-h-[280px] flex-col justify-between bg-card p-6 transition-colors hover:bg-muted/20 lg:min-h-[320px] lg:p-8">
            <div>
              <Truck className="mb-6 h-6 w-6 text-foreground/80 stroke-[1.5]" />
              <h3 className="mb-2 text-base font-medium text-foreground">Surface Haulage</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Cost-effective heavy cargo transport. GPS-monitored fleet with secure locking mechanisms.</p>
            </div>
          </div>

          {/* Card 3: Automated Sorting (Lottie Feature) - Spans 2 cols on large screens */}
          <div className="group relative col-span-1 flex min-h-[280px] flex-col justify-end overflow-hidden bg-card transition-colors hover:bg-muted/20 md:col-span-2 lg:col-span-1 xl:col-span-2">
             <div className="absolute inset-0 z-0">
                 <LottieContainer 
                    src="/lottie/Automated-Sorting.json" 
                    containerClassName="h-full w-full"
                    className="h-[110%] w-[110%] -translate-x-[5%]"
                 />
             </div>
             <div className="relative z-10 p-6 lg:p-8">
                 <h3 className="mb-2 text-base font-medium text-foreground">Automated Sorting</h3>
                 <p className="text-sm leading-relaxed text-muted-foreground">AI-driven warehousing reduces handling time by 40%. Smart categorization.</p>
             </div>
          </div>

          {/* Card 4: Secure Warehousing */}
          <div className="group flex min-h-[280px] flex-col justify-between bg-card p-6 transition-colors hover:bg-muted/20 lg:min-h-[320px] lg:p-8">
            <div>
              <Box className="mb-6 h-6 w-6 text-foreground/80 stroke-[1.5]" />
              <h3 className="mb-2 text-base font-medium text-foreground">Secure Warehousing</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Climate-controlled storage facilities at origin and destination nodes. 24/7 surveillance.</p>
            </div>
          </div>

          {/* Card 5: Regulatory Clearance */}
          <div className="group flex min-h-[280px] flex-col justify-between bg-card p-6 transition-colors hover:bg-muted/20 lg:min-h-[320px] lg:p-8">
            <div>
              <FileCheck className="mb-6 h-6 w-6 text-foreground/80 stroke-[1.5]" />
              <h3 className="mb-2 text-base font-medium text-foreground">Regulatory Clearance</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Automated documentation handling for inter-state tax compliance and waybill generation.</p>
            </div>
          </div>

          {/* Card 6: Last Mile Precision */}
          <div className="group flex min-h-[280px] flex-col justify-between bg-card p-6 transition-colors hover:bg-muted/20 lg:min-h-[320px] lg:p-8">
            <div>
              <MapPin className="mb-6 h-6 w-6 text-foreground/80 stroke-[1.5]" />
              <h3 className="mb-2 text-base font-medium text-foreground">Last Mile Precision</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Doorstep delivery verification with biometric proof of receipt. Zero-contact options available.</p>
            </div>
          </div>

          {/* NEW CONTENT CARDS */}

          {/* Card 7: Advanced Analytics */}
          <div className="group flex min-h-[280px] flex-col justify-between bg-card p-6 transition-colors hover:bg-muted/20 lg:min-h-[320px] lg:p-8">
            <div>
              <BarChart3 className="mb-6 h-6 w-6 text-foreground/80 stroke-[1.5]" />
              <h3 className="mb-2 text-base font-medium text-foreground">Real-time Analytics</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Custom dashboards providing insights into shipping patterns, costs, and delivery performance.</p>
            </div>
          </div>

          {/* Card 8: API Integration (Developer Focused) */}
          <div className="group flex min-h-[280px] flex-col justify-between bg-card p-6 transition-colors hover:bg-muted/20 lg:min-h-[320px] lg:p-8">
            <div>
              <Code2 className="mb-6 h-6 w-6 text-foreground/80 stroke-[1.5]" />
              <h3 className="mb-2 text-base font-medium text-foreground">Developer API</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">RESTful endpoints for seamless integration with your existing ERP and inventory systems.</p>
            </div>
          </div>

          {/* Card 9: Sustainability */}
          <div className="group flex min-h-[280px] flex-col justify-between bg-card p-6 transition-colors hover:bg-muted/20 lg:min-h-[320px] lg:p-8">
            <div>
              <Leaf className="mb-6 h-6 w-6 text-foreground/80 stroke-[1.5]" />
              <h3 className="mb-2 text-base font-medium text-foreground">Green Logistics</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Commitment to reducing carbon footprint through optimized routing and electric last-mile fleet.</p>
            </div>
          </div>
          
           {/* Card 10: Global Network (Visual) - Split Layout */}
           <div className="group relative col-span-1 grid grid-rows-[auto_1fr] bg-card transition-colors hover:bg-muted/20 md:col-span-2 xl:col-span-1">
             <div className="relative h-[200px] w-full border-b border-border bg-background/50 sm:h-[240px]">
                <div className="h-full w-full p-0">
                    <LottieContainer 
                      src="/lottie/Global-Network.json" 
                      className="h-full w-full"
                    />
                </div>
             </div>
             <div className="p-6 lg:p-8">
                 <h3 className="mb-2 text-base font-medium text-foreground">Global Network</h3>
                 <p className="text-sm leading-relaxed text-muted-foreground">Expanding beyond borders with strategic international partnerships.</p>
             </div>
          </div>

        </div>
      </div>
    </section>
  )
}
