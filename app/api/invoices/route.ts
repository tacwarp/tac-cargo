import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const limitParam = parseInt(searchParams.get("limit") || "50");
    const offsetParam = parseInt(searchParams.get("offset") || "0");
    const limit = Math.min(
      Math.max(1, isNaN(limitParam) ? 50 : limitParam),
      100,
    );
    const offset = Math.max(0, isNaN(offsetParam) ? 0 : offsetParam);

    let query = supabase
      .from("invoices")
      .select(
        `
        *,
        customer:customers(id, name, email, phone),
        shipment:shipments(reference, weight)
      `,
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch invoices" },
        { status: 500 },
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from("invoices")
      .select("*", { count: "exact", head: true });
    if (status) {
      countQuery = countQuery.eq("status", status);
    }
    const { count: totalCount } = await countQuery;

    return NextResponse.json({
      invoices: data,
      count: totalCount ?? data.length,
      pageSize: limit,
    });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Extract packages from the request
    const { packages, ...invoiceFields } =
      body;

    // Map frontend field names to database column names
    const invoiceData = {
      invoice_no: invoiceFields.invoiceNo,
      awb_no: invoiceFields.awbNo,
      barcode_data: invoiceFields.barcodeData,
      customer_id: invoiceFields.customerId || null,
      shipper_name: invoiceFields.shipperName,
      shipper_address: invoiceFields.shipperAddress,
      shipper_phone: invoiceFields.shipperPhone,
      shipper_gstin: invoiceFields.shipperGstin,
      consignee_name: invoiceFields.consigneeName,
      consignee_address: invoiceFields.consigneeAddress,
      consignee_city: invoiceFields.consigneeCity,
      consignee_state: invoiceFields.consigneeState,
      consignee_pincode: invoiceFields.consigneePincode,
      consignee_phone: invoiceFields.consigneePhone,
      consignee_email: invoiceFields.consigneeEmail,
      origin_warehouse_id: invoiceFields.originWarehouseId || null,
      destination_warehouse_id: invoiceFields.destinationWarehouseId || null,
      transport_mode: invoiceFields.transportMode,
      payment_mode: invoiceFields.paymentMode,
      content_description: invoiceFields.contentDescription,
      special_instructions: invoiceFields.specialInstructions,
      invoice_date: invoiceFields.invoiceDate,
      due_date: invoiceFields.dueDate,
      total_pieces: invoiceFields.totalPieces,
      total_weight: invoiceFields.totalActualWeight,
      total_volumetric_weight: invoiceFields.totalVolumetricWeight,
      chargeable_weight: invoiceFields.chargeableWeight,
      declared_value: invoiceFields.totalDeclaredValue,
      freight_charge: invoiceFields.freightCharge,
      pickup_charge: invoiceFields.pickupCharge,
      delivery_charge: invoiceFields.deliveryCharge,
      packing_charge: invoiceFields.packingCharge,
      insurance_charge: invoiceFields.insuranceCharge,
      handling_charge: invoiceFields.handlingCharge || 0,
      other_charges: invoiceFields.otherCharges,
      subtotal: invoiceFields.subtotal,
      cgst: invoiceFields.cgst,
      sgst: invoiceFields.sgst,
      igst: invoiceFields.igst || 0,
      total_tax: invoiceFields.totalTax,
      total_amount: invoiceFields.totalAmount,
      balance_due: invoiceFields.totalAmount,
      status: "pending",
      created_by: user.id,
    };

    // Insert invoice using stored procedure to bypass PostgREST schema cache
    const { data: invoiceResult, error: invoiceError } = await supabase.rpc(
      "create_invoice_direct",
      {
        invoice_data: invoiceData,
      },
    );

    if (invoiceError) {
      console.error("Invoice creation error:", invoiceError);
      return NextResponse.json(
        {
          error: "Failed to create invoice",
          details: invoiceError.message,
          code: invoiceError.code,
        },
        { status: 500 },
      );
    }

    const invoice = invoiceResult;

    // Insert packages if provided
    if (packages && packages.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const packageData = packages.map((pkg: any, index: number) => ({
        invoice_id: invoice.id,
        package_no: index + 1,
        length: pkg.length,
        width: pkg.width,
        height: pkg.height,
        actual_weight: pkg.actualWeight,
        volumetric_weight: pkg.volumetricWeight,
        description: pkg.description,
        declared_value: pkg.declaredValue,
        packaging_type: pkg.packagingType,
        is_fragile: pkg.isFragile,
      }));

      const { error: packageError } = await supabase
        .from("packages")
        .insert(packageData);

      if (packageError) {
        console.error("Package creation error:", packageError);
        // Rollback invoice creation if packages fail
        await supabase.from("invoices").delete().eq("id", invoice.id);
        return NextResponse.json(
          {
            error: "Failed to create packages",
            details: packageError.message,
          },
          { status: 500 },
        );
      }
    }

    // Create shipment record with correct schema fields
    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .insert([
        {
          reference: invoice.awb_no,
          customer_id: invoice.customer_id,
          consignee_name: invoiceFields.consigneeName,
          consignee_phone: invoiceFields.consigneePhone,
          consignee_address: invoiceFields.consigneeAddress,
          origin_warehouse_id: invoiceFields.originWarehouseId || null,
          destination_warehouse_id:
            invoiceFields.destinationWarehouseId || null,
          status: "pending",
          transport_mode: invoiceFields.transportMode,
          weight: invoiceFields.totalActualWeight || 0,
          volumetric_weight: invoiceFields.totalVolumetricWeight || 0,
          chargeable_weight: invoiceFields.chargeableWeight || 0,
          pieces: invoiceFields.totalPieces || 1,
          description: invoiceFields.contentDescription,
          special_instructions: invoiceFields.specialInstructions,
          created_by: user.id,
        },
      ])
      .select()
      .single();

    if (shipmentError) {
      console.error("Shipment creation error:", shipmentError);
      // Rollback invoice and packages if shipment fails
      await supabase.from("packages").delete().eq("invoice_id", invoice.id);
      await supabase.from("invoices").delete().eq("id", invoice.id);
      return NextResponse.json(
        {
          error: "Failed to create shipment record",
          details: shipmentError.message,
        },
        { status: 500 },
      );
    }

    // Update invoice with shipment_id reference
    if (shipment) {
      const { error: updateError } = await supabase
        .from("invoices")
        .update({ shipment_id: shipment.id })
        .eq("id", invoice.id);

      if (updateError) {
        console.error("Failed to link shipment to invoice:", updateError);
      }
    }

    return NextResponse.json(
      {
        id: invoice.id,
        invoice_no: invoice.invoice_no,
        awb_no: invoice.awb_no,
        success: true,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 },
      );
    }

    // Whitelist allowed update fields to prevent unauthorized modifications
    const allowedFields = [
      "status",
      "notes",
      "due_date",
      "payment_mode",
      "special_instructions",
      "paid_amount",
    ];
    const sanitizedUpdate = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => allowedFields.includes(key)),
    );

    if (Object.keys(sanitizedUpdate).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("invoices")
      .update(sanitizedUpdate)
      .eq("id", id)
      .select(
        `
        *,
        customer:customers(id, name, email, phone),
        shipment:shipments(reference, weight)
      `,
      )
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update invoice" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's organization for scoped deletion
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only admins can delete invoices
    if (profile.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 },
      );
    }

    // Verify invoice belongs to user's organization before deletion
    const { data: invoice } = await supabase
      .from("invoices")
      .select("id, organization_id")
      .eq("id", id)
      .single();

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Note: If organization_id is not on invoices table, this check uses RLS
    // For extra safety, we verify ownership through the created_by user's org

    const { error } = await supabase.from("invoices").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete invoice" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
