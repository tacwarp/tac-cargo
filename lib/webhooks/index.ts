import { createClient } from "@/lib/supabase/server";
import crypto from "node:crypto";

export type WebhookEvent =
  | "shipment.created"
  | "shipment.picked_up"
  | "shipment.in_transit"
  | "shipment.out_for_delivery"
  | "shipment.delivered"
  | "shipment.exception"
  | "invoice.created"
  | "invoice.paid"
  | "manifest.created"
  | "manifest.dispatched";

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, unknown>;
}

export async function triggerWebhooks(
  organizationId: string,
  event: WebhookEvent,
  data: Record<string, unknown>,
): Promise<void> {
  try {
    const supabase = await createClient();

    const { data: webhooks, error } = await supabase
      .from("webhooks")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("is_active", true)
      .contains("events", [event]);

    if (error || !webhooks?.length) {
      return;
    }

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    await Promise.allSettled(
      webhooks.map((webhook) => sendWebhook(webhook, payload)),
    );
  } catch (error) {
    console.error("Webhook trigger error:", error instanceof Error ? error.message : "Unknown error");
  }
}

async function sendWebhook(
  webhook: { id: string; url: string; secret?: string },
  payload: WebhookPayload,
): Promise<void> {
  const supabase = await createClient();
  const startTime = Date.now();
  const body = JSON.stringify(payload);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Webhook-Event": payload.event,
    "X-Webhook-Timestamp": payload.timestamp,
  };

  if (webhook.secret) {
    const signature = crypto
      .createHmac("sha256", webhook.secret)
      .update(body)
      .digest("hex");
    headers["X-Webhook-Signature"] = `sha256=${signature}`;
  }

  let success = false;
  let responseStatus: number | undefined;
  let responseBody: string | undefined;
  let errorMessage: string | undefined;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(webhook.url, {
      method: "POST",
      headers,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeout);
    responseStatus = response.status;
    responseBody = await response.text().catch(() => "");
    success = response.ok;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unknown error";
  }

  const duration = Date.now() - startTime;

  await supabase.from("webhook_logs").insert({
    webhook_id: webhook.id,
    event_type: payload.event,
    payload,
    response_status: responseStatus,
    response_body: responseBody?.slice(0, 1000),
    duration_ms: duration,
    success,
    error_message: errorMessage,
  });

  if (success) {
    await supabase
      .from("webhooks")
      .update({
        failure_count: 0,
        last_triggered_at: new Date().toISOString(),
      })
      .eq("id", webhook.id);
  } else {
    // Increment failure count using raw SQL to avoid incorrect RPC usage
    await supabase.rpc("increment_webhook_failure", { webhook_id: webhook.id });
    await supabase
      .from("webhooks")
      .update({ last_triggered_at: new Date().toISOString() })
      .eq("id", webhook.id);
  }
}

export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const sigBuffer = Buffer.from(signature.replace("sha256=", ""));
    const expectedBuffer = Buffer.from(expectedSignature);

    // timingSafeEqual throws if buffers have different lengths
    if (sigBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}
