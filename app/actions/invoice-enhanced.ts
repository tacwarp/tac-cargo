"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";
import {
  generateInvoiceNumber,
  generateAWBNumber,
  generateConsignmentNumber,
  generateBarcodeNumber,
} from "@/lib/invoice/id-generator";
import {
  calculateInvoice,
  type PackageDetails,
} from "@/lib/invoice/calculations";

export interface CreateEnhancedInvoiceInput {
  // Transport & Payment
  transportMode: "air" | "surface" | "express";
  paymentMode: "PREPAID" | "COD" | "TO PAY";
  
  // Consignor Details
  consignor: {
    name: string;
    phone: string;
    email?: string;
    gstin?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  
  // Consignee Details
  consignee: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  
  // Package Details
  packages: Array<{
    description: string;
    quantity: number;
    weight: number;
    length?: number;
    width?: number;
    height?: number;
    declaredValue?: number;
  }>;
  
  // Charges
  charges: {
    ratePerKg: number;
    pickupCharge?: number;
    deliveryCharge?: number;
    packingCharge?: number;
    insuranceCharge?: number;
    handlingCharge?: number;
    otherCharges?: number;
    advancePaid?: number;
  };
  
  // Additional
  remarks?: string;
  specialInstructions?: string;
  customerId?: string;
  shipmentId?: string;
}

export interface EnhancedInvoice {
  id: string;
  invoice_no: string;
  awb_no: string;
  consignment_no: string;
  barcode_data: string;
  status: string;
  total_amount: number;
  balance_due: number;
  created_at: string;
}

/**
 * Create Enhanced Invoice with AWB
 * Generates invoice, AWB label, and calculates all charges
 */
export async function createEnhancedInvoice(
  input: CreateEnhancedInvoiceInput
): Promise<ActionResult<EnhancedInvoice>> {
  try {
    const supabase = await createClient();

    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get user profile for organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    // Generate unique IDs (no sequence needed - IDs are timestamp + random based)
    const invoiceNo = generateInvoiceNumber();
    const awbNo = generateAWBNumber();
    const consignmentNo = generateConsignmentNumber();
    const barcodeData = generateBarcodeNumber();

    // Build package details for calculation
    const packageDetails: PackageDetails[] = input.packages.map((pkg) => ({
      actualWeight: pkg.weight,
      dimensions: pkg.length && pkg.width && pkg.height
        ? { length: pkg.length, width: pkg.width, height: pkg.height }
        : undefined,
      quantity: pkg.quantity,
    }));

    // Calculate totals
    const totalDeclaredValue = input.packages.reduce(
      (sum, pkg) => sum + (pkg.declaredValue || 0) * pkg.quantity,
      0
    );

    const calculation = calculateInvoice(
      packageDetails,
      {
        pickupCharge: input.charges.pickupCharge || 0,
        deliveryCharge: input.charges.deliveryCharge || 0,
        packingCharge: input.charges.packingCharge || 0,
        insuranceCharge: input.charges.insuranceCharge,
        handlingCharge: input.charges.handlingCharge || 0,
        otherCharges: input.charges.otherCharges || 0,
        freightCharge: 0, // Will be calculated
      },
      input.charges.ratePerKg,
      input.consignor.state,
      input.consignee.state,
      input.transportMode,
      input.charges.advancePaid || 0,
      totalDeclaredValue
    );

    // Prepare invoice data
    const invoiceData = {
      invoice_no: invoiceNo,
      awb_no: awbNo,
      reference: consignmentNo,
      barcode_data: barcodeData,
      type: "customer",
      status: "pending",
      
      // Shipper
      shipper_name: input.consignor.name,
      shipper_phone: input.consignor.phone,
      shipper_address: input.consignor.address,
      shipper_gstin: input.consignor.gstin,
      
      // Consignee
      consignee_name: input.consignee.name,
      consignee_phone: input.consignee.phone,
      consignee_email: input.consignee.email,
      consignee_address: input.consignee.address,
      consignee_city: input.consignee.city,
      consignee_state: input.consignee.state,
      consignee_pincode: input.consignee.pincode,
      
      // Shipment Details
      transport_mode: input.transportMode,
      payment_mode: input.paymentMode.toLowerCase().replace(" ", "_"), // Convert to lowercase for DB constraint
      content_description: input.packages.map((p) => p.description).join(", "),
      special_instructions: input.specialInstructions,
      
      // Weight
      total_pieces: input.packages.reduce((s, p) => s + p.quantity, 0),
      total_weight: calculation.actualWeight,
      total_volumetric_weight: calculation.volumetricWeight,
      chargeable_weight: calculation.chargeableWeight,
      declared_value: totalDeclaredValue,
      
      // Charges
      freight_charge: calculation.charges.freightCharge,
      pickup_charge: calculation.charges.pickupCharge,
      delivery_charge: calculation.charges.deliveryCharge,
      packing_charge: calculation.charges.packingCharge,
      insurance_charge: calculation.charges.insuranceCharge,
      handling_charge: calculation.charges.handlingCharge,
      other_charges: calculation.charges.otherCharges,
      
      // Tax
      subtotal: calculation.tax.subtotal,
      cgst: calculation.tax.cgst,
      sgst: calculation.tax.sgst,
      igst: calculation.tax.igst,
      total_tax: calculation.tax.totalTax,
      total_amount: calculation.tax.grandTotal,
      total: calculation.tax.grandTotal,
      balance_due: calculation.balanceDue,
      
      // Dates
      invoice_date: new Date().toISOString().split("T")[0],
      
      // Relations
      customer_id: input.customerId || null,
      shipment_id: input.shipmentId || null,
      created_by: user.id,
      organization_id: profile?.organization_id,
      
      // Notes
      notes: input.remarks,
    };

    // Insert invoice
    const { data: invoice, error: insertError } = await supabase
      .from("invoices")
      .insert(invoiceData)
      .select()
      .single();

    if (insertError) {
      console.error("Create invoice error:", insertError);
      return error(`Failed to create invoice: ${insertError.message}`, "DATABASE_ERROR");
    }

    // Create invoice items (packages)
    const invoiceItems = input.packages.map((pkg) => ({
      invoice_id: invoice.id,
      description: pkg.description,
      quantity: pkg.quantity,
      unit_price: input.charges.ratePerKg * pkg.weight,
      weight: pkg.weight,
      length: pkg.length,
      width: pkg.width,
      height: pkg.height,
      declared_value: pkg.declaredValue,
      line_total: input.charges.ratePerKg * pkg.weight * pkg.quantity,
    }));

    await supabase.from("invoice_items").insert(invoiceItems);

    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/shipments");

    // Auto-generate PDFs in background (don't wait for completion)
    try {
      const { generateAllPDFs } = await import("./pdf-generation");
      generateAllPDFs(invoice.id).catch(err => {
        console.error("PDF generation error (non-blocking):", err);
      });
    } catch (pdfError) {
      console.error("PDF generation import error:", pdfError);
    }

    return success(
      {
        id: invoice.id,
        invoice_no: invoice.invoice_no,
        awb_no: invoice.awb_no,
        consignment_no: consignmentNo,
        barcode_data: barcodeData,
        status: invoice.status,
        total_amount: invoice.total_amount,
        balance_due: invoice.balance_due,
        created_at: invoice.created_at,
      },
      "Invoice created successfully"
    );
  } catch (err) {
    console.error("Create enhanced invoice error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get Invoice with full details for PDF generation
 */
export async function getInvoiceForPDF(
  invoiceId: string
): Promise<ActionResult<Record<string, unknown>>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select(`
        *,
        customers(name, phone, email, address, city, state, pincode, gst_number),
        origin_warehouse:warehouses!origin_warehouse_id(name, code, city, state),
        destination_warehouse:warehouses!destination_warehouse_id(name, code, city, state),
        invoice_items(*)
      `)
      .eq("id", invoiceId)
      .single();

    if (fetchError || !invoice) {
      return error("Invoice not found", "NOT_FOUND");
    }

    return success(invoice);
  } catch (err) {
    console.error("Get invoice for PDF error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Update invoice PDF URL after generation
 */
export async function updateInvoicePDFUrl(
  invoiceId: string,
  pdfUrl: string,
  type: "invoice" | "label" = "invoice"
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const updateData: Record<string, string> = {
      updated_at: new Date().toISOString(),
    };

    if (type === "invoice") {
      updateData.invoice_pdf_url = pdfUrl;
    } else {
      updateData.label_pdf_url = pdfUrl;
    }

    const { error: updateError } = await supabase
      .from("invoices")
      .update(updateData)
      .eq("id", invoiceId);

    if (updateError) {
      return error("Failed to update PDF URL", "DATABASE_ERROR");
    }

    return success(undefined, "PDF URL updated");
  } catch (err) {
    console.error("Update PDF URL error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Send invoice via WhatsApp
 */
export async function sendInvoiceWhatsApp(
  invoiceId: string
): Promise<ActionResult<{ shareLink: string }>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .single();

    if (fetchError || !invoice) {
      return error("Invoice not found", "NOT_FOUND");
    }

    // Generate WhatsApp share message
    const message = `
🚚 *TAC Cargo Service*

Your shipment invoice is ready!

📋 Invoice: ${invoice.invoice_no}
📦 AWB: ${invoice.awb_no}
💰 Amount: ₹${invoice.total_amount?.toFixed(2)}

Track your shipment: ${process.env.NEXT_PUBLIC_APP_URL}/track/${invoice.awb_no}

Thank you for choosing TAC Cargo!
    `.trim();

    const phone = invoice.consignee_phone?.replace(/\D/g, "") || "";
    const formattedPhone = phone.length === 10 ? "91" + phone : phone;
    const shareLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

    // Update sent timestamp
    await supabase
      .from("invoices")
      .update({
        sent_via_whatsapp_at: new Date().toISOString(),
        status: "sent",
      })
      .eq("id", invoiceId);

    revalidatePath("/dashboard/invoices");

    return success({ shareLink }, "WhatsApp link generated");
  } catch (err) {
    console.error("Send WhatsApp error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
