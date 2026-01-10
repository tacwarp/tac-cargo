"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface MaintenanceItem {
  id: string;
  name: string;
  task: string;
  avatar: string;
  time: string;
  statusTheme: "warning" | "primary" | "destructive";
}

export function MaintenanceList() {
  const items: MaintenanceItem[] = [
    {
      id: "1",
      name: "Jack Linton",
      task: "Tire Change",
      avatar: "https://i.pravatar.cc/100?img=33",
      time: "00:17",
      statusTheme: "warning",
    },
    {
      id: "2",
      name: "Samuel Waters",
      task: "Oil Check",
      avatar: "https://i.pravatar.cc/100?img=15",
      time: "00:19",
      statusTheme: "primary",
    },
    {
      id: "3",
      name: "Henry Mercer",
      task: "Engine Diagnostic",
      avatar: "https://i.pravatar.cc/100?img=8",
      time: "10:51",
      statusTheme: "destructive",
    },
    {
      id: "4",
      name: "Amelia Rowann",
      task: "Brake Check",
      avatar: "https://i.pravatar.cc/100?img=9",
      time: "30:42",
      statusTheme: "warning",
    },
  ];

  return (
    <section>
      <h2 className="font-display text-foreground mb-6 text-2xl font-medium tracking-tight">
        Vehicle Maintenance
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-card border-border/50 hover:border-primary/20 group flex items-center justify-between rounded-[20px] border p-3 transition-all"
          >
            <div className="flex items-center gap-3">
              <Image
                src={item.avatar}
                alt={item.name}
                width={40}
                height={40}
                className="bg-muted rounded-full object-cover"
              />
              <div>
                <h4 className="text-foreground mb-1 text-sm leading-none font-medium">
                  {item.name}
                </h4>
                <span className="text-muted-foreground text-xs">
                  {item.task}
                </span>
              </div>
            </div>
            <div
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs font-semibold",
                item.statusTheme === "warning" &&
                "bg-warning/10 text-warning border-warning/20",
                item.statusTheme === "primary" &&
                "bg-primary/10 text-primary border-primary/20",
                item.statusTheme === "destructive" &&
                "bg-destructive/10 text-destructive border-destructive/20",
              )}
            >
              {item.time}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
