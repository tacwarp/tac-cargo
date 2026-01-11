"use server";

import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";
import { InvoicePDFData } from "@/lib/pdf/invoice-pdf-generator";
import { ShippingLabelData } from "@/lib/pdf/label-pdf-generator";
import { generateInvoiceHTML, generateShippingLabelHTML } from "@/lib/pdf/puppeteer-pdf-generator";
import { uploadPDFToStorage } from "@/lib/pdf/storage";

/**
 * Generate Invoice PDF using jsPDF
 */
export async function generateInvoicePDF(invoiceId: string): Promise<ActionResult<string>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Fetch invoice with all related data
    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select(`
        *,
        invoice_items(*),
        customers(name, phone, email, address, city, state, pincode, gst_number),
        origin_warehouse:warehouses!origin_warehouse_id(name, code, city, state),
        destination_warehouse:warehouses!destination_warehouse_id(name, code, city, state)
      `)
      .eq("id", invoiceId)
      .single();

    if (fetchError || !invoice) {
      return error("Invoice not found", "NOT_FOUND");
    }

    // Get organization details
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, organizations(name, gstin, address, phone, email)")
      .eq("id", user.id)
      .single();

    const org = profile?.organizations as any;

    // Prepare PDF data
    const pdfData: InvoicePDFData = {
      companyName: org?.name || "TAC Cargo",
      companyAddress: org?.address || "Delhi, India",
      companyPhone: org?.phone || "+91 98765 43210",
      companyEmail: org?.email || "info@taccargo.com",
      companyGSTIN: org?.gstin || "29ABCDE1234F1Z5",
      
      invoiceNo: invoice.invoice_no,
      invoiceDate: invoice.invoice_date || new Date().toISOString(),
      dueDate: invoice.due_date,
      awbNo: invoice.awb_no || "",
      consignmentNo: invoice.consignment_no || "",
      
      consignorName: invoice.consignor_name || "",
      consignorAddress: invoice.consignor_address || "",
      consignorCity: invoice.consignor_city || "",
      consignorState: invoice.consignor_state || "",
      consignorPincode: invoice.consignor_pincode || "",
      consignorPhone: invoice.consignor_phone || "",
      consignorGSTIN: invoice.consignor_gstin,
      
      consigneeName: invoice.consignee_name || "",
      consigneeAddress: invoice.consignee_address || "",
      consigneeCity: invoice.consignee_city || "",
      consigneeState: invoice.consignee_state || "",
      consigneePincode: invoice.consignee_pincode || "",
      consigneePhone: invoice.consignee_phone || "",
      
      origin: invoice.origin || "",
      destination: invoice.destination || "",
      transportMode: invoice.transport_mode || "air",
      pieces: invoice.pieces || 1,
      actualWeight: invoice.actual_weight || 0,
      chargeableWeight: invoice.chargeable_weight || 0,
      declaredValue: invoice.declared_value,
      
      items: (invoice.invoice_items || []).map((item: any) => ({
        description: item.description || "",
        quantity: item.quantity || 1,
        weight: item.weight || 0,
        rate: item.unit_price || 0,
        amount: item.line_total || 0,
      })),
      
      freightCharge: invoice.freight_charge || 0,
      pickupCharge: invoice.pickup_charge,
      deliveryCharge: invoice.delivery_charge,
      packingCharge: invoice.packing_charge,
      insuranceCharge: invoice.insurance_charge,
      handlingCharge: invoice.handling_charge,
      otherCharges: invoice.other_charges,
      
      subtotal: invoice.subtotal || 0,
      cgst: invoice.cgst || 0,
      sgst: invoice.sgst || 0,
      igst: invoice.igst || 0,
      totalTax: invoice.total_tax || 0,
      grandTotal: invoice.total_amount || 0,
      
      paymentMode: invoice.payment_mode || "PREPAID",
      advancePaid: invoice.advance_paid || 0,
      balanceDue: invoice.balance_due || 0,
      
      remarks: invoice.notes,
    };

    // Generate HTML for Puppeteer MCP
    const html = await generateInvoiceHTML(pdfData);
    
    // TODO: Use Puppeteer MCP to convert HTML to PDF
    // For now, we'll use a placeholder approach
    // In production, call Puppeteer MCP server to generate PDF from HTML
    const pdfBuffer = Buffer.from(html, 'utf-8'); // Temporary: storing HTML
    
    // Upload to storage
    const fileName = `${invoice.invoice_no}.pdf`;
    const uploadResult = await uploadPDFToStorage(
      pdfBuffer,
      fileName,
      "invoices",
      profile?.organization_id || "default"
    );

    if (!uploadResult) {
      return error("Failed to upload PDF", "INTERNAL_ERROR");
    }

    // Update invoice with PDF URL
    await supabase
      .from("invoices")
      .update({
        invoice_pdf_url: uploadResult.url,
        pdf_generated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);

    return success(uploadResult.url, "Invoice PDF generated successfully");
  } catch (err) {
    console.error("Generate invoice PDF error:", err);
    return error("Failed to generate PDF", "INTERNAL_ERROR");
  }
}

