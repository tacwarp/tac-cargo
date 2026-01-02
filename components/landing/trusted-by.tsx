const PARTNER_NAMES = [
    "Kangla Global",
    "Siroi Logistics",
    "Loktak Hydro",
    "Ima Exports",
    "Sangai Systems",
    "Barak Valley Corp",
    "Classic Group",
    "Hills & Valley",
] as const

export function TrustedBy() {
    return (
        <section
            className="border-y overflow-hidden bg-muted/50 border-white/5 pt-10 pb-10"
            aria-label="Our trusted partners"
            style={{
                maskImage: "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)",
                WebkitMaskImage: "linear-gradient(90deg, transparent, black 20%, black 80%, transparent)"
            }}
        >
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-8">
                    Powering supply chains across Manipur
                </p>
                <div className="relative flex overflow-x-hidden group" role="marquee" aria-label={`Partners: ${PARTNER_NAMES.join(', ')}`}>
                    {/* Primary content - visible to screen readers */}
                    <div className="animate-marquee whitespace-nowrap flex gap-16 items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {PARTNER_NAMES.map((name, i) => (
                            <span 
                                key={`primary-${name}`} 
                                className={`text-xl font-bold tracking-tight ${i % 3 === 0 ? "font-serif italic" : i % 2 === 0 ? "font-mono" : "font-sans"}`}
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                    {/* Duplicated content for seamless loop - hidden from screen readers */}
                    <div 
                        className="animate-marquee whitespace-nowrap flex gap-16 items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                        aria-hidden="true"
                    >
                        {PARTNER_NAMES.map((name, i) => (
                            <span 
                                key={`duplicate-${name}`} 
                                className={`text-xl font-bold tracking-tight ${i % 3 === 0 ? "font-serif italic" : i % 2 === 0 ? "font-mono" : "font-sans"}`}
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
