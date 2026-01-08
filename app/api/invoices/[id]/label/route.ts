import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateLabelHTML } from "@/lib/pdf/label-generator";

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
        packages(*)
      `,
      )
      .eq("id", id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Transform invoice data to label format
    const labelData = {
      awb_no: invoice.awb_no,
      invoice_no: invoice.invoice_no,
      barcode_data: invoice.barcode_data || invoice.awb_no,
      shipper: {
        name: invoice.shipper_name || "TAC Cargo",
        address: invoice.shipper_address || "",
        phone: invoice.shipper_phone || "",
        gstin: invoice.shipper_gstin,
      },
      consignee: {
        name: invoice.consignee_name,
        address: invoice.consignee_address,
        city: invoice.consignee_city,
        state: invoice.consignee_state,
        pincode: invoice.consignee_pincode,
        phone: invoice.consignee_phone || "",
      },
      shipment: {
        pieces: invoice.total_pieces || 1,
        weight: invoice.total_weight || 0,
        volumetric_weight: invoice.total_volumetric_weight || 0,
        chargeable_weight: invoice.chargeable_weight || 0,
        transport_mode: invoice.transport_mode || "surface",
        payment_mode: invoice.payment_mode || "prepaid",
        content_description: invoice.content_description,
        special_instructions: invoice.special_instructions,
      },
      created_at: invoice.created_at,
    };

    // Generate label HTML
    const html = generateLabelHTML(labelData);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Label generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate label" },
      { status: 500 },
    );
  }
}