/**
 * Generate Shipping Label PDF using jsPDF
 */
export async function generateLabelPDF(invoiceId: string): Promise<ActionResult<string>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Fetch invoice with warehouse details
    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select(`
        *,
        origin_warehouse:warehouses!origin_warehouse_id(name, code, city, state),
        destination_warehouse:warehouses!destination_warehouse_id(name, code, city, state)
      `)
      .eq("id", invoiceId)
      .single();

    if (fetchError || !invoice) {
      return error("Invoice not found", "NOT_FOUND");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    const originWarehouse = invoice.origin_warehouse as any;
    const destinationWarehouse = invoice.destination_warehouse as any;

    // Prepare label data
    const labelData: ShippingLabelData = {
      awbNo: invoice.awb_no || "",
      consignmentNo: invoice.consignment_no || "",
      invoiceNo: invoice.invoice_no,
      
      originName: originWarehouse?.name || "",
      originCode: originWarehouse?.code || "",
      originCity: originWarehouse?.city || "",
      originState: originWarehouse?.state || "",
      
      destinationName: destinationWarehouse?.name || "",
      destinationCode: destinationWarehouse?.code || "",
      destinationCity: destinationWarehouse?.city || "",
      destinationState: destinationWarehouse?.state || "",
      
      consignorName: invoice.consignor_name || "",
      consignorAddress: invoice.consignor_address || "",
      consignorCity: invoice.consignor_city || "",
      consignorState: invoice.consignor_state || "",
      consignorPincode: invoice.consignor_pincode || "",
      consignorPhone: invoice.consignor_phone || "",
      
      consigneeName: invoice.consignee_name || "",
      consigneeAddress: invoice.consignee_address || "",
      consigneeCity: invoice.consignee_city || "",
      consigneeState: invoice.consignee_state || "",
      consigneePincode: invoice.consignee_pincode || "",
      consigneePhone: invoice.consignee_phone || "",
      
      pieces: invoice.pieces || 1,
      weight: invoice.actual_weight || 0,
      transportMode: invoice.transport_mode || "air",
      
      shipmentDate: invoice.invoice_date || new Date().toISOString(),
    };

    // Generate HTML for Puppeteer MCP
    const html = await generateShippingLabelHTML(labelData);
    
    // TODO: Use Puppeteer MCP to convert HTML to PDF
    // For now, we'll use a placeholder approach
    // In production, call Puppeteer MCP server to generate PDF from HTML
    const pdfBuffer = Buffer.from(html, 'utf-8'); // Temporary: storing HTML
    
    // Upload to storage
    const fileName = `${invoice.awb_no || invoice.invoice_no}-label.pdf`;
    const uploadResult = await uploadPDFToStorage(
      pdfBuffer,
      fileName,
      "labels",
      profile?.organization_id || "default"
    );

    if (!uploadResult) {
      return error("Failed to upload label PDF", "INTERNAL_ERROR");
    }

    // Update invoice with label PDF URL
    await supabase
      .from("invoices")
      .update({
        label_pdf_url: uploadResult.url,
      })
      .eq("id", invoiceId);

    return success(uploadResult.url, "Label PDF generated successfully");
  } catch (err) {
    console.error("Generate label PDF error:", err);
    return error("Failed to generate label PDF", "INTERNAL_ERROR");
  }
}

/**
 * Generate both Invoice and Label PDFs
 */
export async function generateAllPDFs(invoiceId: string): Promise<ActionResult<{ invoicePdf: string; labelPdf: string }>> {
  try {
    const invoiceResult = await generateInvoicePDF(invoiceId);
    if (!invoiceResult.success) {
      return error(invoiceResult.error, invoiceResult.code);
    }

    const labelResult = await generateLabelPDF(invoiceId);
    if (!labelResult.success) {
      return error(labelResult.error, labelResult.code);
    }

    return success({
      invoicePdf: invoiceResult.data,
      labelPdf: labelResult.data,
    }, "All PDFs generated successfully");
  } catch (err) {
    console.error("Generate all PDFs error:", err);
    return error("Failed to generate PDFs", "INTERNAL_ERROR");
  }
}

/**
 * Regenerate PDF (creates new version)
 */
export async function regeneratePDF(
  invoiceId: string,
  type: 'invoice' | 'label'
): Promise<ActionResult<string>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get current invoice
    const { data: invoice } = await supabase
      .from("invoices")
      .select("pdf_version")
      .eq("id", invoiceId)
      .single();

    // Increment version
    const newVersion = (invoice?.pdf_version || 1) + 1;

    await supabase
      .from("invoices")
      .update({ pdf_version: newVersion })
      .eq("id", invoiceId);

    // Generate new PDF
    if (type === 'invoice') {
      return await generateInvoicePDF(invoiceId);
    } else {
      return await generateLabelPDF(invoiceId);
    }
  } catch (err) {
    console.error("Regenerate PDF error:", err);
    return error("Failed to regenerate PDF", "INTERNAL_ERROR");
  }
}
