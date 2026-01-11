const WHATSAPP_TOKEN = process.env.WHATSAPP_BUSINESS_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

export interface WhatsAppPayload {
  to: string;
  templateName: string;
  templateParams: string[];
  language?: string;
}

export interface WhatsAppTextPayload {
  to: string;
  message: string;
}

export async function sendWhatsAppTemplate(
  payload: WhatsAppPayload,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.warn("WhatsApp Business API not configured");
    return { success: false, error: "WhatsApp service not configured" };
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: payload.to.replace(/\D/g, ""),
        type: "template",
        template: {
          name: payload.templateName,
          language: { code: payload.language || "en" },
          components: [
            {
              type: "body",
              parameters: payload.templateParams.map((text) => ({
                type: "text",
                text,
              })),
            },
          ],
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("WhatsApp send failed:", typeof error === "string" ? error.substring(0, 100) : "Unknown error");
      return { success: false, error };
    }

    const data = await response.json();
    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error) {
    console.error("WhatsApp send error:", error instanceof Error ? error.message : "Unknown error");
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function sendWhatsAppText(
  payload: WhatsAppTextPayload,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.warn("WhatsApp Business API not configured");
    return { success: false, error: "WhatsApp service not configured" };
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: payload.to.replace(/\D/g, ""),
        type: "text",
        text: { body: payload.message },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("WhatsApp text send failed:", typeof error === "string" ? error.substring(0, 100) : "Unknown error");
      return { success: false, error };
    }

    const data = await response.json();
    return { success: true, messageId: data.messages?.[0]?.id };
  } catch (error) {
    console.error("WhatsApp text send error:", error instanceof Error ? error.message : "Unknown error");
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export const WHATSAPP_TEMPLATES = {
  SHIPMENT_BOOKED: "shipment_booked",
  SHIPMENT_PICKED_UP: "shipment_picked_up",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "shipment_delivered",
  EXCEPTION: "shipment_exception",
} as const;
