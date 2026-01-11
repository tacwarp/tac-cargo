"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";
import type { Payment } from "@/types/database";

interface RecordPaymentInput {
  invoiceId: string;
  amount: number;
  paymentMethod: "cash" | "upi" | "bank_transfer" | "card" | "cheque";
  paymentReference?: string;
  notes?: string;
}

/**
 * Record a payment against an invoice
 */
export async function recordPayment(
  input: RecordPaymentInput
): Promise<ActionResult<Payment>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get invoice
    const { data: invoice } = await supabase
      .from("invoices")
      .select("id, total_amount, balance_due, organization_id")
      .eq("id", input.invoiceId)
      .single();

    if (!invoice) {
      return error("Invoice not found", "NOT_FOUND");
    }

    if (input.amount <= 0) {
      return error("Amount must be positive", "VALIDATION_ERROR");
    }

    if (input.amount > invoice.balance_due) {
      return error("Amount exceeds balance due", "VALIDATION_ERROR");
    }

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        invoice_id: input.invoiceId,
        amount: input.amount,
        payment_method: input.paymentMethod,
        payment_reference: input.paymentReference || null,
        status: "completed",
        notes: input.notes || null,
        received_by: user.id,
        organization_id: invoice.organization_id,
      })
      .select()
      .single();

    if (paymentError) {
      return error("Failed to record payment", "DATABASE_ERROR");
    }

    // Update invoice balance
    const newBalance = invoice.balance_due - input.amount;
    const newStatus = newBalance <= 0 ? "paid" : "partial";

    await supabase
      .from("invoices")
      .update({
        balance_due: newBalance,
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.invoiceId);

    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/invoices");
    return success(payment as Payment, "Payment recorded successfully");
  } catch (err) {
    console.error("Record payment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get payment history for an invoice
 */
export async function getInvoicePayments(
  invoiceId: string
): Promise<ActionResult<Payment[]>> {
  try {
    const supabase = await createClient();

    const { data, error: dbError } = await supabase
      .from("payments")
      .select(
        `
        *,
        profiles(full_name)
      `
      )
      .eq("invoice_id", invoiceId)
      .order("created_at", { ascending: false });

    if (dbError) {
      return error("Failed to fetch payments", "DATABASE_ERROR");
    }

    return success((data || []) as Payment[]);
  } catch (err) {
    console.error("Get invoice payments error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get outstanding invoices
 */
export async function getOutstandingInvoices(options?: {
  customerId?: string;
  limit?: number;
}): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createClient();

    let query = supabase
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
        customers(name, phone)
      `
      )
      .gt("balance_due", 0)
      .in("status", ["pending", "partial", "overdue"])
      .order("due_date", { ascending: true })
      .limit(options?.limit || 100);

    if (options?.customerId) {
      query = query.eq("customer_id", options.customerId);
    }

    const { data, error: dbError } = await query;

    if (dbError) {
      return error("Failed to fetch invoices", "DATABASE_ERROR");
    }

    return success(data || []);
  } catch (err) {
    console.error("Get outstanding invoices error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get payment summary stats
 */
export async function getPaymentStats(): Promise<
  ActionResult<{
    totalReceived: number;
    totalOutstanding: number;
    overdueCount: number;
    recentPayments: number;
  }>
> {
  try {
    const supabase = await createClient();

    // Total received (completed payments)
    const { data: payments } = await supabase
      .from("payments")
      .select("amount")
      .eq("status", "completed");

    const totalReceived = (payments || []).reduce((sum, p) => sum + p.amount, 0);

    // Total outstanding
    const { data: invoices } = await supabase
      .from("invoices")
      .select("balance_due")
      .gt("balance_due", 0);

    const totalOutstanding = (invoices || []).reduce(
      (sum, i) => sum + i.balance_due,
      0
    );

    // Overdue count
    const { count: overdueCount } = await supabase
      .from("invoices")
      .select("id", { count: "exact", head: true })
      .eq("status", "overdue");

    // Recent payments (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentPaymentsData } = await supabase
      .from("payments")
      .select("amount")
      .gte("created_at", sevenDaysAgo.toISOString())
      .eq("status", "completed");

    const recentPayments = (recentPaymentsData || []).reduce(
      (sum, p) => sum + p.amount,
      0
    );

    return success({
      totalReceived,
      totalOutstanding,
      overdueCount: overdueCount || 0,
      recentPayments,
    });
  } catch (err) {
    console.error("Get payment stats error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Refund a payment
 */
export async function refundPayment(
  paymentId: string,
  reason: string
): Promise<ActionResult<Payment>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get original payment
    const { data: payment } = await supabase
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (!payment) {
      return error("Payment not found", "NOT_FOUND");
    }

    if (payment.status === "refunded") {
      return error("Payment already refunded", "CONFLICT");
    }

    // Update payment status
    const { data: updatedPayment, error: updateError } = await supabase
      .from("payments")
      .update({
        status: "refunded",
        notes: `Refunded: ${reason}`,
      })
      .eq("id", paymentId)
      .select()
      .single();

    if (updateError) {
      return error("Failed to refund payment", "DATABASE_ERROR");
    }

    // Update invoice balance
    await supabase.rpc("increment_balance_due", {
      invoice_id: payment.invoice_id,
      amount: payment.amount,
    });

    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/invoices");
    return success(updatedPayment as Payment, "Payment refunded");
  } catch (err) {
    console.error("Refund payment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get customer payment history
 */
export async function getCustomerPaymentHistory(
  customerId: string,
  options?: { limit?: number }
): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createClient();

    const { data, error: dbError } = await supabase
      .from("payments")
      .select(
        `
        *,
        invoices(invoice_no, total_amount)
      `
      )
      .eq("invoices.customer_id", customerId)
      .order("created_at", { ascending: false })
      .limit(options?.limit || 50);

    if (dbError) {
      return error("Failed to fetch payment history", "DATABASE_ERROR");
    }

    return success(data || []);
  } catch (err) {
    console.error("Get customer payment history error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
