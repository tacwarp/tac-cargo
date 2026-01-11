"use server";

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let client: ReturnType<typeof twilio> | null = null;

function getTwilioClient() {
  if (!accountSid || !authToken) {
    console.error("Twilio credentials not configured");
    return null;
  }
  
  if (!client) {
    client = twilio(accountSid, authToken);
  }
  
  return client;
}

/**
 * Send SMS using Twilio
 */
export async function sendSMS(
  to: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const twilioClient = getTwilioClient();
    
    if (!twilioClient || !fromNumber) {
      return { success: false, error: "SMS service not configured" };
    }

    // Ensure phone number is in E.164 format
    const formattedTo = to.startsWith("+") ? to : `+91${to.replace(/\D/g, "")}`;

    const result = await twilioClient.messages.create({
      body: message,
      from: fromNumber,
      to: formattedTo,
    });

    console.log("SMS sent successfully:", result.sid);
    return { success: true };
  } catch (error) {
    console.error("SMS send error:", error);
    return { success: false, error: "Failed to send SMS" };
  }
}

/**
 * Send shipment pickup notification
 */
export async function sendPickupNotification(
  phone: string,
  reference: string,
  customerName: string
): Promise<{ success: boolean; error?: string }> {
  const message = `Dear ${customerName}, your shipment ${reference} has been picked up. Track at: https://taccargo.com/track/${reference} - TAC Cargo`;
  return sendSMS(phone, message);
}

/**
 * Send out for delivery notification
 */
export async function sendOutForDeliveryNotification(
  phone: string,
  reference: string,
  customerName: string
): Promise<{ success: boolean; error?: string }> {
  const message = `Dear ${customerName}, your shipment ${reference} is out for delivery today. Please be available to receive it. - TAC Cargo`;
  return sendSMS(phone, message);
}

/**
 * Send delivery confirmation
 */
export async function sendDeliveryConfirmation(
  phone: string,
  reference: string,
  customerName: string
): Promise<{ success: boolean; error?: string }> {
  const message = `Dear ${customerName}, your shipment ${reference} has been delivered successfully. Thank you for choosing TAC Cargo!`;
  return sendSMS(phone, message);
}

/**
 * Send exception notification
 */
export async function sendExceptionNotification(
  phone: string,
  reference: string,
  customerName: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const message = `Dear ${customerName}, there's an issue with shipment ${reference}: ${reason}. Please contact us. - TAC Cargo`;
  return sendSMS(phone, message);
}

/**
 * Send COD collection notification
 */
export async function sendCODNotification(
  phone: string,
  reference: string,
  amount: number,
  customerName: string
): Promise<{ success: boolean; error?: string }> {
  const message = `Dear ${customerName}, COD amount ₹${amount.toLocaleString("en-IN")} will be collected for shipment ${reference} upon delivery. - TAC Cargo`;
  return sendSMS(phone, message);
}
