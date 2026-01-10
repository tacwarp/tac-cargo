const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

export interface SMSPayload {
  to: string;
  message: string;
}

export async function sendSMS(
  payload: SMSPayload,
): Promise<{ success: boolean; sid?: string; error?: string }> {
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.warn("Twilio not configured, skipping SMS");
    return { success: false, error: "SMS service not configured" };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    const auth = Buffer.from(
      `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`,
    ).toString("base64");

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: payload.to,
        From: TWILIO_PHONE_NUMBER,
        Body: payload.message,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("SMS send failed:", typeof error === "string" ? error.substring(0, 100) : "Unknown error");
      return { success: false, error };
    }

    const data = await response.json();
    return { success: true, sid: data.sid };
  } catch (error) {
    console.error("SMS send error:", error instanceof Error ? error.message : "Unknown error");
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function generateShipmentSMS(data: {
  awbNo: string;
  status: string;
  trackingUrl: string;
}): string {
  const statusMessages: Record<string, string> = {
    booked: `Your shipment ${data.awbNo} has been booked. Track: ${data.trackingUrl}`,
    picked_up: `Shipment ${data.awbNo} picked up. Track: ${data.trackingUrl}`,
    in_transit: `Shipment ${data.awbNo} is in transit. Track: ${data.trackingUrl}`,
    out_for_delivery: `Shipment ${data.awbNo} is out for delivery today!`,
    delivered: `Shipment ${data.awbNo} delivered successfully. Thank you for choosing TAC Cargo!`,
    exception: `Alert: Issue with shipment ${data.awbNo}. Check: ${data.trackingUrl}`,
  };

  return (
    statusMessages[data.status] ||
    `Shipment ${data.awbNo} update. Track: ${data.trackingUrl}`
  );
}
