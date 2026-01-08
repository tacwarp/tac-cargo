"use client";

export function RegionalPerformance() {
  const regions = [
    { name: "North America", flag: "🇺🇸", value: 45, opacity: 1 },
    { name: "Europe", flag: "🇪🇺", value: 32, opacity: 0.8 },
    { name: "Asia Pacific", flag: "🌏", value: 15, opacity: 0.6 },
    { name: "South America", flag: "🇧🇷", value: 8, opacity: 0.4 },
  ];

  return (
    <section className="bg-card/50 rounded-[24px] border border-border p-6 backdrop-blur-xl text-card-foreground">
      <h3 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wider text-foreground uppercase">
        <span className="bg-accent h-1.5 w-1.5 animate-pulse rounded-full" />{" "}
        Regional Traffic
      </h3>

      <div className="space-y-6">
        {regions.map((region) => (
          <div key={region.name} className="group">
            <div className="mb-2 flex justify-between text-xs">
              <span className="flex items-center gap-2 font-medium text-muted-foreground">
                {region.flag} {region.name}
              </span>
              <span className="text-mono text-primary font-bold">
                {region.value}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full border border-border bg-muted/20">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-1000 group-hover:shadow-[0_0_10px_var(--primary)]"
                style={{ width: `${region.value}%`, opacity: region.opacity }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
