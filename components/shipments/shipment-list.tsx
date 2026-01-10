"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Copy,
  User,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type ShipmentStatus = "In Transit" | "Delayed" | "Processing" | "Delivered";

interface Shipment {
  id: string;
  origin: string;
  destination: string;
  customer: string;
  customerInit: string;
  customerColor: "indigo" | "orange" | "teal" | "pink";
  type: string;
  weight: string;
  status: ShipmentStatus;
  driver: string;
  driverAvatar: string;
  eta: string;
  timeInfo: string;
  isDelay?: boolean;
}

const shipments: Shipment[] = [
  {
    id: "#SHP-2984",
    origin: "JFK",
    destination: "LHR",
    customer: "Acme Corp Ltd.",
    customerInit: "A",
    customerColor: "indigo",
    type: "Electronics",
    weight: "420kg",
    status: "In Transit",
    driver: "M. Alverez",
    driverAvatar: "https://i.pravatar.cc/100?img=12",
    eta: "2h 15m",
    timeInfo: "Nov 12, 4:30 PM",
  },
  {
    id: "#SHP-3001",
    origin: "MIA",
    destination: "ATL",
    customer: "Global Tech Inc.",
    customerInit: "G",
    customerColor: "orange",
    type: "Fragile",
    weight: "120kg",
    status: "Delayed",
    driver: "J. Smith",
    driverAvatar: "https://i.pravatar.cc/100?img=33",
    eta: "+4h Delay",
    timeInfo: "Original: 2:00 PM",
    isDelay: true,
  },
  {
    id: "#SHP-3022",
    origin: "LAX",
    destination: "SEA",
    customer: "Pacific Retailers",
    customerInit: "P",
    customerColor: "teal",
    type: "General",
    weight: "850kg",
    status: "Processing",
    driver: "Unassigned",
    driverAvatar: "",
    eta: "Est. Tomorrow",
    timeInfo: "Pickup: 8:00 AM",
  },
  {
    id: "#SHP-2890",
    origin: "HOU",
    destination: "DAL",
    customer: "Omega Systems",
    customerInit: "O",
    customerColor: "pink",
    type: "Hardware",
    weight: "1,200kg",
    status: "Delivered",
    driver: "R. Davidson",
    driverAvatar: "https://i.pravatar.cc/100?img=59",
    eta: "10:45 AM",
    timeInfo: "Signed by: Gate 4",
  },
];

export function ShipmentList() {
  return (
    <div className="space-y-4">
      <Table className="border-separate border-spacing-y-2">
        <TableHeader className="bg-transparent">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-[50px]">
              <input
                type="checkbox"
                className="text-primary focus:ring-primary/20 rounded border-border bg-card"
              />
            </TableHead>
            <TableHead>ID & Progress</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead className="text-right">ETA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow
              key={shipment.id}
              className="bg-card/40 hover:bg-card/60 border-border/50 border shadow-sm backdrop-blur-md transition-all group hover:shadow-md cursor-pointer rounded-xl [&>td:first-child]:rounded-l-xl [&>td:last-child]:rounded-r-xl"
            >
              <TableCell className="py-4">
                <input
                  type="checkbox"
                  className="text-primary focus:ring-primary/20 rounded border-border bg-card"
                />
              </TableCell>

              <TableCell className="py-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {shipment.id}
                    </span>
                    <Copy
                      className="h-3.5 w-3.5 text-muted-foreground cursor-pointer transition-colors hover:text-foreground"
                    />
                  </div>
                  {/* Progress Bar Micro-viz */}
                  <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-foreground/60">{shipment.origin}</span>
                    <div className="relative h-[2px] min-w-[30px] flex-1 rounded-full bg-muted">
                      <div
                        className={cn(
                          "absolute top-0 bottom-0 left-0 rounded-full",
                          shipment.status === "In Transit"
                            ? "bg-primary w-1/2 animate-pulse"
                            : shipment.status === "Delivered"
                              ? "w-full bg-success"
                              : "w-0",
                        )}
                      />
                    </div>
                    <span className="font-bold text-foreground/60">
                      {shipment.destination}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg border font-mono text-xs font-bold shadow-sm",
                      shipment.customerColor === "indigo" &&
                      "bg-primary/10 border-primary/20 text-primary",
                      shipment.customerColor === "orange" &&
                      "bg-accent/10 border-accent/20 text-accent-foreground",
                      shipment.customerColor === "teal" &&
                      "border-success/30 bg-success/10 text-success",
                      shipment.customerColor === "pink" &&
                      "bg-destructive/10 border-destructive/20 text-destructive",
                    )}
                  >
                    {shipment.customerInit}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">
                      {shipment.customer}
                    </div>
                    <div className="text-muted-foreground text-[10px] tracking-wide uppercase">
                      {shipment.type} • {shipment.weight}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4">
                <Badge
                  variant={
                    shipment.status === "Delayed" ? "destructive" :
                      shipment.status === "Delivered" ? "outline" : "default"
                  }
                  className={cn(
                    shipment.status === "Delivered" && "border-success/50 text-success hover:bg-success/10",
                    shipment.status === "Delayed" && "bg-destructive/10 text-destructive hover:bg-destructive/20"
                  )}
                >
                  {shipment.status}
                </Badge>
              </TableCell>

              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  {shipment.driverAvatar ? (
                    <Image
                      src={shipment.driverAvatar}
                      width={24}
                      height={24}
                      className="rounded-full border border-border shadow-sm"
                      alt=""
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-muted/20">
                      <User className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}
                  <span
                    className={cn(
                      "text-xs font-medium",
                      shipment.driver === "Unassigned"
                        ? "text-muted-foreground italic"
                        : "text-foreground",
                    )}
                  >
                    {shipment.driver}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-right py-4">
                <div
                  className={cn(
                    "font-mono text-xs font-bold",
                    shipment.isDelay ? "text-destructive" : "text-foreground",
                  )}
                >
                  {shipment.eta}
                </div>
                <div className="text-muted-foreground text-[10px] font-medium uppercase">
                  {shipment.timeInfo}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

