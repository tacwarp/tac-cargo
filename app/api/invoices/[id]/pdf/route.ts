import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateInvoicePDF, getPDFBlob } from "@/lib/invoice/pdf-generator";
import type { InvoiceDocumentData } from "@/components/invoice/invoice-document";

const COMPANY_INFO = {
  name: "TAPAN ASSOCIATE CARGO SERVICE",
  address: "1498, Gr. Floor, Wazir Nagar, Kotla-Mubarakpur, Gali No.3, New Delhi-110003",
  gstin: "07AAMFT6165B1Z3",
  phone: "9711011416, 9999983936, 01147093936",
  branchAddress: "Singjamei Thongam Leikai, Lane no. 6 Junction opposite Community hall, Imphal West - 795008",
  branchPhone: "+913853570445, 6909383936",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: invoice, error } = await supabase
      .from("invoices")
      .select(
        `
        *,
        customer:customers(id, name, email, phone, address, city, state, pincode, gst_number),
        origin_warehouse:warehouses!origin_warehouse_id(name, code, city),
        destination_warehouse:warehouses!destination_warehouse_id(name, code, city)
      `,
      )
      .eq("id", id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Normalize joined data
    const customer = Array.isArray(invoice.customer) ? invoice.customer[0] : invoice.customer;
    const originWarehouse = Array.isArray(invoice.origin_warehouse) ? invoice.origin_warehouse[0] : invoice.origin_warehouse;
    const destWarehouse = Array.isArray(invoice.destination_warehouse) ? invoice.destination_warehouse[0] : invoice.destination_warehouse;

    // Transform database invoice to InvoiceDocumentData format
    const invoiceData: InvoiceDocumentData = {
      // Company Details
      companyName: COMPANY_INFO.name,
      companyAddress: COMPANY_INFO.address,
      companyPhone: COMPANY_INFO.phone,
      companyGSTIN: COMPANY_INFO.gstin,
      branchOffice: COMPANY_INFO.branchAddress,
      branchPhone: COMPANY_INFO.branchPhone,

      // Invoice Details
      invoiceNo: invoice.invoice_no || invoice.reference || `INV-${id.slice(0, 8)}`,
      consignmentNo: invoice.awb_no || invoice.reference || `AWB-${id.slice(0, 8)}`,
      invoiceDate: new Date(invoice.invoice_date || invoice.created_at),
      dueDate: invoice.due_date ? new Date(invoice.due_date) : undefined,
      awbNo: invoice.awb_no,

      // Consignor (Shipper) Details
      consignorName: invoice.shipper_name || customer?.name || "N/A",
      consignorAddress: invoice.shipper_address || customer?.address || "N/A",
      consignorCity: customer?.city || "N/A",
      consignorState: customer?.state || "N/A",
      consignorPincode: customer?.pincode || "N/A",
      consignorPhone: invoice.shipper_phone || customer?.phone || "N/A",
      consignorGSTIN: invoice.shipper_gstin || customer?.gst_number,

      // Consignee (Receiver) Details
      consigneeName: invoice.consignee_name || "N/A",
      consigneeAddress: invoice.consignee_address || "N/A",
      consigneeCity: invoice.consignee_city || "N/A",
      consigneeState: invoice.consignee_state || "N/A",
      consigneePincode: invoice.consignee_pincode || "N/A",
      consigneePhone: invoice.consignee_phone || "N/A",

      // Courier/Shipment Details
      origin: originWarehouse?.city || originWarehouse?.name || "Delhi",
      destination: destWarehouse?.city || destWarehouse?.name || "Imphal",
      transportMode: invoice.transport_mode || "surface",
      pieces: invoice.total_pieces || 1,
      actualWeight: parseFloat(invoice.total_weight) || 0,
      chargeableWeight: parseFloat(invoice.chargeable_weight) || parseFloat(invoice.total_weight) || 0,
      ratePerKg: parseFloat(invoice.freight_charge) / (parseFloat(invoice.chargeable_weight) || 1),
      declaredValue: parseFloat(invoice.declared_value) || undefined,
      natureOfQuantity: invoice.content_description || "General Cargo",

      // Charges
      freightCharge: parseFloat(invoice.freight_charge) || 0,
      pickupCharge: parseFloat(invoice.pickup_charge) || 0,
      packingCharge: parseFloat(invoice.packing_charge) || 0,
      deliveryCharge: parseFloat(invoice.delivery_charge) || 0,
      insuranceCharge: parseFloat(invoice.insurance_charge) || 0,
      handlingCharge: parseFloat(invoice.handling_charge) || 0,
      otherCharges: parseFloat(invoice.other_charges) || 0,

      // Tax
      subtotal: parseFloat(invoice.subtotal) || 0,
      cgst: parseFloat(invoice.cgst) || 0,
      sgst: parseFloat(invoice.sgst) || 0,
      igst: parseFloat(invoice.igst) || 0,
      totalTax: parseFloat(invoice.total_tax) || 0,
      grandTotal: parseFloat(invoice.total_amount) || 0,

      // Payment
      paymentMode: (invoice.payment_mode?.toUpperCase() || "PREPAID") as "PREPAID" | "COD" | "TO PAY",
      advancePaid: parseFloat(invoice.paid_amount) || 0,
      balanceDue: parseFloat(invoice.balance_due) || 0,

      // Additional
      remarks: invoice.notes,
      officeHoursDelhi: "11 AM to 9 PM",
      officeHoursImphal: "9 AM to 6 PM",
    };

    // Generate PDF using jsPDF
    const pdfDoc = generateInvoicePDF(invoiceData);
    const pdfBlob = getPDFBlob(pdfDoc);
    const arrayBuffer = await pdfBlob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoiceData.consignmentNo}.pdf"`,
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
