import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

/**
 * Dashboard KPIs and metrics
 */
export function useDashboardKPIs() {
  return useQuery({
    queryKey: ["dashboard", "kpis"],
    queryFn: async () => {
      const supabase = createClient();

      // Get shipment counts by status
      const { data: statusCounts } = await supabase
        .from("shipments")
        .select("status");

      const statusSummary = statusCounts?.reduce(
        (acc: Record<string, number>, { status }) => {
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        },
        {},
      );

      // Get at-risk SLA count
      const { count: atRiskCount } = await supabase
        .from("shipments")
        .select("*", { count: "exact", head: true })
        .eq("sla_status", "at_risk")
        .neq("status", "delivered");

      // Get today's shipments
      const today = new Date().toISOString().split("T")[0];
      const { count: todayCount } = await supabase
        .from("shipments")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${today}T00:00:00`);

      // Get active shipments (in transit)
      const { count: activeCount } = await supabase
        .from("shipments")
        .select("*", { count: "exact", head: true })
        .in("status", [
          "pending",
          "picked_up",
          "in_transit",
          "out_for_delivery",
        ]);

      // Get delivered today
      const { count: deliveredToday } = await supabase
        .from("shipments")
        .select("*", { count: "exact", head: true })
        .eq("status", "delivered")
        .gte("delivered_at", `${today}T00:00:00`);

      return {
        statusSummary,
        atRiskCount: atRiskCount || 0,
        todayCount: todayCount || 0,
        activeCount: activeCount || 0,
        deliveredToday: deliveredToday || 0,
      };
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

/**
 * Recent shipments for dashboard
 */
export function useRecentShipments(limit = 10) {
  return useQuery({
    queryKey: ["dashboard", "recent-shipments", limit],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("shipments")
        .select("*, customers(*)")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
  });
}

/**
 * Shipment trends (last 7 days)
 */
export function useShipmentTrends() {
  return useQuery({
    queryKey: ["dashboard", "trends"],
    queryFn: async () => {
      const supabase = createClient();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from("shipments")
        .select("created_at, status")
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Group by date
      const trendsByDate = data?.reduce(
        (
          acc: Record<
            string,
            { date: string; total: number; delivered: number; pending: number }
          >,
          shipment,
        ) => {
          const date = new Date(shipment.created_at)
            .toISOString()
            .split("T")[0];
          if (!acc[date]) {
            acc[date] = { date, total: 0, delivered: 0, pending: 0 };
          }
          acc[date].total++;
          if (shipment.status === "delivered") acc[date].delivered++;
          if (shipment.status === "pending") acc[date].pending++;
          return acc;
        },
        {},
      );

      return Object.values(trendsByDate || {});
    },
  });
}

/**
 * Exception alerts
 */
export function useExceptionAlerts() {
  return useQuery({
    queryKey: ["dashboard", "exceptions"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("exceptions")
        .select("*, shipments(reference)")
        .eq("status", "open")
        .order("severity", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refetch every minute
  });
}
