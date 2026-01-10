import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type NewManifest = Database["public"]["Tables"]["manifests"]["Insert"];

/**
 * Fetch manifests with optional filters
 */
export function useManifests(status?: string) {
  return useQuery({
    queryKey: ["manifests", status],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from("manifests")
        .select(
          `
          *,
          origin_warehouse:warehouses!manifests_origin_warehouse_id_fkey(code, name, city),
          destination_warehouse:warehouses!manifests_destination_warehouse_id_fkey(code, name, city),
          manifest_items(count)
        `,
        )
        .order("created_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

/**
 * Fetch single manifest by ID
 */
export function useManifest(id: string) {
  return useQuery({
    queryKey: ["manifest", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("manifests")
        .select(
          `
          *,
          origin_warehouse:warehouses!manifests_origin_warehouse_id_fkey(*),
          destination_warehouse:warehouses!manifests_destination_warehouse_id_fkey(*),
          manifest_items(
            *,
            shipment:shipments(*)
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
 * Create new manifest
 */
export function useCreateManifest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (manifest: NewManifest) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("manifests")
        .insert(manifest)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manifests"] });
    },
  });
}

/**
 * Add shipment to manifest
 */
export function useAddShipmentToManifest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      manifestId,
      shipmentId,
    }: {
      manifestId: string;
      shipmentId: string;
    }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("manifest_items")
        .insert({
          manifest_id: manifestId,
          shipment_id: shipmentId,
          scanned_at_origin: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, { manifestId }) => {
      queryClient.invalidateQueries({ queryKey: ["manifest", manifestId] });
      queryClient.invalidateQueries({ queryKey: ["manifests"] });
    },
  });
}

/**
 * Seal manifest (change status to sealed)
 */
export function useSealManifest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (manifestId: string) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("manifests")
        .update({
          status: "sealed",
          actual_departure: new Date().toISOString(),
        })
        .eq("id", manifestId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["manifest", data.id] });
      queryClient.invalidateQueries({ queryKey: ["manifests"] });
    },
  });
}
