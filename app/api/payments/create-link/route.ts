import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createPaymentLink,
  isRazorpayConfigured,
} from "@/lib/payments/razorpay";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: "Payment gateway not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    // Fetch invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select(
        `
        id,
        invoice_no,
        awb_no,
        total_amount,
        balance_due,
        consignee_name,
        consignee_phone,
        consignee_email,
        customer:customers(name, phone, email)
      `
      )
      .eq("id", invoiceId)
      .single();

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    const balanceDue = parseFloat(invoice.balance_due as string) || 0;
    if (balanceDue <= 0) {
      return NextResponse.json(
        { error: "Invoice has no balance due" },
        { status: 400 }
      );
    }

    // Normalize customer data
    const customer = Array.isArray(invoice.customer)
      ? invoice.customer[0]
      : invoice.customer;

    const customerName =
      invoice.consignee_name || customer?.name || "Customer";
    const customerPhone =
      invoice.consignee_phone || customer?.phone || "";
    const customerEmail =
      invoice.consignee_email || customer?.email || undefined;

    if (!customerPhone) {
      return NextResponse.json(
        { error: "Customer phone number is required for payment link" },
        { status: 400 }
      );
    }

    // Create payment link
    const paymentLink = await createPaymentLink({
      amount: balanceDue,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoice_no || invoice.awb_no || invoiceId,
      customerName,
      customerPhone,
      customerEmail,
      description: `Payment for shipment ${invoice.awb_no || invoice.invoice_no}`,
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://taccargo.com"}/payment/success`,
      expireBy: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    });

    // Store payment link in database
    await supabase.from("payment_links").insert({
      invoice_id: invoice.id,
      razorpay_link_id: paymentLink.id,
      short_url: paymentLink.shortUrl,
      amount: paymentLink.amount,
      status: paymentLink.status,
      expires_at: paymentLink.expireBy?.toISOString(),
      created_by: user.id,
    });

    return NextResponse.json({
      success: true,
      paymentLink: {
        id: paymentLink.id,
        url: paymentLink.shortUrl,
        amount: paymentLink.amount,
        expiresAt: paymentLink.expireBy,
      },
    });
  } catch (error) {
    console.error("Create payment link error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create payment link",
      },
      { status: 500 }
    );
  }
}
