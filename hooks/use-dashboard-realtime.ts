"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useDashboardStore } from "@/lib/stores/dashboard-store";

export function useDashboardRealtime() {
  const {
    setConnected,
    updateKPI,
    addActivity,
    activeShipmentsCount,
    deliveredTodayCount,
  } = useDashboardStore();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shipments",
        },
        (payload) => {
          // Handle specific events
          if (payload.eventType === "INSERT") {
            // New shipment created
            const newCount = (activeShipmentsCount || 0) + 1;
            updateKPI("active", newCount);

            addActivity({
              id: Date.now().toString(),
              type: "shipment",
              message: `New shipment created: ${payload.new.reference || "REF-###"}`,
              timestamp: new Date().toISOString(),
            });
          } else if (payload.eventType === "UPDATE") {
            // Status changed to delivered
            if (
              payload.new.status === "delivered" &&
              payload.old.status !== "delivered"
            ) {
              const newDelivered = (deliveredTodayCount || 0) + 1;
              const newActive = Math.max(0, (activeShipmentsCount || 1) - 1);

              updateKPI("delivered", newDelivered);
              updateKPI("active", newActive);

              addActivity({
                id: Date.now().toString(),
                type: "shipment",
                message: `Shipment delivered: ${payload.new.reference || "REF-###"}`,
                timestamp: new Date().toISOString(),
              });
            }
          }
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setConnected(true);
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          setConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    activeShipmentsCount,
    deliveredTodayCount,
    setConnected,
    updateKPI,
    addActivity,
  ]);
}
