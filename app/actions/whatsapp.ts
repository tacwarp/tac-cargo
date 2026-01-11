"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";
import type { } from "@/types/database";

interface WhatsAppMessageResult {
  invoiceId: string;
  phone: string;
  sent: boolean;
  timestamp: string;
}

/**
 * Send invoice via WhatsApp
 * This generates a WhatsApp deep link with the invoice PDF
 */
export async function sendInvoiceViaWhatsApp(
  invoiceId: string
): Promise<ActionResult<WhatsAppMessageResult>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get invoice with customer details
    const { data: invoice } = await supabase
      .from("invoices")
      .select(
        `
        *,
        customers(name, phone),
        shipments(reference)
      `
      )
      .eq("id", invoiceId)
      .single();

    if (!invoice) {
      return error("Invoice not found", "NOT_FOUND");
    }

    const customerPhone = (invoice as { customers?: { phone?: string } }).customers?.phone;
    if (!customerPhone) {
      return error("Customer phone not found", "VALIDATION_ERROR");
    }

    if (!invoice.pdf_url) {
      return error("Invoice PDF not generated yet", "VALIDATION_ERROR");
    }

    // Format phone for WhatsApp (remove + and spaces)
    const formattedPhone = customerPhone.replace(/[\s+\-()]/g, "");

    // Log the WhatsApp send attempt
    // Note: Using old_data/new_data to match migration 002 schema
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "SEND",
      entity_type: "invoice",
      entity_id: invoiceId,
      metadata: {
        phone: formattedPhone,
        invoice_no: invoice.invoice_no,
        method: "whatsapp",
      },
      organization_id: invoice.organization_id,
    });

    // Update invoice status
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        status: "sent",
        sent_via_whatsapp_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);

    if (updateError) {
      console.error("Failed to update invoice status:", updateError);
    }

    revalidatePath("/dashboard/invoices");

    return success(
      {
        invoiceId,
        phone: formattedPhone,
        sent: true,
        timestamp: new Date().toISOString(),
      },
      `WhatsApp message ready for ${formattedPhone}`
    );
  } catch (err) {
    console.error("Send WhatsApp error:", err);
    return error("Failed to send WhatsApp message", "INTERNAL_ERROR");
  }
}

/**
 * Generate WhatsApp deep link for invoice
 */
export async function getWhatsAppLink(
  invoiceId: string
): Promise<ActionResult<{ url: string; phone: string }>> {
  try {
    const supabase = await createClient();

    const { data: invoice } = await supabase
      .from("invoices")
      .select(
        `
        *,
        customers(name, phone),
        shipments(reference)
      `
      )
      .eq("id", invoiceId)
      .single();

    if (!invoice) {
      return error("Invoice not found", "NOT_FOUND");
    }

    const customerPhone2 = (invoice as { customers?: { phone?: string } }).customers?.phone;
    if (!customerPhone2) {
      return error("Customer phone not found", "VALIDATION_ERROR");
    }

    const formattedPhone = customerPhone2.replace(/[\s+\-()]/g, "");

    const shipmentRef2 = (invoice as { shipments?: { reference?: string } }).shipments?.reference || "N/A";
    const message = encodeURIComponent(
      `Hello! Here is your invoice for shipment ${shipmentRef2}.\n\n` +
      `Invoice No: ${invoice.invoice_no}\n` +
      `Amount: ₹${invoice.total_amount.toLocaleString("en-IN")}\n` +
      (invoice.pdf_url ? `\nView: ${invoice.pdf_url}` : "")
    );

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${message}`;

    return success({ url: whatsappUrl, phone: formattedPhone });
  } catch (err) {
    console.error("Get WhatsApp link error:", err);
    return error("Failed to generate WhatsApp link", "INTERNAL_ERROR");
  }
}

/**
 * Batch send invoices via WhatsApp
 */
export async function batchSendInvoices(
  invoiceIds: string[]
): Promise<ActionResult<{ sent: number; failed: number; results: WhatsAppMessageResult[] }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const results: WhatsAppMessageResult[] = [];
    let sent = 0;
    let failed = 0;

    for (const invoiceId of invoiceIds) {
      const result = await sendInvoiceViaWhatsApp(invoiceId);
      if (result.success) {
        sent++;
        results.push(result.data);
      } else {
        failed++;
        results.push({
          invoiceId,
          phone: "",
          sent: false,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return success(
      { sent, failed, results },
      `Sent ${sent} invoices, ${failed} failed`
    );
  } catch (err) {
    console.error("Batch send error:", err);
    return error("Batch send failed", "INTERNAL_ERROR");
  }
}

/**
 * Resend invoice via WhatsApp
 */
export async function resendInvoice(
  invoiceId: string
): Promise<ActionResult<WhatsAppMessageResult>> {
  return sendInvoiceViaWhatsApp(invoiceId);
}
