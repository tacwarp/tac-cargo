/**
 * Notification Service
 * Handles WhatsApp and Email notifications for invoices
 */

import { createClient } from "@/lib/supabase/server";

export interface NotificationPayload {
  invoiceId: string;
  invoiceNo: string;
  awbNo: string;
  recipientPhone: string;
  recipientEmail?: string;
  recipientName: string;
  totalAmount: number;
  pdfUrl?: string;
  trackingUrl?: string;
}

export interface WhatsAppMessage {
  to: string;
  templateName: string;
  templateParams: Record<string, string>;
  mediaUrl?: string;
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: string;
    encoding: string;
  }>;
}

/**
 * WhatsApp Business API Integration
 * Uses Meta's Cloud API or Twilio
 */
export class WhatsAppService {
  private apiUrl: string;
  private accessToken: string;
  private phoneNumberId: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || "https://graph.facebook.com/v18.0";
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
  }

  /**
   * Format phone number for WhatsApp (E.164 format)
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, "");
    
    // Add India country code if not present
    if (cleaned.length === 10) {
      cleaned = "91" + cleaned;
    }
    
    return cleaned;
  }

  /**
   * Send invoice notification via WhatsApp
   */
  async sendInvoiceNotification(payload: NotificationPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const formattedPhone = this.formatPhoneNumber(payload.recipientPhone);
      
      // Use template message for invoice notification
      const templateMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "template",
        template: {
          name: "invoice_notification",
          language: { code: "en" },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "document",
                  document: {
                    link: payload.pdfUrl,
                    filename: `Invoice-${payload.invoiceNo}.pdf`,
                  },
                },
              ],
            },
            {
              type: "body",
              parameters: [
                { type: "text", text: payload.recipientName },
                { type: "text", text: payload.invoiceNo },
                { type: "text", text: payload.awbNo },
                { type: "text", text: `₹${payload.totalAmount.toFixed(2)}` },
              ],
            },
          ],
        },
      };

      const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateMessage),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("WhatsApp API Error:", { code: error.error?.code, message: error.error?.message });
        return { success: false, error: error.error?.message || "Failed to send WhatsApp message" };
      }

      const result = await response.json();
      return { success: true, messageId: result.messages?.[0]?.id };
    } catch (error) {
      console.error("WhatsApp send error:", error instanceof Error ? error.message : "Unknown error");
      return { success: false, error: String(error) };
    }
  }

  /**
   * Send simple text message
   */
  async sendTextMessage(phone: string, message: string): Promise<{ success: boolean; error?: string }> {
    try {
      const formattedPhone = this.formatPhoneNumber(phone);
      
      const textMessage = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedPhone,
        type: "text",
        text: { body: message },
      };

      const response = await fetch(`${this.apiUrl}/${this.phoneNumberId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(textMessage),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.error?.message };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  /**
   * Generate WhatsApp share link (for client-side sharing)
   */
  static generateShareLink(phone: string, message: string): string {
    const cleanedPhone = phone.replace(/\D/g, "");
    const formattedPhone = cleanedPhone.length === 10 ? "91" + cleanedPhone : cleanedPhone;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
  }
}

/**
 * Email Service
 * Uses SendGrid, Resend, or similar
 */
export class EmailService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || process.env.RESEND_API_KEY || "";
    this.fromEmail = process.env.EMAIL_FROM || "billing@taccargo.com";
    this.fromName = process.env.EMAIL_FROM_NAME || "TAC Cargo Service";
  }

  /**
   * Send invoice email
   */
  async sendInvoiceEmail(payload: NotificationPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const html = this.generateInvoiceEmailHTML(payload);
      
      // Using Resend API (can be swapped for SendGrid)
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${this.fromName} <${this.fromEmail}>`,
          to: payload.recipientEmail,
          subject: `Invoice ${payload.invoiceNo} - TAC Cargo Service`,
          html,
          attachments: payload.pdfUrl ? [
            {
              filename: `Invoice-${payload.invoiceNo}.pdf`,
              path: payload.pdfUrl,
            },
          ] : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error: error.message || "Failed to send email" };
      }

      const result = await response.json();
      return { success: true, messageId: result.id };
    } catch (error) {
      console.error("Email send error:", error instanceof Error ? error.message : "Unknown error");
      return { success: false, error: String(error) };
    }
  }

  /**
   * Generate invoice email HTML
   */
  private generateInvoiceEmailHTML(payload: NotificationPayload): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${payload.invoiceNo}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">TAC Cargo Service</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0;">Delhi-Imphal Logistics Corridor</p>
  </div>
  
  <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
    <p style="font-size: 16px;">Dear <strong>${payload.recipientName}</strong>,</p>
    
    <p>Thank you for choosing TAC Cargo Service. Please find your invoice details below:</p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <strong>Invoice Number:</strong>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
            <span style="font-family: monospace; background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${payload.invoiceNo}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
            <strong>AWB/Tracking Number:</strong>
          </td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
            <span style="font-family: monospace; background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${payload.awbNo}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0;">
            <strong>Total Amount:</strong>
          </td>
          <td style="padding: 10px 0; text-align: right;">
            <span style="font-size: 20px; color: #8b5cf6; font-weight: bold;">₹${payload.totalAmount.toFixed(2)}</span>
          </td>
        </tr>
      </table>
    </div>
    
    ${payload.trackingUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${payload.trackingUrl}" style="background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Track Your Shipment
      </a>
    </div>
    ` : ""}
    
    <p style="color: #6b7280; font-size: 14px;">
      The invoice PDF is attached to this email. If you have any questions, please don't hesitate to contact us.
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    
    <div style="text-align: center; color: #6b7280; font-size: 12px;">
      <p><strong>TAC Cargo Service</strong></p>
      <p>1498, Gr. Floor, Wazir Nagar, Kotla-Mubarakpur, New Delhi-110003</p>
      <p>Phone: 9711011416, 9999983936 | GSTIN: 07AAMFT6165B1Z3</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

/**
 * Notification Manager
 * Coordinates sending notifications across channels
 */
export class NotificationManager {
  private whatsapp: WhatsAppService;
  private email: EmailService;

  constructor() {
    this.whatsapp = new WhatsAppService();
    this.email = new EmailService();
  }

  /**
   * Send invoice notification via multiple channels
   */
  async sendInvoiceNotification(
    payload: NotificationPayload,
    channels: ("whatsapp" | "email")[] = ["whatsapp"]
  ): Promise<{ whatsapp?: { success: boolean; error?: string }; email?: { success: boolean; error?: string } }> {
    const results: { whatsapp?: { success: boolean; error?: string }; email?: { success: boolean; error?: string } } = {};

    if (channels.includes("whatsapp") && payload.recipientPhone) {
      results.whatsapp = await this.whatsapp.sendInvoiceNotification(payload);
    }

    if (channels.includes("email") && payload.recipientEmail) {
      results.email = await this.email.sendInvoiceEmail(payload);
    }

    // Log notification attempt
    await this.logNotification(payload, results);

    return results;
  }

  /**
   * Log notification to database
   */
  private async logNotification(
    payload: NotificationPayload,
    results: Record<string, { success: boolean; error?: string }>
  ): Promise<void> {
    try {
      const supabase = await createClient();
      
      await supabase.from("notification_logs").insert({
        invoice_id: payload.invoiceId,
        recipient_phone: payload.recipientPhone,
        recipient_email: payload.recipientEmail,
        channels: Object.keys(results),
        results: results,
        sent_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Failed to log notification:", error instanceof Error ? error.message : "Unknown error");
    }
  }

  /**
   * Generate client-side share links
   */
  static generateShareLinks(payload: NotificationPayload): {
    whatsapp: string;
    email: string;
  } {
    const message = `
🚚 *TAC Cargo Service*

Your shipment invoice is ready!

📋 Invoice: ${payload.invoiceNo}
📦 AWB: ${payload.awbNo}
💰 Amount: ₹${payload.totalAmount.toFixed(2)}

${payload.trackingUrl ? `Track: ${payload.trackingUrl}` : ""}

Thank you for choosing TAC Cargo!
    `.trim();

    const emailSubject = encodeURIComponent(`Invoice ${payload.invoiceNo} - TAC Cargo Service`);
    const emailBody = encodeURIComponent(message.replace(/\*/g, ""));

    return {
      whatsapp: WhatsAppService.generateShareLink(payload.recipientPhone, message),
      email: `mailto:${payload.recipientEmail}?subject=${emailSubject}&body=${emailBody}`,
    };
  }
}

export default NotificationManager;
