"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";

/**
 * Cancel an invoice (soft delete)
 */
export async function cancelInvoice(invoiceId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);

    if (updateError) {
      console.error("Cancel invoice error:", updateError);
      return error("Failed to cancel invoice", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);

    return success(undefined, "Invoice cancelled successfully");
  } catch (err) {
    console.error("Cancel invoice error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(
  invoiceId: string,
  status: "draft" | "pending" | "paid" | "partial" | "overdue" | "cancelled"
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    // If marking as paid, clear balance due
    if (status === "paid") {
      updateData.balance_due = 0;
    }

    const { error: updateError } = await supabase
      .from("invoices")
      .update(updateData)
      .eq("id", invoiceId);

    if (updateError) {
      console.error("Update invoice status error:", updateError);
      return error("Failed to update invoice status", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);

    return success(undefined, "Invoice status updated");
  } catch (err) {
    console.error("Update invoice status error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get invoice by ID
 */
export async function getInvoiceById(invoiceId: string): Promise<ActionResult<Record<string, unknown>>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select(`
        *,
        customers(id, name, phone, email, address, city, state, pincode, gst_number),
        shipments:shipment_id(id, reference, status, pieces, weight_kg),
        invoice_items(*)
      `)
      .eq("id", invoiceId)
      .single();

    if (fetchError || !invoice) {
      return error("Invoice not found", "NOT_FOUND");
    }

    return success(invoice);
  } catch (err) {
    console.error("Get invoice error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Update invoice details
 */
export async function updateInvoice(
  invoiceId: string,
  data: {
    consignee_name?: string;
    consignee_phone?: string;
    consignee_email?: string;
    consignee_address?: string;
    consignee_city?: string;
    consignee_state?: string;
    consignee_pincode?: string;
    payment_mode?: string;
    status?: string;
    notes?: string;
    special_instructions?: string;
    due_date?: string;
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

    // Remove empty strings
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === "") {
        updateData[key] = null;
      }
    });

    const { error: updateError } = await supabase
      .from("invoices")
      .update(updateData)
      .eq("id", invoiceId);

    if (updateError) {
      console.error("Update invoice error:", updateError);
      return error("Failed to update invoice", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);

    return success(undefined, "Invoice updated successfully");
  } catch (err) {
    console.error("Update invoice error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Delete invoice (hard delete - admin only)
 */
export async function deleteInvoice(invoiceId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // First delete related invoice items
    await supabase
      .from("invoice_items")
      .delete()
      .eq("invoice_id", invoiceId);

    // Then delete the invoice
    const { error: deleteError } = await supabase
      .from("invoices")
      .delete()
      .eq("id", invoiceId);

    if (deleteError) {
      console.error("Delete invoice error:", deleteError);
      return error("Failed to delete invoice", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/invoices");

    return success(undefined, "Invoice deleted successfully");
  } catch (err) {
    console.error("Delete invoice error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * List invoices with filters and pagination
 */
export async function listInvoices(options?: {
  status?: string;
  customerId?: string;
  search?: string;
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
      .from("invoices")
      .select(`
        *,
        customers(id, name, phone, email),
        shipments:shipment_id(id, reference, pieces)
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.customerId) {
      query = query.eq("customer_id", options.customerId);
    }

    if (options?.search) {
      query = query.or(`invoice_no.ilike.%${options.search}%,consignee_name.ilike.%${options.search}%,awb_no.ilike.%${options.search}%`);
    }

    const { data: invoices, error: fetchError, count } = await query;

    if (fetchError) {
      console.error("List invoices error:", fetchError);
      return error("Failed to fetch invoices", "DATABASE_ERROR");
    }

    return success({ data: invoices || [], count: count || 0 });
  } catch (err) {
    console.error("List invoices error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
