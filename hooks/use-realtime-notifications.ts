"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface RealtimeNotification {
  id: string;
  type: "shipment" | "alert" | "success" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  href?: string;
  data?: Record<string, unknown>;
}

interface UseRealtimeNotificationsOptions {
  onNewNotification?: (notification: RealtimeNotification) => void;
  showToast?: boolean;
}

export function useRealtimeNotifications(options: UseRealtimeNotificationsOptions = {}) {
  const { onNewNotification, showToast = true } = options;
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const addNotification = useCallback((notification: Omit<RealtimeNotification, "id" | "timestamp" | "read">) => {
    const newNotification: RealtimeNotification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]);
    onNewNotification?.(newNotification);

    if (showToast) {
      const toastFn = notification.type === "success" ? toast.success :
                      notification.type === "alert" ? toast.error :
                      toast.info;
      toastFn(notification.title, { description: notification.message });
    }

    return newNotification;
  }, [onNewNotification, showToast]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to shipment status changes
    const shipmentChannel = supabase
      .channel("shipment-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "shipments",
        },
        (payload) => {
          const newStatus = payload.new.status;
          const reference = payload.new.reference;

          if (newStatus === "delivered") {
            addNotification({
              type: "success",
              title: "Delivery Completed",
              message: `Shipment ${reference} has been delivered successfully`,
              href: `/dashboard/tracking?ref=${reference}`,
              data: payload.new,
            });
          } else if (newStatus === "failed") {
            addNotification({
              type: "alert",
              title: "Delivery Failed",
              message: `Shipment ${reference} delivery failed`,
              href: `/dashboard/exceptions`,
              data: payload.new,
            });
          } else if (newStatus === "in_transit") {
            addNotification({
              type: "info",
              title: "Shipment In Transit",
              message: `Shipment ${reference} is now in transit`,
              href: `/dashboard/tracking?ref=${reference}`,
              data: payload.new,
            });
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    // Subscribe to new shipments
    const newShipmentChannel = supabase
      .channel("new-shipments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "shipments",
        },
        (payload) => {
          addNotification({
            type: "shipment",
            title: "New Shipment Created",
            message: `Shipment ${payload.new.reference} has been created`,
            href: `/dashboard/shipments`,
            data: payload.new,
          });
        }
      )
      .subscribe();

    // Subscribe to payment updates
    const paymentChannel = supabase
      .channel("payment-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "payments",
        },
        (payload) => {
          addNotification({
            type: "success",
            title: "Payment Received",
            message: `Payment of ₹${payload.new.amount?.toLocaleString("en-IN")} received`,
            href: `/dashboard/payments`,
            data: payload.new,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(shipmentChannel);
      supabase.removeChannel(newShipmentChannel);
      supabase.removeChannel(paymentChannel);
    };
  }, [addNotification]);

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    isConnected,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
  };
}
