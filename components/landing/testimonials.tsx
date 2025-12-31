'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Director, Imphal Textiles",
    content: "TAC Cargo stabilized our supply chain. The predictability of the Imphal-Delhi route has allowed us to reduce inventory overhead by 30%.",
    initials: "RK",
  },
  {
    name: "Dr. Sarah Sharma",
    role: "Chief of Logistics, MedLife",
    content: "For pharmaceutical transit, temperature integrity is non-negotiable. TAC's telemetry provides the assurance we need for sensitive cargo.",
    initials: "SS",
  },
  {
    name: "Amit Singh",
    role: "Operations Head, NE Distro",
    content: "Zero hidden fees, 100% reliability. The dashboard API integration saved our engineering team weeks of work.",
    initials: "AS",
  },
]

export function Testimonials() {
  return (
    <section className="border-b border-border bg-card py-24">
      <div className="container mx-auto max-w-[1400px] px-6">
        <div className="mb-20">
          <span className="mb-4 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Trust Protocol</span>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Verified Partners
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group bg-card p-10 transition-colors hover:bg-background">
              <div className="mb-8 flex items-center gap-4">
                <Avatar className="h-10 w-10 rounded-sm border border-border">
                  <AvatarImage src={`/placeholder.svg`} alt={testimonial.name} />
                  <AvatarFallback className="rounded-sm bg-muted text-xs font-medium text-muted-foreground">{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-foreground">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground">
                &ldquo;{testimonial.content}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
