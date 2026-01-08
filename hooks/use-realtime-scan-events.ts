"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

type ScanEvent = Database["public"]["Tables"]["scan_events"]["Row"];

interface UseRealtimeScanEventsResult {
  scanEvents: ScanEvent[];
  isStale: boolean;
  isConnected: boolean;
}

/**
 * Real-time hook for scan_events table
 * Automatically updates when scan events are inserted
 * @param initialScanEvents - Initial scan events data from server
 * @param shipmentId - Optional filter by shipment ID
 * @returns Scan events array with real-time updates and connection status
 */
export function useRealtimeScanEvents(
  initialScanEvents: ScanEvent[],
  shipmentId?: string,
): UseRealtimeScanEventsResult {
  const [scanEvents, setScanEvents] = useState<ScanEvent[]>(initialScanEvents);
  const [isStale, setIsStale] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      const channelConfig = supabase.channel("scan-events-changes").on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "scan_events",
          ...(shipmentId && { filter: `shipment_id=eq.${shipmentId}` }),
        },
        (payload) => {
          setIsStale(false);

          if (payload.eventType === "INSERT") {
            setScanEvents((prev) => [payload.new as ScanEvent, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setScanEvents((prev) =>
              prev.map((e) =>
                e.id === payload.new.id ? (payload.new as ScanEvent) : e,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setScanEvents((prev) =>
              prev.filter((e) => e.id !== payload.old.id),
            );
          }
        },
      );

      channel = channelConfig.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Realtime connected: scan_events");
          setIsConnected(true);
          setIsStale(false);
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Realtime error: scan_events");
          setIsConnected(false);
          setIsStale(true);
        } else if (status === "CLOSED") {
          console.log("🔌 Realtime connection closed: scan_events");
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
  }, [supabase, shipmentId]);

  return { scanEvents, isStale, isConnected };
}
