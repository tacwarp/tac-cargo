"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "On Route", value: 62, color: "oklch(var(--primary))" }, // Violet
  { name: "Loading", value: 28, color: "oklch(var(--warning))" }, // Yellow
  { name: "Maintenance", value: 10, color: "oklch(var(--muted-foreground))" }, // Zinc
];

export function VehicleAllocation() {
  return (
    <div className="bg-card flex h-full flex-col justify-between rounded-[24px] border border-border p-6 shadow-lg backdrop-blur-xl transition-all hover:border-primary/20">
      <h3 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wider text-foreground uppercase">
        <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />{" "}
        Fleet Allocation
      </h3>

      <div className="flex items-center gap-8">
        {/* Donut Chart */}
        <div className="relative flex h-40 w-40 shrink-0 items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <filter
                  id="glow-primary"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={75}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                cornerRadius={4}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter: index === 0 ? "url(#glow-primary)" : "none",
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute text-center">
            <div className="font-display text-3xl font-bold text-foreground">48</div>
            <div className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Total
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          {data.map((item) => (
            <div
              key={item.name}
              className="group flex cursor-default items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 10px ${item.color}`,
                  }}
                ></div>
                <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase transition-colors group-hover:text-foreground">
                  {item.name}
                </span>
              </div>
              <span className="font-mono font-bold text-foreground">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
