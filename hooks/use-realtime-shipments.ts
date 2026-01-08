"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type Shipment = Database["public"]["Tables"]["shipments"]["Row"];

interface UseRealtimeShipmentsResult {
  shipments: Shipment[];
  isStale: boolean;
  isConnected: boolean;
}

/**
 * Real-time hook for shipments table
 * Automatically updates when shipments are inserted, updated, or deleted
 * @param initialShipments - Initial shipments data from server
 * @returns Shipments array with real-time updates and connection status
 */
export function useRealtimeShipments(
  initialShipments: Shipment[],
): UseRealtimeShipmentsResult {
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [isStale, setIsStale] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      channel = supabase
        .channel("shipments-changes")
        .on(
          "postgres_changes",
          {
            event: "*", // INSERT, UPDATE, DELETE
            schema: "public",
            table: "shipments",
          },
          (payload) => {
            setIsStale(false);

            if (payload.eventType === "INSERT") {
              setShipments((prev) => [payload.new as Shipment, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setShipments((prev) =>
                prev.map((s) =>
                  s.id === payload.new.id ? (payload.new as Shipment) : s,
                ),
              );
            } else if (payload.eventType === "DELETE") {
              setShipments((prev) =>
                prev.filter((s) => s.id !== payload.old.id),
              );
            }
          },
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            console.log("✅ Realtime connected: shipments");
            setIsConnected(true);
            setIsStale(false);
          } else if (status === "CHANNEL_ERROR") {
            console.error("❌ Realtime error: shipments");
            setIsConnected(false);
            setIsStale(true);
          } else if (status === "CLOSED") {
            console.log("🔌 Realtime connection closed: shipments");
            setIsConnected(false);
          }
        });
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [supabase]);

  return { shipments, isStale, isConnected };
}
