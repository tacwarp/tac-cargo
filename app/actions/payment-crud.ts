"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";

/**
 * Create a new payment
 */
export async function createPayment(data: {
  invoice_id: string;
  amount: number;
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
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

    // Create payment
    const { data: payment, error: insertError } = await supabase
      .from("payments")
      .insert({
        invoice_id: data.invoice_id,
        amount: data.amount,
        payment_method: data.payment_method,
        payment_reference: data.payment_reference,
        notes: data.notes,
        status: "completed",
        received_by: user.id,
        organization_id: profile?.organization_id,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Create payment error:", insertError);
      return error("Failed to create payment", "DATABASE_ERROR");
    }

    // Update invoice balance
    const { data: invoice } = await supabase
      .from("invoices")
      .select("balance_due, total_amount")
      .eq("id", data.invoice_id)
      .single();

    if (invoice) {
      const newBalance = Math.max(0, invoice.balance_due - data.amount);
      const newStatus = newBalance === 0 ? "paid" : newBalance < invoice.total_amount ? "partial" : "pending";

      await supabase
        .from("invoices")
        .update({ 
          balance_due: newBalance, 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq("id", data.invoice_id);
    }

    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/invoices");

    return success({ id: payment.id }, "Payment recorded successfully");
  } catch (err) {
    console.error("Create payment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Delete payment
 */
export async function deletePayment(paymentId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get payment details first
    const { data: payment } = await supabase
      .from("payments")
      .select("invoice_id, amount, status")
      .eq("id", paymentId)
      .single();

    if (!payment) {
      return error("Payment not found", "NOT_FOUND");
    }

    // Delete the payment
    const { error: deleteError } = await supabase
      .from("payments")
      .delete()
      .eq("id", paymentId);

    if (deleteError) {
      console.error("Delete payment error:", deleteError);
      return error("Failed to delete payment", "DATABASE_ERROR");
    }

    // Restore invoice balance if payment was completed
    if (payment.status === "completed") {
      const { data: invoice } = await supabase
        .from("invoices")
        .select("balance_due, total_amount")
        .eq("id", payment.invoice_id)
        .single();

      if (invoice) {
        const newBalance = invoice.balance_due + payment.amount;
        const newStatus = newBalance >= invoice.total_amount ? "pending" : "partial";

        await supabase
          .from("invoices")
          .update({ 
            balance_due: newBalance, 
            status: newStatus,
            updated_at: new Date().toISOString() 
          })
          .eq("id", payment.invoice_id);
      }
    }

    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/invoices");

    return success(undefined, "Payment deleted successfully");
  } catch (err) {
    console.error("Delete payment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Refund payment
 */
export async function refundPayment(paymentId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get payment details
    const { data: payment } = await supabase
      .from("payments")
      .select("invoice_id, amount, status")
      .eq("id", paymentId)
      .single();

    if (!payment) {
      return error("Payment not found", "NOT_FOUND");
    }

    if (payment.status !== "completed") {
      return error("Only completed payments can be refunded", "VALIDATION_ERROR");
    }

    // Mark payment as refunded
    const { error: updateError } = await supabase
      .from("payments")
      .update({ status: "refunded" })
      .eq("id", paymentId);

    if (updateError) {
      console.error("Refund payment error:", updateError);
      return error("Failed to refund payment", "DATABASE_ERROR");
    }

    // Restore invoice balance
    const { data: invoice } = await supabase
      .from("invoices")
      .select("balance_due, total_amount")
      .eq("id", payment.invoice_id)
      .single();

    if (invoice) {
      const newBalance = invoice.balance_due + payment.amount;
      const newStatus = newBalance >= invoice.total_amount ? "pending" : "partial";

      await supabase
        .from("invoices")
        .update({ 
          balance_due: newBalance, 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq("id", payment.invoice_id);
    }

    revalidatePath("/dashboard/payments");
    revalidatePath(`/dashboard/payments/${paymentId}`);
    revalidatePath("/dashboard/invoices");

    return success(undefined, "Payment refunded successfully");
  } catch (err) {
    console.error("Refund payment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get payment by ID
 */
export async function getPaymentById(paymentId: string): Promise<ActionResult<Record<string, unknown>>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const { data: payment, error: fetchError } = await supabase
      .from("payments")
      .select(`
        *,
        invoices:invoice_id(id, invoice_no, total_amount, balance_due, consignee_name)
      `)
      .eq("id", paymentId)
      .single();

    if (fetchError || !payment) {
      return error("Payment not found", "NOT_FOUND");
    }

    return success(payment);
  } catch (err) {
    console.error("Get payment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * List payments with filters
 */
export async function listPayments(options?: {
  invoiceId?: string;
  status?: string;
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
      .from("payments")
      .select(`
        *,
        invoices:invoice_id(id, invoice_no, consignee_name)
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (options?.invoiceId) {
      query = query.eq("invoice_id", options.invoiceId);
    }

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    const { data: payments, error: fetchError, count } = await query;

    if (fetchError) {
      console.error("List payments error:", fetchError);
      return error("Failed to fetch payments", "DATABASE_ERROR");
    }

    return success({ data: payments || [], count: count || 0 });
  } catch (err) {
    console.error("List payments error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
