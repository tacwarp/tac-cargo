const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "notifications@taccargo.com";

// HTML escape function to prevent XSS
function escapeHtml(unsafe: string): string {
  return unsafe
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendEmail(
  payload: EmailPayload,
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(payload.to) ? payload.to : [payload.to],
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        reply_to: payload.replyTo,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Email send failed:", error);
      return { success: false, error };
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function generateShipmentCreatedEmail(data: {
  awbNo: string;
  consigneeName: string;
  trackingUrl: string;
  estimatedDelivery?: string;
}): { subject: string; html: string } {
  return {
    subject: `Your shipment ${data.awbNo} has been booked`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shipment Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #8b5cf6; margin: 0; font-size: 28px;">TAC Cargo</h1>
      </div>
      
      <h2 style="color: #1f2937; margin: 0 0 16px;">Shipment Confirmed</h2>
      <p style="color: #4b5563; margin: 0 0 24px; line-height: 1.6;">
        Dear ${escapeHtml(data.consigneeName)},<br><br>
        Your shipment has been booked successfully.
      </p>
      
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px; text-transform: uppercase;">AWB Number</p>
        <p style="margin: 0; color: #1f2937; font-size: 24px; font-weight: 600; font-family: monospace;">${escapeHtml(data.awbNo)}</p>
      </div>
      
      ${
        data.estimatedDelivery
          ? `
      <p style="color: #4b5563; margin: 0 0 24px;">
        <strong>Estimated Delivery:</strong> ${data.estimatedDelivery}
      </p>
      `
          : ""
      }
      
      <div style="text-align: center;">
        <a href="${data.trackingUrl}" style="display: inline-block; background: #8b5cf6; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Track Shipment
        </a>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
      
      <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
        TAC Cargo - Imphal-Delhi Logistics Corridor<br>
        This is an automated message. Please do not reply.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

export function generateDeliveryConfirmationEmail(data: {
  awbNo: string;
  consigneeName: string;
  deliveredAt: string;
  receiverName: string;
}): { subject: string; html: string } {
  return {
    subject: `Your shipment ${data.awbNo} has been delivered`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #8b5cf6; margin: 0; font-size: 28px;">TAC Cargo</h1>
      </div>
      
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="width: 64px; height: 64px; background: #10b981; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 32px;">✓</span>
        </div>
      </div>
      
      <h2 style="color: #1f2937; margin: 0 0 16px; text-align: center;">Delivered Successfully</h2>
      
      <p style="color: #4b5563; margin: 0 0 24px; line-height: 1.6; text-align: center;">
        Your shipment <strong>${escapeHtml(data.awbNo)}</strong> has been delivered.
      </p>
      
      <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px;"><strong>Delivered:</strong> ${escapeHtml(data.deliveredAt)}</p>
        <p style="margin: 0;"><strong>Received by:</strong> ${escapeHtml(data.receiverName)}</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
      
      <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
        Thank you for choosing TAC Cargo.
      </p>
    </div>
  </div>
</body>
</html>
    `,
  };
}
