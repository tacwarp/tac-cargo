import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface Exception {
  id: string;
  shipment_id: string;
  exception_type:
    | "damage"
    | "delay"
    | "missing"
    | "documentation"
    | "customs"
    | "other";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  reported_by?: string;
  assigned_to?: string;
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
}

/**
 * Fetch exceptions with filters
 */
export function useExceptions(status?: string) {
  return useQuery({
    queryKey: ["exceptions", status],
    queryFn: async () => {
      const supabase = createClient();
      let query = supabase
        .from("exceptions")
        .select(
          `
          *,
          shipment:shipments(reference, status, consignee_name)
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
    refetchInterval: 30000, // Refetch every 30s for exceptions
  });
}

/**
 * Create exception
 */
export function useCreateException() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exception: Partial<Exception>) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("exceptions")
        .insert(exception)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exceptions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

/**
 * Update exception status
 */
export function useUpdateException() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Exception>;
    }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("exceptions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exceptions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
