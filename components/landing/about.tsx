'use client'

export function About() {
  return (
    <section id="about" className="bg-card py-32 border-b border-border">
      <div className="container mx-auto max-w-[1000px] px-6 text-center">
        <span className="mb-6 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Our Philosophy</span>
        <h2 className="mb-8 text-4xl font-semibold tracking-tighter text-foreground leading-tight sm:text-5xl">
          We don&apos;t just move cargo.<br />
          We eliminate <span className="text-muted-foreground">uncertainty.</span>
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-lg font-light leading-relaxed text-muted-foreground">
          Founded in 2010, TAC was built on a single premise: The connection between Northeast India and the National Capital Region was inefficient. We rebuilt it from the ground up, integrating technology, aviation partnerships, and a proprietary ground fleet to create a seamless corridor.
        </p>
        
        <div className="grid grid-cols-2 gap-8 border-y border-border py-12 md:grid-cols-4">
          <div>
            <div className="mb-2 text-3xl font-semibold tracking-tight text-foreground">15+</div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Years Active</div>
          </div>
          <div>
            <div className="mb-2 text-3xl font-semibold tracking-tight text-foreground">50k+</div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Deliveries</div>
          </div>
          <div>
            <div className="mb-2 text-3xl font-semibold tracking-tight text-foreground">24/7</div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Support Ops</div>
          </div>
          <div>
            <div className="mb-2 text-3xl font-semibold tracking-tight text-foreground">0%</div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Hidden Fees</div>
          </div>
        </div>
      </div>
    </section>
  )
}
