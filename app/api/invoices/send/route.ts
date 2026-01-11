/**
 * API Route: Send Invoice Notification
 * POST /api/invoices/send
 */

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { NotificationManager, type NotificationPayload } from "@/lib/services/notification-service";
import { successResponse, errorResponse } from "@/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const { invoiceId, channels = ["whatsapp"] } = body;

    if (!invoiceId) {
      return errorResponse("Invoice ID is required", 400);
    }

    // Fetch invoice with related data
    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select(`
        *,
        customers(name, phone, email),
        shipments(reference)
      `)
      .eq("id", invoiceId)
      .single();

    if (fetchError || !invoice) {
      return errorResponse("Invoice not found", 404);
    }

    // Build notification payload
    const payload: NotificationPayload = {
      invoiceId: invoice.id,
      invoiceNo: invoice.invoice_no,
      awbNo: invoice.awb_no || "",
      recipientPhone: invoice.consignee_phone || invoice.customers?.phone || "",
      recipientEmail: invoice.consignee_email || invoice.customers?.email,
      recipientName: invoice.consignee_name || invoice.customers?.name || "Customer",
      totalAmount: invoice.total_amount || 0,
      pdfUrl: invoice.invoice_pdf_url,
      trackingUrl: invoice.awb_no 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/track/${invoice.awb_no}`
        : undefined,
    };

    // Validate recipient info
    if (!payload.recipientPhone && channels.includes("whatsapp")) {
      return errorResponse("Recipient phone number is required for WhatsApp", 400);
    }

    if (!payload.recipientEmail && channels.includes("email")) {
      return errorResponse("Recipient email is required for email notification", 400);
    }

    // Send notifications
    const notificationManager = new NotificationManager();
    const results = await notificationManager.sendInvoiceNotification(payload, channels);

    // Update invoice status if sent successfully
    const anySuccess = Object.values(results).some((r) => r?.success);
    if (anySuccess) {
      const updateData: Record<string, unknown> = {
        status: "sent",
        updated_at: new Date().toISOString(),
      };

      if (results.whatsapp?.success) {
        updateData.sent_via_whatsapp_at = new Date().toISOString();
      }

      await supabase
        .from("invoices")
        .update(updateData)
        .eq("id", invoiceId);
    }

    return successResponse({
      message: "Notification sent",
      results,
      shareLinks: NotificationManager.generateShareLinks(payload),
    });
  } catch (error) {
    console.error("Send invoice notification error:", error instanceof Error ? error.message : "Unknown error");
    return errorResponse("Internal server error", 500);
  }
}

/**
 * GET /api/invoices/send?invoiceId=xxx
 * Get share links for an invoice (for client-side sharing)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get("invoiceId");

    if (!invoiceId) {
      return errorResponse("Invoice ID is required", 400);
    }

    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select(`
        *,
        customers(name, phone, email)
      `)
      .eq("id", invoiceId)
      .single();

    if (fetchError || !invoice) {
      return errorResponse("Invoice not found", 404);
    }

    const payload: NotificationPayload = {
      invoiceId: invoice.id,
      invoiceNo: invoice.invoice_no,
      awbNo: invoice.awb_no || "",
      recipientPhone: invoice.consignee_phone || invoice.customers?.phone || "",
      recipientEmail: invoice.consignee_email || invoice.customers?.email,
      recipientName: invoice.consignee_name || invoice.customers?.name || "Customer",
      totalAmount: invoice.total_amount || 0,
      trackingUrl: invoice.awb_no 
        ? `${process.env.NEXT_PUBLIC_APP_URL}/track/${invoice.awb_no}`
        : undefined,
    };

    return successResponse({
      shareLinks: NotificationManager.generateShareLinks(payload),
    });
  } catch (error) {
    console.error("Get share links error:", error instanceof Error ? error.message : "Unknown error");
    return errorResponse("Internal server error", 500);
  }
}
