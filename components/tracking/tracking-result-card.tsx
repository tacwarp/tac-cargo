import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrackingTimeline } from "./tracking-timeline";
import { TrackingPayload } from "@/types/tracking";
import { Plane, Truck, Package, Clock, Calendar } from "lucide-react";

export function TrackingResultCard({ data }: { data: TrackingPayload }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-success text-success-foreground hover:bg-success/90";
      case "IN_TRANSIT":
        return "bg-warning text-warning-foreground hover:bg-warning/90";
      case "DELAYED":
        return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
      case "BOOKED":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Card className="border-border/50 bg-card/40 shadow-elevation-1 overflow-hidden backdrop-blur-md">
        <CardHeader className="pb-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="font-mono text-2xl tracking-tight">
                {data.trackingId}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-2">
                <span className="text-foreground font-medium">
                  {data.origin}
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="text-foreground font-medium">
                  {data.destination}
                </span>
              </CardDescription>
            </div>
            <Badge
              className={`rounded-full px-4 py-1.5 text-sm font-medium shadow-sm ${getStatusColor(data.status)}`}
            >
              {data.status.replaceAll("_", " ")}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Separator className="bg-border/50" />

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Mode
              </p>
              <div className="flex items-center gap-2 font-medium">
                {data.mode === "AIR" ? (
                  <Plane className="h-4 w-4" />
                ) : (
                  <Truck className="h-4 w-4" />
                )}
                {data.mode}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Weight / Pcs
              </p>
              <div className="flex items-center gap-2 font-medium">
                <Package className="h-4 w-4" />
                {data.weightKg}kg / {data.pieces}
              </div>
            </div>
            <div className="col-span-2 space-y-1">
              <p className="text-muted-foreground text-xs tracking-wider uppercase">
                Estimated Arrival
              </p>
              <div className="text-primary flex items-center gap-2 font-medium">
                <Calendar className="h-4 w-4" />
                {new Date(data.eta).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
                <span className="text-muted-foreground text-xs">•</span>
                {new Date(data.eta).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          <div className="bg-muted/30 border-border/50 flex flex-col items-center justify-between gap-4 rounded-xl border p-4 sm:flex-row">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-muted-foreground text-xs">
                  {new Date(data.lastUpdated).toLocaleString()}
                </p>
              </div>
            </div>
            {/* Visual Progress Bar could go here */}
          </div>

          <TrackingTimeline events={data.events} />
        </CardContent>
      </Card>
    </div>
  );
}
