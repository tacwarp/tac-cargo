"use client";

import {
  Truck,
  Star,
  Phone,
  MessageSquare,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function DriverProfileCard() {
  return (
    <Card className="border-border/50 bg-card relative overflow-hidden p-6 shadow-sm">
      <div className="pointer-events-none absolute top-0 right-0 p-3 opacity-5">
        <Truck className="text-foreground size-24" />
      </div>

      <h3 className="text-foreground relative z-10 mb-6 text-sm font-semibold">
        Carrier Details
      </h3>

      <div className="relative z-10 mb-6 flex items-center gap-4">
        <div className="relative">
          <Image
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            alt="Driver"
            width={64}
            height={64}
            className="ring-muted rounded-full object-cover shadow-sm ring-4"
          />
          <div className="bg-card absolute right-0 bottom-0 rounded-full p-0.5">
            <div className="border-card size-3.5 rounded-full border-2 bg-success"></div>
          </div>
        </div>
        <div>
          <h4 className="text-foreground text-base font-bold">Rajesh Kumar</h4>
          <p className="text-muted-foreground text-xs font-medium">
            Tata Prima 5530
          </p>
          <div className="mt-1 flex items-center gap-1 text-xs font-medium text-warning">
            <Star className="size-3 fill-current" />
            4.9{" "}
            <span className="text-muted-foreground font-normal">
              (128 trips)
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="hover:bg-muted/50 hover:text-foreground h-10 w-full gap-2 text-xs font-semibold"
        >
          <Phone className="size-3.5" /> Call Driver
        </Button>
        <Button className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 hover:border-primary/30 h-10 w-full gap-2 border text-xs font-semibold shadow-none">
          <MessageSquare className="size-3.5" /> Message
        </Button>
      </div>
    </Card>
  );
}
