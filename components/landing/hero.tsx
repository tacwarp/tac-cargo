'use client'

import { ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LottieContainer } from "@/components/ui/lottie-container"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative flex min-h-[85vh] flex-col justify-center border-b border-border bg-background pt-24 pb-12 lg:pb-0">
      {/* Background Grid - Subtle */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>
      
      {/* Primary Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]"></div>

      <div className="container mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-12 px-4 py-8 md:px-6 lg:grid-cols-2 lg:gap-16 lg:pr-12">
        
        {/* Hero Content */}
        <div className="flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Status Badge */}
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 lg:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Network Operational</span>
          </div>
          
          <h1 className="mb-4 text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl lg:mb-6 lg:text-7xl leading-[1.1]">
            The Imphal–Delhi <br />
            <span className="text-muted-foreground">Logistics Corridor.</span>
          </h1>
          
          <p className="mb-8 max-w-lg text-base font-light leading-relaxed text-muted-foreground sm:text-lg lg:mb-10 lg:text-xl">
            Engineering precision in high-velocity freight. We bridge the distance between the Northeast and the Capital with absolute reliability.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button 
              size="lg" 
              className="group h-12 gap-2 rounded-none px-6 text-xs font-medium uppercase tracking-widest ring-offset-2 hover:bg-primary/90 lg:h-auto lg:py-3"
              asChild
            >
              <Link href="#tracking">
                Track Shipment
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </Link>
            </Button>
            <Button 
              variant="outline"
              size="lg" 
              className="h-12 rounded-none border-border bg-transparent px-6 text-xs font-medium uppercase tracking-widest text-foreground hover:bg-muted/10 lg:h-auto lg:py-3"
              asChild
            >
              <Link href="#services">View Rate Card</Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-8 lg:mt-16 lg:gap-8">
            <div>
              <div className="font-mono text-xl tracking-tighter text-foreground lg:text-2xl">0.01<span className="text-muted-foreground">%</span></div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Error Rate</div>
            </div>
            <div>
              <div className="font-mono text-xl tracking-tighter text-foreground lg:text-2xl">14<span className="text-muted-foreground">h</span></div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Avg Transit</div>
            </div>
            <div>
              <div className="font-mono text-xl tracking-tighter text-foreground lg:text-2xl">100<span className="text-muted-foreground">%</span></div>
              <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Coverage</div>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative flex w-full items-center justify-center border border-border bg-background/50 h-[300px] sm:h-[400px] lg:h-[600px] animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
          <div className="absolute left-0 top-0 z-10 border-b border-r border-border bg-background px-4 py-2 font-mono text-[10px] text-muted-foreground">
            FIG_01: CORRIDOR_VISUALIZATION
          </div>
          <div className="absolute right-0 top-0 h-4 w-4 border-b border-l border-primary/20"></div>
          <div className="absolute bottom-0 left-0 h-4 w-4 border-r border-t border-primary/20"></div>
          
          <div className="h-full w-full p-0">
            <LottieContainer 
              src="/lottie/CORRIDOR_VISUALIZATION.json"
              className="h-full w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
