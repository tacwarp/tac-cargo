"use client";

import { Star, Quote, User, Briefcase, Building2, Store, Truck, MapPin, Wheat, Anchor, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
  // Column 1
  [
    {
      text: "Moving perishable goods from Ukhrul to the specialized zones used to take days. TAC's tracking changed everything.",
      name: "Roel Shimray",
      role: "Director, Siroi Logistics, Ukhrul",
      icon: Truck,
    },
    {
      text: "The reliability of the Imphal corridor is crucial for our handloom exports. TAC gave us that certainty.",
      name: "O. Bem Devi",
      role: "CEO, Ima Keithel Exports, Imphal",
      icon: Store,
    },
    {
      text: "We monitor our cold chain in real-time now across Moirang. The dashboard is perfect for our field operations.",
      name: "K. Ibohal Singh",
      role: "Ops Head, Loktak Fisheries, Moirang",
      icon: Anchor,
    },
  ],
  // Column 2
  [
    {
      text: "Connecting remote hill districts to the main supply lines has never been smoother. Support is fantastic.",
      name: "Worthing Horam",
      role: "Manager, Tangkhul Traders, Ukhrul",
      icon: Briefcase,
    },
    {
      text: "For medical supplies, timing is life. TAC's precision ensures our critical stock always arrives on time at RIMS.",
      name: "Dr. S. Ibemhal",
      role: "Director, Medical Supply Chain, Imphal",
      icon: Activity,
    },
    {
      text: "Automated dispatching reduced our manual errors to zero. A true game changer for efficiency in Kakching.",
      name: "Thangjam Joy",
      role: "Lead, Grain Bank, Kakching",
      icon: Wheat,
    },
  ],
  // Column 3
  [
    {
      text: "From harvest to market, total visibility. Our spice trade has expanded thanks to this infrastructure.",
      name: "Mary Z.",
      role: "Proprietor, Highland Spices, Imphal",
      icon: Building2,
    },
    {
      text: "The API is world-class. Integrating it with our local inventory systems in Imphal East took less than an hour.",
      name: "N. Biren",
      role: "Tech Lead, Kangla Tech, Imphal East",
      icon: MapPin,
    },
    {
      text: "Coordinating logistics during the Sangai festival season was a nightmare. Now it's our competitive advantage.",
      name: "Ng. Bala",
      role: "Coordinator, Sangai Tours, Moirang",
      icon: User,
    },
  ],
];

export function Testimonials() {
  return (
    <section className="relative py-24 bg-background border-t border-border overflow-hidden">
      <div className="container mx-auto max-w-[1400px] px-6 relative z-10">

        {/* Header */}
        <div className="mb-12 text-center">
          <span className="text-sm font-medium text-primary mb-2 block animate-in fade-in slide-in-from-bottom-4 duration-500">
            Regional Success
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Trusted by teams across <br className="hidden md:block" />
            Manipur and beyond.
          </h2>

          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 border-white/10 bg-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 backdrop-blur-sm">
            <span className="inline-flex items-center -space-x-2">
              {[User, User, User, User].map((Icon, i) => (
                <div key={i} className="h-6 w-6 rounded-full ring-2 ring-background bg-muted flex items-center justify-center">
                  <Icon className="w-3 h-3 text-muted-foreground" />
                </div>
              ))}
            </span>
            <span className="ml-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-1 font-medium text-foreground">5.0 • Local Partners</span>
            </span>
          </div>
        </div>

        {/* Scrolling Grid */}
        <div
          role="region"
          aria-label="Customer testimonials"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px] sm:h-[700px] md:h-[800px] overflow-hidden relative"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)"
          }}
        >
          {testimonials.map((column, colIndex) => (
            <div key={colIndex} className="relative w-full h-full overflow-hidden" aria-hidden={colIndex > 0 ? "true" : undefined}>
              {/* Doubled for seamless loop - Adjust animation duration/direction */}
              <div
                className={cn(
                  "flex flex-col gap-6 absolute w-full",
                  colIndex % 2 === 0 ? "animate-scroll-up" : "animate-scroll-down"
                )}
              >
                {[...column, ...column, ...column, ...column].map((item, i) => { // Quadrupled for smoother infinite scroll on large screens
                  const Icon = item.icon;
                  return (
                    <article
                      key={`${item.name}-${i}`}
                      className="p-6 rounded-2xl border border-white/5 bg-card/40 backdrop-blur-sm hover:bg-card/60 transition-colors group"
                    >
                      <blockquote className="text-base sm:text-lg text-muted-foreground/90 mb-6 relative">
                        <Quote className="w-4 h-4 text-primary/40 mb-2 inline-block mr-2" aria-hidden="true" />
                        "{item.text}"
                      </blockquote>
                      <footer className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full ring-2 ring-white/5 group-hover:ring-primary/20 transition-all bg-primary/10 flex items-center justify-center" aria-hidden="true">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <cite className="text-sm font-semibold text-foreground not-italic">{item.name}</cite>
                          <div className="text-xs text-muted-foreground">{item.role}</div>
                        </div>
                      </footer>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
