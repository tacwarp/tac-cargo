'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="bg-background py-32">
      <div className="container mx-auto flex max-w-[1000px] flex-col items-center px-6 text-center">
        <h2 className="mb-6 text-4xl font-semibold tracking-tighter text-foreground sm:text-5xl md:text-6xl">
          Ready to Initiate?
        </h2>
        <p className="mb-12 max-w-2xl text-lg font-light text-muted-foreground">
          Join the logistics network engineering the future of the Northeast corridor. Instant quotes, zero friction.
        </p>
        
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" className="h-14 min-w-[200px] rounded-none px-8 font-medium uppercase tracking-widest" asChild>
            <Link href="#tracking">
              Start Shipping
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14 min-w-[200px] gap-2 rounded-none border-border px-8 font-medium uppercase tracking-widest hover:bg-muted/10" asChild>
            <Link href="#services">
              View Network
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
