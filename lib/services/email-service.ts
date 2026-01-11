"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
  }>;
}

/**
 * Send email using Resend
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return { success: false, error: "Email service not configured" };
    }

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "TAC Cargo <noreply@taccargo.com>",
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error: error.message };
    }

    console.log("Email sent successfully:", data);
    return { success: true };
  } catch (error) {
    console.error("Email service error:", error);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Send invoice email to customer
 */
export async function sendInvoiceEmail(
  customerEmail: string,
  invoiceNo: string,
  pdfUrl: string,
  customerName: string
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2980b9; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background: #2980b9; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TAC Cargo</h1>
        </div>
        <div class="content">
          <h2>Invoice Generated</h2>
          <p>Dear ${customerName},</p>
          <p>Your invoice <strong>${invoiceNo}</strong> has been generated successfully.</p>
          <p>You can view and download your invoice using the link below:</p>
          <a href="${pdfUrl}" class="button">View Invoice</a>
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>Thank you for choosing TAC Cargo!</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TAC Cargo. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Invoice ${invoiceNo} - TAC Cargo`,
    html,
  });
}

/**
 * Send shipment status update email
 */
export async function sendShipmentStatusEmail(
  customerEmail: string,
  customerName: string,
  reference: string,
  status: string,
  location?: string
): Promise<{ success: boolean; error?: string }> {
  const statusMessages: Record<string, string> = {
    picked_up: "Your shipment has been picked up",
    in_transit: "Your shipment is in transit",
    out_for_delivery: "Your shipment is out for delivery",
    delivered: "Your shipment has been delivered",
  };

  const message = statusMessages[status] || `Shipment status updated to ${status}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #27ae60; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .status { background: #fff; padding: 15px; border-left: 4px solid #27ae60; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Shipment Update</h1>
        </div>
        <div class="content">
          <p>Dear ${customerName},</p>
          <div class="status">
            <h3>${message}</h3>
            <p><strong>Tracking Number:</strong> ${reference}</p>
            ${location ? `<p><strong>Location:</strong> ${location}</p>` : ""}
          </div>
          <p>Track your shipment anytime at: <a href="https://taccargo.com/track/${reference}">Track Shipment</a></p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TAC Cargo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Shipment Update: ${reference}`,
    html,
  });
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(
  customerEmail: string,
  customerName: string,
  invoiceNo: string,
  amount: number,
  paymentMethod: string
): Promise<{ success: boolean; error?: string }> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #16a085; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .amount { font-size: 32px; color: #16a085; font-weight: bold; text-align: center; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Received</h1>
        </div>
        <div class="content">
          <p>Dear ${customerName},</p>
          <p>We have successfully received your payment.</p>
          <div class="amount">₹${amount.toLocaleString("en-IN")}</div>
          <p><strong>Invoice Number:</strong> ${invoiceNo}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p>Thank you for your payment!</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} TAC Cargo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `Payment Confirmation - Invoice ${invoiceNo}`,
    html,
  });
}
