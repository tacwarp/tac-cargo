"use client";

import { RiTrophyLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function TopDrivers() {
  const drivers = [
    {
      name: "Sophia Hayes",
      score: 4.9,
      onTime: "98%",
      img: "https://i.pravatar.cc/100?img=5",
      rank: 1,
    },
    {
      name: "Marcus Chen",
      score: 4.8,
      onTime: "96%",
      img: "https://i.pravatar.cc/100?img=11",
      rank: 2,
    },
    {
      name: "Jack Linton",
      score: 4.8,
      onTime: "95%",
      img: "https://i.pravatar.cc/100?img=33",
      rank: 3,
    },
    {
      name: "Amelia Rowann",
      score: 4.7,
      onTime: "94%",
      img: "https://i.pravatar.cc/100?img=9",
      rank: 4,
    },
  ];

  return (
    <section className="bg-card/50 flex-1 rounded-[24px] border border-border p-6 backdrop-blur-xl text-card-foreground">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-foreground uppercase">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />{" "}
          Top Drivers
        </h3>
        <RiTrophyLine
          size={16}
          className="text-warning drop-shadow-[0_0_8px_var(--warning)]"
        />
      </div>

      <div className="flex flex-col gap-4">
        {drivers.map((driver) => (
          <div
            key={driver.name}
            className={cn(
              driver.rank > 3 && "opacity-60 hover:opacity-100",
            )}
          >
            <div className="relative">
              <Image
                src={driver.img}
                alt="Driver"
                width={40}
                height={40}
                className="rounded-full border-2 border-border object-cover"
              />
              <div
                className={cn(
                  "border-card absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border text-[9px] font-bold shadow-lg",
                  driver.rank === 1
                    ? "bg-warning text-warning-foreground shadow-[0_0_8px_var(--warning)]"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {driver.rank}
              </div>
            </div>
            <div className="flex-1">
              <div className="group-hover:text-primary text-xs font-bold tracking-wide text-foreground uppercase transition-colors">
                {driver.name}
              </div>
              {driver.onTime} On-time
            </div>
            <div className="text-primary font-mono text-sm font-bold">
              {driver.score}
            </div>
          </div>
        ))}
      </div>
    </section >
  );
}
