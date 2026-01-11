"use client";

import { useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type TableName = "shipments" | "invoices" | "manifests" | "scan_events" | "tracking_events" | "notifications";

type PostgresChangesChannel = {
  on(
    event: "postgres_changes",
    config: {
      event: "INSERT" | "UPDATE" | "DELETE" | "*";
      schema: string;
      table: string;
      filter?: string;
    },
    callback: (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void
  ): PostgresChangesChannel;
  subscribe(callback: (status: string) => void): RealtimeChannel;
};

interface UseRealtimeOptions<T extends Record<string, unknown>> {
  table: TableName;
  schema?: string;
  filter?: string;
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: { old: T; new: T }) => void;
  onDelete?: (payload: T) => void;
  onChange?: (payload: RealtimePostgresChangesPayload<T>) => void;
  enabled?: boolean;
}

/**
 * Hook for subscribing to Supabase Realtime changes
 * Provides live updates for dashboard components
 */
export function useRealtimeSubscription<T extends Record<string, unknown>>({
  table,
  schema = "public",
  filter,
  event = "*",
  onInsert,
  onUpdate,
  onDelete,
  onChange,
  enabled = true,
}: UseRealtimeOptions<T>) {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = createClient();

  const handleChange = useCallback(
    (payload: RealtimePostgresChangesPayload<T>) => {
      onChange?.(payload);

      switch (payload.eventType) {
        case "INSERT":
          onInsert?.(payload.new as T);
          break;
        case "UPDATE":
          onUpdate?.({ old: payload.old as T, new: payload.new as T });
          break;
        case "DELETE":
          onDelete?.(payload.old as T);
          break;
      }
    },
    [onChange, onInsert, onUpdate, onDelete]
  );

  useEffect(() => {
    if (!enabled) return;

    const channelName = `${table}-${filter || "all"}-${Date.now()}`;

    const channelConfig: {
      event: "INSERT" | "UPDATE" | "DELETE" | "*";
      schema: string;
      table: string;
      filter?: string;
    } = {
      event,
      schema,
      table,
    };

    if (filter) {
      channelConfig.filter = filter;
    }

    const channel = supabase.channel(channelName) as unknown as PostgresChangesChannel;

    channelRef.current = channel
      .on(
        "postgres_changes",
        channelConfig,
        handleChange as (payload: RealtimePostgresChangesPayload<Record<string, unknown>>) => void
      )
      .subscribe((status: string) => {
        if (status === "SUBSCRIBED") {
          console.log(`Realtime: Subscribed to ${table}`);
        }
        if (status === "CHANNEL_ERROR") {
          console.error(`Realtime: Error subscribing to ${table}`);
        }
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [supabase, table, schema, filter, event, enabled, handleChange]);

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, [supabase]);

  return { unsubscribe };
}

/**
 * Hook for subscribing to shipment updates
 */
export function useShipmentRealtime(options: {
  shipmentId?: string;
  onUpdate?: (shipment: Record<string, unknown>) => void;
  enabled?: boolean;
}) {
  return useRealtimeSubscription({
    table: "shipments",
    filter: options.shipmentId ? `id=eq.${options.shipmentId}` : undefined,
    event: "*",
    onUpdate: (payload) => options.onUpdate?.(payload.new),
    onInsert: options.onUpdate,
    enabled: options.enabled,
  });
}

/**
 * Hook for subscribing to tracking events (for live tracking page)
 */
export function useTrackingRealtime(options: {
  shipmentId: string;
  onNewEvent?: (event: Record<string, unknown>) => void;
  enabled?: boolean;
}) {
  return useRealtimeSubscription({
    table: "tracking_events",
    filter: `shipment_id=eq.${options.shipmentId}`,
    event: "INSERT",
    onInsert: options.onNewEvent,
    enabled: options.enabled,
  });
}

/**
 * Hook for subscribing to scan events (for scanning page)
 */
export function useScanRealtime(options: {
  warehouseId?: string;
  onNewScan?: (scan: Record<string, unknown>) => void;
  enabled?: boolean;
}) {
  return useRealtimeSubscription({
    table: "scan_events",
    filter: options.warehouseId ? `warehouse_id=eq.${options.warehouseId}` : undefined,
    event: "INSERT",
    onInsert: options.onNewScan,
    enabled: options.enabled,
  });
}

/**
 * Hook for subscribing to user notifications
 */
export function useNotificationRealtime(options: {
  userId: string;
  onNewNotification?: (notification: Record<string, unknown>) => void;
  enabled?: boolean;
}) {
  return useRealtimeSubscription({
    table: "notifications",
    filter: `user_id=eq.${options.userId}`,
    event: "INSERT",
    onInsert: options.onNewNotification,
    enabled: options.enabled,
  });
}

export default useRealtimeSubscription;
