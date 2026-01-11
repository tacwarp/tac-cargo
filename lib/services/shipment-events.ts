import { createClient } from "@/lib/supabase/server";
import { triggerWebhooks } from "@/lib/webhooks";
import { createNotification } from "@/lib/notifications";
import {
  sendEmail,
  generateShipmentCreatedEmail,
  generateDeliveryConfirmationEmail,
} from "@/lib/notifications/email";
import { sendSMS, generateShipmentSMS } from "@/lib/notifications/sms";
import {
  sendWhatsAppTemplate,
  WHATSAPP_TEMPLATES,
} from "@/lib/notifications/whatsapp";

export type ShipmentStatus =
  | "booked"
  | "picked_up"
  | "at_origin_hub"
  | "in_transit"
  | "at_destination_hub"
  | "out_for_delivery"
  | "delivered"
  | "exception"
  | "returned"
  | "cancelled";

interface ShipmentEventData {
  shipmentId: string;
  awbNo: string;
  status: ShipmentStatus;
  location?: string;
  warehouseId?: string;
  notes?: string;
  scannedBy: string;
  latitude?: number;
  longitude?: number;
}

export async function createShipmentEvent(
  data: ShipmentEventData,
): Promise<{ success: boolean; eventId?: string; error?: string }> {
  try {
    const supabase = await createClient();

    // Create scan event
    const { data: event, error: eventError } = await supabase
      .from("scan_events")
      .insert({
        shipment_id: data.shipmentId,
        warehouse_id: data.warehouseId,
        status: data.status,
        location: data.location,
        notes: data.notes,
        scanned_by: data.scannedBy,
        latitude: data.latitude,
        longitude: data.longitude,
      })
      .select()
      .single();

    if (eventError) {
      console.error("Failed to create scan event:", eventError.message);
      return { success: false, error: eventError.message };
    }

    // Update shipment status
    const { error: updateError } = await supabase
      .from("shipments")
      .update({
        status: data.status,
        ...(data.status === "delivered" && {
          delivered_at: new Date().toISOString(),
        }),
      })
      .eq("id", data.shipmentId);

    if (updateError) {
      console.error("Failed to update shipment status:", updateError.message);
    }

    // Get shipment details for notifications
    const { data: shipment } = await supabase
      .from("shipments")
      .select(
        `
        *,
        customer:customers(id, name, email, phone),
        organization_id
      `,
      )
      .eq("id", data.shipmentId)
      .single();

    if (shipment) {
      // Trigger webhooks
      if (shipment.organization_id) {
        await triggerWebhooks(
          shipment.organization_id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          `shipment.${data.status}` as any,
          {
            awb_no: data.awbNo,
            status: data.status,
            location: data.location,
            timestamp: new Date().toISOString(),
          },
        );
      }

      // Send notifications based on status
      await sendStatusNotifications(shipment, data.status);
    }

    return { success: true, eventId: event.id };
  } catch (error) {
    console.error("Shipment event creation error:", error instanceof Error ? error.message : "Unknown error");
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function sendStatusNotifications(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shipment: any,
  status: ShipmentStatus,
): Promise<void> {
  const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://taccargo.com"}/track/${shipment.reference}`;

  try {
    switch (status) {
      case "booked":
        if (shipment.consignee_email) {
          const emailContent = generateShipmentCreatedEmail({
            awbNo: shipment.reference,
            consigneeName: shipment.consignee_name,
            trackingUrl,
          });
          await sendEmail({
            to: shipment.consignee_email,
            subject: emailContent.subject,
            html: emailContent.html,
          });
        }

        if (shipment.consignee_phone) {
          await sendSMS({
            to: shipment.consignee_phone,
            message: generateShipmentSMS({
              awbNo: shipment.reference,
              status,
              trackingUrl,
            }),
          });

          await sendWhatsAppTemplate({
            to: shipment.consignee_phone,
            templateName: WHATSAPP_TEMPLATES.SHIPMENT_BOOKED,
            templateParams: [shipment.reference, trackingUrl],
          });
        }
        break;

      case "out_for_delivery":
        if (shipment.consignee_phone) {
          await sendSMS({
            to: shipment.consignee_phone,
            message: generateShipmentSMS({
              awbNo: shipment.reference,
              status,
              trackingUrl,
            }),
          });

          await sendWhatsAppTemplate({
            to: shipment.consignee_phone,
            templateName: WHATSAPP_TEMPLATES.OUT_FOR_DELIVERY,
            templateParams: [shipment.reference],
          });
        }
        break;

      case "delivered":
        if (shipment.consignee_email) {
          const emailContent = generateDeliveryConfirmationEmail({
            awbNo: shipment.reference,
            consigneeName: shipment.consignee_name,
            deliveredAt: new Date().toLocaleString("en-IN"),
            receiverName: shipment.consignee_name,
          });
          await sendEmail({
            to: shipment.consignee_email,
            subject: emailContent.subject,
            html: emailContent.html,
          });
        }

        if (shipment.consignee_phone) {
          await sendSMS({
            to: shipment.consignee_phone,
            message: generateShipmentSMS({
              awbNo: shipment.reference,
              status,
              trackingUrl,
            }),
          });

          await sendWhatsAppTemplate({
            to: shipment.consignee_phone,
            templateName: WHATSAPP_TEMPLATES.DELIVERED,
            templateParams: [shipment.reference],
          });
        }

        // Notify shipper
        if (shipment.customer?.id) {
          await createNotification({
            userId: shipment.customer.id,
            title: "Shipment Delivered",
            message: `Shipment ${shipment.reference} has been delivered successfully.`,
            type: "success",
            entityType: "shipment",
            entityId: shipment.id,
            actionUrl: `/dashboard/shipments/${shipment.id}`,
          });
        }
        break;

      case "exception":
        if (shipment.consignee_phone) {
          await sendWhatsAppTemplate({
            to: shipment.consignee_phone,
            templateName: WHATSAPP_TEMPLATES.EXCEPTION,
            templateParams: [shipment.reference, trackingUrl],
          });
        }
        break;
    }
  } catch (error) {
    console.error("Failed to send notifications:", error instanceof Error ? error.message : "Unknown error");
  }
}
