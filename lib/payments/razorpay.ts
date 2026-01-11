/**
 * Razorpay Payment Gateway Integration
 * Handles payment link generation, order creation, and webhook verification
 */

import Razorpay from "razorpay";
import crypto from "crypto";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials not configured");
  }

  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }

  return razorpayInstance;
}

export interface PaymentLinkOptions {
  amount: number; // Amount in INR (will be converted to paise)
  currency?: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  description?: string;
  notes?: Record<string, string>;
  expireBy?: number; // Unix timestamp
  callbackUrl?: string;
  callbackMethod?: "get" | "post";
}

export interface PaymentLink {
  id: string;
  shortUrl: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
  expireBy?: Date;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amountPaid: number;
  amountDue: number;
  currency: string;
  status: string;
  notes: Record<string, string>;
  createdAt: Date;
}

/**
 * Create a Razorpay Payment Link for an invoice
 */
export async function createPaymentLink(
  options: PaymentLinkOptions
): Promise<PaymentLink> {
  const razorpay = getRazorpay();

  const amountInPaise = Math.round(options.amount * 100);

  const paymentLink = await razorpay.paymentLink.create({
    amount: amountInPaise,
    currency: options.currency || "INR",
    accept_partial: false,
    description: options.description || `Payment for Invoice ${options.invoiceNumber}`,
    customer: {
      name: options.customerName,
      email: options.customerEmail,
      contact: options.customerPhone.replace(/\D/g, ""),
    },
    notify: {
      sms: true,
      email: !!options.customerEmail,
    },
    reminder_enable: true,
    notes: {
      invoice_id: options.invoiceId,
      invoice_number: options.invoiceNumber,
      ...options.notes,
    },
    callback_url: options.callbackUrl,
    callback_method: options.callbackMethod || "get",
    expire_by: options.expireBy,
  });

  return {
    id: paymentLink.id,
    shortUrl: paymentLink.short_url,
    amount: Number(paymentLink.amount) / 100,
    currency: paymentLink.currency || options.currency || "INR",
    status: paymentLink.status,
    createdAt: new Date(Number(paymentLink.created_at) * 1000),
    expireBy: paymentLink.expire_by ? new Date(Number(paymentLink.expire_by) * 1000) : undefined,
  };
}

/**
 * Create a Razorpay Order (for checkout integration)
 */
export async function createOrder(
  amount: number,
  invoiceId: string,
  invoiceNumber: string,
  currency = "INR"
): Promise<RazorpayOrder> {
  const razorpay = getRazorpay();

  const amountInPaise = Math.round(amount * 100);

  const order = await razorpay.orders.create({
    amount: amountInPaise,
    currency,
    notes: {
      invoice_id: invoiceId,
      invoice_number: invoiceNumber,
    },
  });

  return {
    id: order.id,
    entity: order.entity,
    amount: Number(order.amount) / 100,
    amountPaid: Number(order.amount_paid) / 100,
    amountDue: Number(order.amount_due) / 100,
    currency: order.currency,
    status: order.status,
    notes: order.notes as Record<string, string>,
    createdAt: new Date(order.created_at * 1000),
  };
}

/**
 * Fetch payment details by payment ID
 */
export async function getPayment(paymentId: string) {
  const razorpay = getRazorpay();
  const payment = await razorpay.payments.fetch(paymentId);

  return {
    id: payment.id,
    entity: payment.entity,
    amount: Number(payment.amount) / 100,
    currency: payment.currency,
    status: payment.status,
    method: payment.method,
    orderId: payment.order_id,
    email: payment.email,
    contact: payment.contact,
    notes: payment.notes,
    createdAt: new Date(Number(payment.created_at) * 1000),
  };
}

/**
 * Verify Razorpay webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret?: string
): boolean {
  const webhookSecret = secret || process.env.RAZORPAY_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.error("Razorpay webhook secret not configured");
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Verify payment signature (for checkout flow)
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay secret not configured");
  }

  const generatedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(generatedSignature)
  );
}

/**
 * Cancel a payment link
 */
export async function cancelPaymentLink(paymentLinkId: string) {
  const razorpay = getRazorpay();
  return await razorpay.paymentLink.cancel(paymentLinkId);
}

/**
 * Get payment link status
 */
export async function getPaymentLinkStatus(paymentLinkId: string) {
  const razorpay = getRazorpay();
  const link = await razorpay.paymentLink.fetch(paymentLinkId);

  return {
    id: link.id,
    shortUrl: link.short_url,
    amount: Number(link.amount) / 100,
    status: link.status,
    amountPaid: Number(link.amount_paid) / 100,
    payments: link.payments,
  };
}

/**
 * Check if Razorpay is configured
 */
export function isRazorpayConfigured(): boolean {
  return !!(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);
}

/**
 * Get Razorpay key ID for client-side checkout
 */
export function getRazorpayKeyId(): string | undefined {
  return RAZORPAY_KEY_ID;
}
