import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";

type Customer = Database["public"]["Tables"]["customers"]["Row"];
type NewCustomer = Database["public"]["Tables"]["customers"]["Insert"];

/**
 * Fetch all customers
 */
export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });
}

/**
 * Fetch single customer
 */
export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("customers")
        .select(
          `
          *,
          shipments(count),
          invoices(count)
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
 * Create customer
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customer: NewCustomer) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("customers")
        .insert(customer)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}

/**
 * Update customer
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Customer>;
    }) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("customers")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", data.id] });
    },
  });
}
