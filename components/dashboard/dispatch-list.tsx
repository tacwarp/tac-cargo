"use client";

import Image from "next/image";


export function DispatchList() {
  return (
    <section>
      <h2 className="font-display text-foreground mb-6 text-2xl font-medium tracking-tight">
        Pending Dispatch
      </h2>
      <div className="flex flex-col gap-4">
        {/* Item 1 */}
        <div className="bg-card border-border/50 hover:bg-muted/50 group flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-colors">
          <div className="flex items-center gap-3">
            <Image
              src="https://i.pravatar.cc/100?img=60"
              alt="Liam"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h4 className="text-foreground text-sm font-medium">
                Liam Grayson
              </h4>
              <span className="text-muted-foreground text-xs">Route A4</span>
            </div>
          </div>
          <div className="bg-muted-foreground/30 group-hover:bg-success h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0)] transition-colors group-hover:shadow-[0_0_8px_rgba(var(--success),0.5)]"></div>
        </div>
        {/* Item 2 */}
        <div className="bg-card border-border/50 hover:bg-muted/50 group flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-colors">
          <div className="flex items-center gap-3">
            <Image
              src="https://i.pravatar.cc/100?img=32"
              alt="Mia"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h4 className="text-foreground text-sm font-medium">
                Mia Jennings
              </h4>
              <span className="text-muted-foreground text-xs">Route B2</span>
            </div>
          </div>
          <div className="bg-muted-foreground/30 group-hover:bg-warning h-2 w-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0)] transition-colors group-hover:shadow-[0_0_8px_rgba(var(--warning),0.5)]"></div>
        </div>
      </div>
    </section>
  );
}
