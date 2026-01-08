"use client";

import {
  Star,
  Quote,
  User,
  Briefcase,
  Building2,
  Store,
  Truck,
  MapPin,
  Wheat,
  Anchor,
  Activity,
} from "lucide-react";
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
    <section className="bg-background border-border relative overflow-hidden border-t py-24">
      <div className="relative z-10 container mx-auto max-w-[1400px] px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="text-primary animate-in fade-in slide-in-from-bottom-4 mb-2 block text-sm font-medium duration-500">
            Regional Success
          </span>
          <h2 className="text-foreground animate-in fade-in slide-in-from-bottom-4 mb-6 text-3xl font-semibold tracking-tight delay-100 duration-700 sm:text-4xl md:text-5xl">
            Trusted by teams across <br className="hidden md:block" />
            Manipur and beyond.
          </h2>

          {/* Social Proof Badge */}
          <div className="animate-in fade-in slide-in-from-bottom-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm delay-200 duration-700">
            <span className="inline-flex items-center -space-x-2">
              {[User, User, User, User].map((Icon, i) => (
                <div
                  key={i}
                  className="ring-background bg-muted flex h-6 w-6 items-center justify-center rounded-full ring-2"
                >
                  <Icon className="text-muted-foreground h-3 w-3" />
                </div>
              ))}
            </span>
            <span className="text-muted-foreground ml-2 inline-flex items-center gap-1 text-sm">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                />
              ))}
              <span className="text-foreground ml-1 font-medium">
                5.0 • Local Partners
              </span>
            </span>
          </div>
        </div>

        {/* Scrolling Grid */}
        <div
          role="region"
          aria-label="Customer testimonials"
          className="relative grid h-[600px] grid-cols-1 gap-6 overflow-hidden sm:h-[700px] md:h-[800px] md:grid-cols-3"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
          }}
        >
          {testimonials.map((column, colIndex) => (
            <div
              key={colIndex}
              className="relative h-full w-full overflow-hidden"
              aria-hidden={colIndex > 0 ? "true" : undefined}
            >
              {/* Doubled for seamless loop - Adjust animation duration/direction */}
              <div
                className={cn(
                  "absolute flex w-full flex-col gap-6",
                  colIndex % 2 === 0
                    ? "animate-scroll-up"
                    : "animate-scroll-down",
                )}
              >
                {[...column, ...column, ...column, ...column].map((item, i) => {
                  // Quadrupled for smoother infinite scroll on large screens
                  const Icon = item.icon;
                  return (
                    <article
                      key={`${item.name}-${i}`}
                      className="bg-card/40 hover:bg-card/60 group rounded-2xl border border-white/5 p-6 backdrop-blur-sm transition-colors"
                    >
                      <blockquote className="text-muted-foreground/90 relative mb-6 text-base sm:text-lg">
                        <Quote
                          className="text-primary/40 mr-2 mb-2 inline-block h-4 w-4"
                          aria-hidden="true"
                        />
                        &quot;{item.text}&quot;
                      </blockquote>
                      <footer className="flex items-center gap-3">
                        <div
                          className="group-hover:ring-primary/20 bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white/5 transition-all"
                          aria-hidden="true"
                        >
                          <Icon className="text-primary h-5 w-5" />
                        </div>
                        <div>
                          <cite className="text-foreground text-sm font-semibold not-italic">
                            {item.name}
                          </cite>
                          <div className="text-muted-foreground text-xs">
                            {item.role}
                          </div>
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
