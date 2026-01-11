"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";
import type { CustomerType } from "@/types/database";

/**
 * Create a new customer
 */
export async function createCustomer(data: {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gst_number?: string;
  customer_type?: CustomerType;
  credit_limit?: number;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    const { data: customer, error: insertError } = await supabase
      .from("customers")
      .insert({
        ...data,
        customer_type: data.customer_type || "regular",
        credit_limit: data.credit_limit || 0,
        created_by: user.id,
        organization_id: profile?.organization_id,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Create customer error:", insertError);
      return error("Failed to create customer", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/customers");

    return success({ id: customer.id }, "Customer created successfully");
  } catch (err) {
    console.error("Create customer error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Update customer details
 */
export async function updateCustomer(
  customerId: string,
  data: {
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    gst_number?: string;
    customer_type?: CustomerType;
    credit_limit?: number;
  }
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const updateData: Record<string, unknown> = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === "") {
        updateData[key] = null;
      }
    });

    const { error: updateError } = await supabase
      .from("customers")
      .update(updateData)
      .eq("id", customerId);

    if (updateError) {
      console.error("Update customer error:", updateError);
      return error("Failed to update customer", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/customers");
    revalidatePath(`/dashboard/customers/${customerId}`);

    return success(undefined, "Customer updated successfully");
  } catch (err) {
    console.error("Update customer error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Delete customer
 */
export async function deleteCustomer(customerId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Unlink shipments and invoices
    await supabase
      .from("shipments")
      .update({ customer_id: null })
      .eq("customer_id", customerId);

    await supabase
      .from("invoices")
      .update({ customer_id: null })
      .eq("customer_id", customerId);

    const { error: deleteError } = await supabase
      .from("customers")
      .delete()
      .eq("id", customerId);

    if (deleteError) {
      console.error("Delete customer error:", deleteError);
      return error("Failed to delete customer", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/customers");

    return success(undefined, "Customer deleted successfully");
  } catch (err) {
    console.error("Delete customer error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get customer by ID
 */
export async function getCustomerById(customerId: string): Promise<ActionResult<Record<string, unknown>>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const { data: customer, error: fetchError } = await supabase
      .from("customers")
      .select(`
        *,
        shipments(id, reference, status, created_at),
        invoices(id, invoice_no, status, total_amount, created_at)
      `)
      .eq("id", customerId)
      .single();

    if (fetchError || !customer) {
      return error("Customer not found", "NOT_FOUND");
    }

    return success(customer);
  } catch (err) {
    console.error("Get customer error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * List customers with filters
 */
export async function listCustomers(options?: {
  search?: string;
  type?: CustomerType;
  page?: number;
  limit?: number;
}): Promise<ActionResult<{ data: Record<string, unknown>[]; count: number }>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("customers")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (options?.type) {
      query = query.eq("customer_type", options.type);
    }

    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,phone.ilike.%${options.search}%,email.ilike.%${options.search}%`);
    }

    const { data: customers, error: fetchError, count } = await query;

    if (fetchError) {
      console.error("List customers error:", fetchError);
      return error("Failed to fetch customers", "DATABASE_ERROR");
    }

    return success({ data: customers || [], count: count || 0 });
  } catch (err) {
    console.error("List customers error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
