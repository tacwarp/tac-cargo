import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyWebhookSignature } from "@/lib/payments/razorpay";

// Use service role for webhook processing (no auth context)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment_link?: {
      entity: {
        id: string;
        amount: number;
        amount_paid: number;
        status: string;
        notes: Record<string, string>;
      };
    };
    payment?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        method: string;
        email: string;
        contact: string;
        notes: Record<string, string>;
        created_at: number;
      };
    };
    order?: {
      entity: {
        id: string;
        amount: number;
        amount_paid: number;
        status: string;
        notes: Record<string, string>;
      };
    };
  };
  created_at: number;
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("Missing Razorpay signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.error("Invalid Razorpay signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload: RazorpayWebhookPayload = JSON.parse(rawBody);
    console.log("Razorpay webhook received:", payload.event);

    switch (payload.event) {
      case "payment_link.paid":
        await handlePaymentLinkPaid(payload);
        break;

      case "payment_link.partially_paid":
        await handlePaymentLinkPartiallyPaid(payload);
        break;

      case "payment_link.expired":
        await handlePaymentLinkExpired(payload);
        break;

      case "payment_link.cancelled":
        await handlePaymentLinkCancelled(payload);
        break;

      case "payment.captured":
        await handlePaymentCaptured(payload);
        break;

      case "payment.failed":
        await handlePaymentFailed(payload);
        break;

      default:
        console.log("Unhandled webhook event:", payload.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentLinkPaid(payload: RazorpayWebhookPayload) {
  const linkEntity = payload.payload.payment_link?.entity;
  if (!linkEntity) return;

  const invoiceId = linkEntity.notes?.invoice_id;

  // Update payment link status
  await supabaseAdmin
    .from("payment_links")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("razorpay_link_id", linkEntity.id);

  // Update invoice if we have the invoice_id
  if (invoiceId) {
    const amountPaid = linkEntity.amount_paid / 100;

    // Get current invoice
    const { data: invoice } = await supabaseAdmin
      .from("invoices")
      .select("paid_amount, total_amount")
      .eq("id", invoiceId)
      .single();

    if (invoice) {
      const newPaidAmount = (parseFloat(invoice.paid_amount) || 0) + amountPaid;
      const totalAmount = parseFloat(invoice.total_amount) || 0;
      const balanceDue = Math.max(0, totalAmount - newPaidAmount);
      const status = balanceDue <= 0 ? "paid" : "partial";

      await supabaseAdmin
        .from("invoices")
        .update({
          paid_amount: newPaidAmount,
          balance_due: balanceDue,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", invoiceId);

      // Record payment
      await supabaseAdmin.from("payments").insert({
        invoice_id: invoiceId,
        amount: amountPaid,
        payment_method: "razorpay",
        transaction_ref: linkEntity.id,
        status: "completed",
        paid_at: new Date().toISOString(),
        notes: `Payment via Razorpay Payment Link`,
      });
    }
  }

  console.log(`Payment link ${linkEntity.id} marked as paid`);
}

async function handlePaymentLinkPartiallyPaid(payload: RazorpayWebhookPayload) {
  const linkEntity = payload.payload.payment_link?.entity;
  if (!linkEntity) return;

  await supabaseAdmin
    .from("payment_links")
    .update({
      status: "partially_paid",
      updated_at: new Date().toISOString(),
    })
    .eq("razorpay_link_id", linkEntity.id);

  console.log(`Payment link ${linkEntity.id} partially paid`);
}

async function handlePaymentLinkExpired(payload: RazorpayWebhookPayload) {
  const linkEntity = payload.payload.payment_link?.entity;
  if (!linkEntity) return;

  await supabaseAdmin
    .from("payment_links")
    .update({
      status: "expired",
      updated_at: new Date().toISOString(),
    })
    .eq("razorpay_link_id", linkEntity.id);

  console.log(`Payment link ${linkEntity.id} expired`);
}

async function handlePaymentLinkCancelled(payload: RazorpayWebhookPayload) {
  const linkEntity = payload.payload.payment_link?.entity;
  if (!linkEntity) return;

  await supabaseAdmin
    .from("payment_links")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("razorpay_link_id", linkEntity.id);

  console.log(`Payment link ${linkEntity.id} cancelled`);
}

async function handlePaymentCaptured(payload: RazorpayWebhookPayload) {
  const paymentEntity = payload.payload.payment?.entity;
  if (!paymentEntity) return;

  // Update payment link with payment ID if exists
  if (paymentEntity.order_id) {
    await supabaseAdmin
      .from("payment_links")
      .update({
        razorpay_payment_id: paymentEntity.id,
        updated_at: new Date().toISOString(),
      })
      .eq("razorpay_order_id", paymentEntity.order_id);
  }

  console.log(`Payment ${paymentEntity.id} captured`);
}

async function handlePaymentFailed(payload: RazorpayWebhookPayload) {
  const paymentEntity = payload.payload.payment?.entity;
  if (!paymentEntity) return;

  console.log(`Payment ${paymentEntity.id} failed`);

  // Log failed payment attempt
  const invoiceId = paymentEntity.notes?.invoice_id;
  if (invoiceId) {
    await supabaseAdmin.from("payments").insert({
      invoice_id: invoiceId,
      amount: paymentEntity.amount / 100,
      payment_method: "razorpay",
      transaction_ref: paymentEntity.id,
      status: "failed",
      notes: `Payment failed via Razorpay`,
    });
  }
}
