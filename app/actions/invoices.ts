"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";
import type { Invoice, InvoiceType, InvoiceStatus } from "@/types/database";

/**
 * Generate unique invoice number
 */
function generateInvoiceNumber(type: InvoiceType): string {
  const prefix = type === "label" ? "LBL" : "INV";
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, "0");
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${prefix}-${year}${month}-${timestamp}`;
}

/**
 * Generate AWB number
 */
function generateAWBNumber(): string {
  const timestamp = Date.now().toString().slice(-10);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `AWB${timestamp}${random}`;
}

interface GenerateLabelInput {
  shipmentId: string;
}

/**
 * Generate label invoice for a shipment
 */
export async function generateLabelInvoice(
  input: GenerateLabelInput
): Promise<ActionResult<Invoice>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get shipment details
    const { data: shipment } = await supabase
      .from("shipments")
      .select(
        `
        *,
        customers(name, phone, address, city, state, pincode),
        origin_warehouse:warehouses!origin_warehouse_id(name, code),
        destination_warehouse:warehouses!destination_warehouse_id(name, code)
      `
      )
      .eq("id", input.shipmentId)
      .single();

    if (!shipment) {
      return error("Shipment not found", "NOT_FOUND");
    }

    // Check if label already exists
    const { data: existingLabel } = await supabase
      .from("invoices")
      .select("id")
      .eq("shipment_id", input.shipmentId)
      .eq("type", "label")
      .single();

    if (existingLabel) {
      return error("Label already exists for this shipment", "CONFLICT");
    }

    // Get user profile for organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    const invoiceNo = generateInvoiceNumber("label");
    const awbNo = generateAWBNumber();

    const { data, error: dbError } = await supabase
      .from("invoices")
      .insert({
        invoice_no: invoiceNo,
        type: "label",
        status: "pending",
        shipment_id: input.shipmentId,
        customer_id: shipment.customer_id,
        awb_no: awbNo,
        origin_warehouse_id: shipment.origin_warehouse_id,
        destination_warehouse_id: shipment.destination_warehouse_id,
        consignee_name: shipment.consignee_name,
        consignee_address: shipment.consignee_address,
        consignee_city: shipment.consignee_city,
        consignee_state: shipment.consignee_state,
        consignee_pincode: shipment.consignee_pincode,
        subtotal: 0,
        total_tax: 0,
        total_amount: 0,
        balance_due: 0,
        invoice_date: new Date().toISOString().split("T")[0],
        created_by: user.id,
        organization_id: profile?.organization_id,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Generate label error:", dbError);
      return error("Failed to generate label", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/shipments");
    return success(data as Invoice, "Label generated successfully");
  } catch (err) {
    console.error("Generate label error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

interface GenerateCustomerInvoiceInput {
  shipmentId: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }>;
  dueDate?: string;
  notes?: string;
}

/**
 * Generate customer invoice for a shipment
 */
export async function generateCustomerInvoice(
  input: GenerateCustomerInvoiceInput
): Promise<ActionResult<Invoice>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get shipment details
    const { data: shipment } = await supabase
      .from("shipments")
      .select(
        `
        *,
        customers(id, name, phone, address, city, state, pincode, gst_number)
      `
      )
      .eq("id", input.shipmentId)
      .single();

    if (!shipment) {
      return error("Shipment not found", "NOT_FOUND");
    }

    // Calculate totals
    let subtotal = 0;
    let totalTax = 0;

    const processedItems = input.items.map((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      const tax = item.taxRate ? lineTotal * (item.taxRate / 100) : 0;
      subtotal += lineTotal;
      totalTax += tax;
      return {
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        tax_rate: item.taxRate || 0,
        tax_amount: tax,
        line_total: lineTotal + tax,
      };
    });

    const totalAmount = subtotal + totalTax;

    // Get user profile for organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    const invoiceNo = generateInvoiceNumber("customer");
    const dueDate =
      input.dueDate ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        invoice_no: invoiceNo,
        type: "customer",
        status: "pending",
        shipment_id: input.shipmentId,
        customer_id: shipment.customer_id,
        consignee_name: shipment.consignee_name,
        consignee_address: shipment.consignee_address,
        consignee_city: shipment.consignee_city,
        consignee_state: shipment.consignee_state,
        consignee_pincode: shipment.consignee_pincode,
        subtotal,
        total_tax: totalTax,
        total_amount: totalAmount,
        balance_due: totalAmount,
        invoice_date: new Date().toISOString().split("T")[0],
        due_date: dueDate,
        notes: input.notes || null,
        created_by: user.id,
        organization_id: profile?.organization_id,
      })
      .select()
      .single();

    if (invoiceError) {
      console.error("Generate invoice error:", invoiceError);
      return error("Failed to generate invoice", "DATABASE_ERROR");
    }

    // Create invoice items
    const itemsToInsert = processedItems.map((item) => ({
      invoice_id: invoice.id,
      ...item,
    }));

    await supabase.from("invoice_items").insert(itemsToInsert);

    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/shipments");
    return success(invoice as Invoice, "Invoice generated successfully");
  } catch (err) {
    console.error("Generate invoice error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Regenerate invoice PDF
 */
export async function regenerateInvoice(
  invoiceId: string
): Promise<ActionResult<Invoice>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Update status to trigger PDF regeneration
    const { data, error: dbError } = await supabase
      .from("invoices")
      .update({
        status: "pending",
        pdf_url: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId)
      .select()
      .single();

    if (dbError) {
      return error("Failed to regenerate invoice", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/invoices");
    return success(data as Invoice, "Invoice queued for regeneration");
  } catch (err) {
    console.error("Regenerate invoice error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Mark invoice as sent
 */
export async function markInvoiceAsSent(
  invoiceId: string,
  channel: "whatsapp" | "email" = "whatsapp"
): Promise<ActionResult<Invoice>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const updateData: Record<string, unknown> = {
      status: "sent",
      updated_at: new Date().toISOString(),
    };

    if (channel === "whatsapp") {
      updateData.sent_via_whatsapp_at = new Date().toISOString();
    }

    const { data, error: dbError } = await supabase
      .from("invoices")
      .update(updateData)
      .eq("id", invoiceId)
      .select()
      .single();

    if (dbError) {
      return error("Failed to update invoice", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/invoices");
    return success(data as Invoice, "Invoice marked as sent");
  } catch (err) {
    console.error("Mark invoice sent error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get invoice with items
 */
export async function getInvoice(
  invoiceId: string
): Promise<ActionResult<Invoice & { items: unknown[] }>> {
  try {
    const supabase = await createClient();

    const { data, error: dbError } = await supabase
      .from("invoices")
      .select(
        `
        *,
        customers(name, phone, email, address, city, state, pincode, gst_number),
        shipments(reference, pieces, weight_kg, transport_mode),
        invoice_items(*)
      `
      )
      .eq("id", invoiceId)
      .single();

    if (dbError || !data) {
      return error("Invoice not found", "NOT_FOUND");
    }

    return success(data as Invoice & { items: unknown[] });
  } catch (err) {
    console.error("Get invoice error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * List invoices with filters
 */
export async function listInvoices(options?: {
  type?: InvoiceType;
  status?: InvoiceStatus;
  customerId?: string;
  limit?: number;
}): Promise<ActionResult<Invoice[]>> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("invoices")
      .select(
        `
        *,
        customers(name, phone),
        shipments(reference)
      `
      )
      .order("created_at", { ascending: false })
      .limit(options?.limit || 50);

    if (options?.type) {
      query = query.eq("type", options.type);
    }

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.customerId) {
      query = query.eq("customer_id", options.customerId);
    }

    const { data, error: dbError } = await query;

    if (dbError) {
      return error("Failed to list invoices", "DATABASE_ERROR");
    }

    return success((data || []) as Invoice[]);
  } catch (err) {
    console.error("List invoices error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get invoices pending WhatsApp delivery
 */
export async function getInvoicesPendingDelivery(): Promise<
  ActionResult<Invoice[]>
> {
  try {
    const supabase = await createClient();

    const { data, error: dbError } = await supabase
      .from("invoices")
      .select(
        `
        *,
        customers(name, phone),
        shipments(reference)
      `
      )
      .eq("type", "customer")
      .eq("status", "pending")
      .is("sent_via_whatsapp_at", null)
      .order("created_at", { ascending: false });

    if (dbError) {
      return error("Failed to fetch invoices", "DATABASE_ERROR");
    }

    return success((data || []) as Invoice[]);
  } catch (err) {
    console.error("Get pending invoices error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
