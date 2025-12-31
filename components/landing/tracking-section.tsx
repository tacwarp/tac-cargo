'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, ShieldCheck, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LottieContainer } from "@/components/ui/lottie-container"

export function TrackingSection() {
  const [awb, setAwb] = useState("")
  const router = useRouter()

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (awb.trim()) {
      router.push(`/dashboard/tracking?awb=${encodeURIComponent(awb.trim())}`)
    }
  }

  return (
    <section id="tracking" className="border-b border-border bg-card py-16 lg:py-24">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Tracking UI */}
          <div className="lg:col-span-7">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">Global Tracking Protocol</h2>
            <p className="mb-8 text-sm text-muted-foreground sm:text-base lg:mb-10">Real-time telemetry for your high-value consignments.</p>
            
            <form onSubmit={handleTrack} className="group relative mb-8 flex items-center overflow-hidden border border-border bg-background p-1 shadow-2xl transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
              {/* Corner Accents */}
              <div className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-primary/30 opacity-0 transition-opacity group-focus-within:opacity-100" />
              <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-primary/30 opacity-0 transition-opacity group-focus-within:opacity-100" />
              <div className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-primary/30 opacity-0 transition-opacity group-focus-within:opacity-100" />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-primary/30 opacity-0 transition-opacity group-focus-within:opacity-100" />

              <div className="relative flex flex-1 items-center">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                  <span className="ml-2 font-mono text-sm text-muted-foreground">{'>'}</span>
                </div>
                <Input
                  type="text"
                  value={awb}
                  onChange={(e) => setAwb(e.target.value)}
                  placeholder="ENTER AWB NUMBER (e.g. TAC-88291)"
                  aria-label="Air Waybill Number"
                  className="h-14 border-none bg-transparent pl-12 pr-4 font-mono text-xs uppercase tracking-wider text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-0 sm:text-sm"
                />
              </div>
              <Button 
                type="submit" 
                className="h-14 rounded-none px-6 font-mono text-xs font-bold uppercase tracking-widest sm:px-8"
              >
                Execute
              </Button>
            </form>
            
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Badge variant="outline" className="gap-2 rounded-sm border-border bg-background/50 px-3 py-1.5 font-normal text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs">GPS Telemetry</span>
              </Badge>
              <Badge variant="outline" className="gap-2 rounded-sm border-border bg-background/50 px-3 py-1.5 font-normal text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs">Chain of Custody</span>
              </Badge>
            </div>
          </div>

          {/* Tracking Animation */}
          <div className="relative flex h-[300px] items-center justify-center border border-border bg-background lg:col-span-5 lg:h-[400px]">
            {/* Decorative Corners */}
            <div className="absolute left-0 top-0 h-3 w-3 border-l border-t border-primary"></div>
            <div className="absolute right-0 top-0 h-3 w-3 border-r border-t border-primary"></div>
            <div className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-primary"></div>
            <div className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-primary"></div>
            
            <div className="absolute top-2 right-4 font-mono text-[10px] text-muted-foreground">
              STATUS: <span className="text-emerald-500 animate-pulse">LIVE</span>
            </div>

            <div className="h-full w-full p-0">
              <LottieContainer 
                src="/lottie/Global-Tracking-Protocol.json"
                className="h-full w-full"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
