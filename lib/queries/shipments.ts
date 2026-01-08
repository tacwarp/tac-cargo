import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Shipment = Database["public"]["Tables"]["shipments"]["Row"];
type NewShipment = Database["public"]["Tables"]["shipments"]["Insert"];

interface ShipmentFilters {
  status?: string;
  search?: string;
}

/**
 * Fetch shipments with optional filters
 */
export function useShipments(filters?: ShipmentFilters) {
  return useQuery({
    queryKey: ["shipments", filters],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from("shipments")
        .select("*, customers(*)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      if (filters?.search) {
        query = query.ilike("reference", `%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
    },
  });
}

/**
 * Fetch single shipment by ID
 */
export function useShipment(id: string) {
  return useQuery({
    queryKey: ["shipment", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("shipments")
        .select(
          `
          *,
          customer:customers(*),
          invoice:invoices(*),
          current_manifest:manifests(*),
          scan_events(
            *,
            warehouse:warehouses(*)
          )
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw error;

      return data;
    },
  });
}

/**
 * Create new shipment
 */
export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shipment: Partial<NewShipment>) => {
      const supabase = createClient();

      // Map form data to database schema with defaults
      const shipmentData = {
        ...shipment,
        weight: shipment.weight || 0,
        status: "pending" as const,
      };

      const { data, error } = await supabase
        .from("shipments")
        .insert(shipmentData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}

/**
 * Update existing shipment
 */
export function useUpdateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Shipment>;
    }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("shipments")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
      queryClient.invalidateQueries({ queryKey: ["shipment", data.id] });
    },
  });
}

/**
 * Delete shipment
 */
export function useDeleteShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase.from("shipments").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipments"] });
    },
  });
}
