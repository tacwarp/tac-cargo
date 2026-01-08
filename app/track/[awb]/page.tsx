"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Plane,
  Building2,
} from "lucide-react";
import Link from "next/link";

interface TrackingEvent {
  id: string;
  scan_type: string;
  scanned_at: string;
  location: { code: string; city: string } | null;
  remarks: string | null;
}

interface ShipmentData {
  reference: string;
  status: string;
  transport_mode: string;
  weight: number;
  pieces: number;
  description: string;
  eta: string | null;
  delivered_at: string | null;
  created_at: string;
  origin: { code: string; city: string; state: string } | null;
  destination: { code: string; city: string; state: string } | null;
}

interface TrackingResponse {
  shipment: ShipmentData;
  events: TrackingEvent[];
  error?: string;
}

const statusConfig: Record<
  string,
  { label: string; color: string; icon: typeof Package }
> = {
  pending: { label: "Pending", color: "text-warning", icon: Clock },
  booked: { label: "Booked", color: "text-primary", icon: Package },
  picked_up: { label: "Picked Up", color: "text-primary", icon: Truck },
  in_transit: { label: "In Transit", color: "text-primary", icon: Plane },
  at_hub: { label: "At Hub", color: "text-primary", icon: Building2 },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "text-warning",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "text-success",
    icon: CheckCircle2,
  },
  exception: { label: "Exception", color: "text-destructive", icon: AlertCircle },
};

export default function TrackingPage() {
  const params = useParams();
  const awb = params.awb as string;
  const [data, setData] = useState<TrackingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTracking() {
      try {
        const response = await fetch(
          `/api/track?awb=${encodeURIComponent(awb)}`,
        );
        const result = await response.json();

        if (!response.ok) {
          setError(result.error || "Failed to fetch tracking information");
          return;
        }

        setData(result);
      } catch {
        setError("Failed to connect to tracking service");
      } finally {
        setLoading(false);
      }
    }

    if (awb) {
      fetchTracking();
    }
  }, [awb]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-zinc-400">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="mb-2 text-xl font-semibold text-white">
            Shipment Not Found
          </h1>
          <p className="mb-6 text-zinc-400">
            {error ||
              "Unable to find tracking information for this AWB number."}
          </p>
          <p className="mb-8 font-mono text-sm text-zinc-500">{awb}</p>
          <Link
            href="/track"
            className="inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Try another AWB
          </Link>
        </motion.div>
      </div>
    );
  }

  const { shipment, events } = data;
  const status = statusConfig[shipment.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold text-primary">
            TAC Cargo
          </Link>
          <Link
            href="/track"
            className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            New Search
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="border-b border-zinc-800 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="mb-1 text-xs tracking-wider text-zinc-500 uppercase">
                    AWB Number
                  </p>
                  <p className="font-mono text-2xl font-semibold">
                    {shipment.reference}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 ${status.color}`}
                >
                  <StatusIcon className="h-4 w-4" />
                  <span className="font-medium">{status.label}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-success/10">
                    <MapPin className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs tracking-wider text-zinc-500 uppercase">
                      Origin
                    </p>
                    <p className="font-medium">
                      {shipment.origin?.city || "N/A"}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {shipment.origin?.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs tracking-wider text-zinc-500 uppercase">
                      Destination
                    </p>
                    <p className="font-medium">
                      {shipment.destination?.city || "N/A"}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {shipment.destination?.state}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-zinc-800/50 p-4">
                  <p className="mb-1 text-xs tracking-wider text-zinc-500 uppercase">
                    Weight
                  </p>
                  <p className="text-lg font-semibold">{shipment.weight} kg</p>
                </div>
                <div className="rounded-xl bg-zinc-800/50 p-4">
                  <p className="mb-1 text-xs tracking-wider text-zinc-500 uppercase">
                    Pieces
                  </p>
                  <p className="text-lg font-semibold">{shipment.pieces}</p>
                </div>
                <div className="col-span-2 rounded-xl bg-zinc-800/50 p-4">
                  <p className="mb-1 text-xs tracking-wider text-zinc-500 uppercase">
                    Mode
                  </p>
                  <p className="text-lg font-semibold capitalize">
                    {shipment.transport_mode}
                  </p>
                </div>
              </div>
            </div>

            {shipment.eta && shipment.status !== "delivered" && (
              <div className="px-6 pb-6">
                <div className="flex items-center gap-3 rounded-xl bg-primary/10 p-4">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-zinc-400">Estimated Delivery</p>
                    <p className="font-medium text-primary">
                      {new Date(shipment.eta).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {shipment.delivered_at && (
              <div className="px-6 pb-6">
                <div className="flex items-center gap-3 rounded-xl bg-success/10 p-4">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm text-zinc-400">Delivered On</p>
                    <p className="font-medium text-success">
                      {new Date(shipment.delivered_at).toLocaleDateString(
                        "en-IN",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="mb-6 text-lg font-semibold">Tracking History</h2>

            {events.length === 0 ? (
              <p className="py-8 text-center text-zinc-400">
                No tracking events yet
              </p>
            ) : (
              <div className="space-y-0">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pb-8 pl-8 last:pb-0"
                  >
                    <div className="absolute top-0 left-0 h-4 w-4 rounded-full border-4 border-background bg-primary" />
                    {index !== events.length - 1 && (
                      <div className="absolute top-4 left-[7px] h-full w-0.5 bg-zinc-700" />
                    )}
                    <div>
                      <p className="font-medium capitalize">
                        {event.scan_type?.replace(/_/g, " ") || "Update"}
                      </p>
                      {event.location && (
                        <p className="text-sm text-zinc-400">
                          {event.location.city}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-zinc-500">
                        {new Date(event.scanned_at).toLocaleString("en-IN")}
                      </p>
                      {event.remarks && (
                        <p className="mt-2 text-sm text-zinc-400">
                          {event.remarks}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <footer className="mt-16 border-t border-zinc-800">
        <div className="mx-auto max-w-4xl px-4 py-8 text-center text-sm text-zinc-500">
          <p>© {new Date().getFullYear()} TAC Cargo. All rights reserved.</p>
          <p className="mt-1">Imphal-Delhi Logistics Corridor</p>
        </div>
      </footer>
    </div>
  );
}
