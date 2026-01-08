"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { customerSchema, type CustomerFormData } from "@/lib/schemas/shipment";
import { type ActionResult, success, error } from "@/types/action-result";
import type { Customer } from "@/types/database";

/**
 * Create a new customer
 */
export async function createCustomer(
  formData: CustomerFormData
): Promise<ActionResult<Customer>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Validate input
    const parsed = customerSchema.safeParse(formData);
    if (!parsed.success) {
      return error(parsed.error.issues[0].message, "VALIDATION_ERROR");
    }

    // Get user profile for organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    const { data, error: dbError } = await supabase
      .from("customers")
      .insert({
        name: parsed.data.name,
        email: parsed.data.contact_email,
        phone: parsed.data.contact_phone,
        address: parsed.data.billing_address,
        city: parsed.data.city,
        state: parsed.data.state,
        pincode: parsed.data.pincode,
        gst_number: parsed.data.gst_number || null,
        credit_limit: parsed.data.credit_limit || 0,
        customer_type: "regular",
        created_by: user.id,
        organization_id: profile?.organization_id,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Create customer error:", dbError);
      if (dbError.code === "23505") {
        return error("Customer with this phone already exists", "CONFLICT");
      }
      return error("Failed to create customer", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/customers");
    return success(data as Customer, "Customer created successfully");
  } catch (err) {
    console.error("Create customer error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Update customer
 */
export async function updateCustomer(
  customerId: string,
  formData: Partial<CustomerFormData>
): Promise<ActionResult<Customer>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (formData.name) updateData.name = formData.name;
    if (formData.contact_email) updateData.email = formData.contact_email;
    if (formData.contact_phone) updateData.phone = formData.contact_phone;
    if (formData.billing_address) updateData.address = formData.billing_address;
    if (formData.city) updateData.city = formData.city;
    if (formData.state) updateData.state = formData.state;
    if (formData.pincode) updateData.pincode = formData.pincode;
    if (formData.gst_number !== undefined)
      updateData.gst_number = formData.gst_number || null;
    if (formData.credit_limit !== undefined)
      updateData.credit_limit = formData.credit_limit;

    const { data, error: dbError } = await supabase
      .from("customers")
      .update(updateData)
      .eq("id", customerId)
      .select()
      .single();

    if (dbError) {
      console.error("Update customer error:", dbError);
      return error("Failed to update customer", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/customers");
    revalidatePath(`/dashboard/customers/${customerId}`);
    return success(data as Customer, "Customer updated");
  } catch (err) {
    console.error("Update customer error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get customer by ID
 */
export async function getCustomer(
  customerId: string
): Promise<ActionResult<Customer & { shipments: unknown[] }>> {
  try {
    const supabase = await createClient();

    const { data, error: dbError } = await supabase
      .from("customers")
      .select(
        `
        *,
        shipments(
          id,
          reference,
          status,
          consignee_city,
          created_at
        )
      `
      )
      .eq("id", customerId)
      .single();

    if (dbError || !data) {
      return error("Customer not found", "NOT_FOUND");
    }

    return success(data as Customer & { shipments: unknown[] });
  } catch (err) {
    console.error("Get customer error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Search customers
 */
export async function searchCustomers(
  query: string,
  options?: { limit?: number }
): Promise<ActionResult<Customer[]>> {
  try {
    const supabase = await createClient();

    let queryBuilder = supabase
      .from("customers")
      .select("*")
      .order("name", { ascending: true })
      .limit(options?.limit || 50);

    if (query) {
      queryBuilder = queryBuilder.or(
        `name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`
      );
    }

    const { data, error: dbError } = await queryBuilder;

    if (dbError) {
      return error("Search failed", "DATABASE_ERROR");
    }

    return success((data || []) as Customer[]);
  } catch (err) {
    console.error("Search customers error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * List all customers
 */
export async function listCustomers(options?: {
  type?: "regular" | "corporate" | "vip";
  limit?: number;
}): Promise<ActionResult<Customer[]>> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("customers")
      .select("*")
      .order("name", { ascending: true })
      .limit(options?.limit || 100);

    if (options?.type) {
      query = query.eq("customer_type", options.type);
    }

    const { data, error: dbError } = await query;

    if (dbError) {
      return error("Failed to list customers", "DATABASE_ERROR");
    }

    return success((data || []) as Customer[]);
  } catch (err) {
    console.error("List customers error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get customer shipment history
 */
export async function getCustomerShipments(
  customerId: string,
  options?: { limit?: number }
): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createClient();

    const { data, error: dbError } = await supabase
      .from("shipments")
      .select(
        `
        id,
        reference,
        status,
        consignee_name,
        consignee_city,
        pieces,
        weight_kg,
        created_at,
        origin_warehouse:warehouses!origin_warehouse_id(name),
        destination_warehouse:warehouses!destination_warehouse_id(name)
      `
      )
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })
      .limit(options?.limit || 50);

    if (dbError) {
      return error("Failed to fetch shipments", "DATABASE_ERROR");
    }

    return success(data || []);
  } catch (err) {
    console.error("Get customer shipments error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get customer invoice history
 */
export async function getCustomerInvoices(
  customerId: string,
  options?: { limit?: number }
): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createClient();

    const { data, error: dbError } = await supabase
      .from("invoices")
      .select(
        `
        id,
        invoice_no,
        type,
        status,
        total_amount,
        balance_due,
        invoice_date,
        due_date,
        sent_via_whatsapp_at
      `
      )
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false })
      .limit(options?.limit || 50);

    if (dbError) {
      return error("Failed to fetch invoices", "DATABASE_ERROR");
    }

    return success(data || []);
  } catch (err) {
    console.error("Get customer invoices error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
