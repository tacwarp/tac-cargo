import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { shipmentSchema } from "@/lib/schemas/shipment";

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
      .from("shipments")
      .select(
        `
        *,
        customer:customers(name, email, phone),
        origin:warehouses!shipments_origin_warehouse_id_fkey(code, name, city, state),
        destination:warehouses!shipments_destination_warehouse_id_fkey(code, name, city, state)
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
        { error: "Failed to fetch shipments" },
        { status: 500 },
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from("shipments")
      .select("*", { count: "exact", head: true });
    if (status) {
      countQuery = countQuery.eq("status", status);
    }
    const { count: totalCount } = await countQuery;

    return NextResponse.json({
      shipments: data,
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

    const validationResult = shipmentSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 },
      );
    }

    const shipmentData = {
      ...validationResult.data,
      status: "pending",
      created_by: user.id,
    };

    const { data, error } = await supabase
      .from("shipments")
      .insert([shipmentData])
      .select(
        `
        *,
        customer:customers(name, email, phone),
        origin:warehouses!shipments_origin_warehouse_id_fkey(code, name, city, state),
        destination:warehouses!shipments_destination_warehouse_id_fkey(code, name, city, state)
      `,
      )
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create shipment" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
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
        { error: "Shipment ID is required" },
        { status: 400 },
      );
    }

    // Check if shipment exists
    const { data: existing, error: existError } = await supabase
      .from("shipments")
      .select("id")
      .eq("id", id)
      .single();

    if (existError || !existing) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 },
      );
    }

    // Validate update data - only allow specific fields
    const allowedFields = [
      "status",
      "consignee_name",
      "consignee_address",
      // "consignee_city", // Column removed
      "consignee_state",
      "consignee_pincode",
      "consignee_phone",
      "weight",
      "pieces",
      "notes",
      "special_instructions",
    ];
    const filteredData: Record<string, unknown> = {};
    for (const key of Object.keys(updateData)) {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    }

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("shipments")
      .update(filteredData)
      .eq("id", id)
      .select(
        `
        *,
        customer:customers(name, email, phone),
        origin:warehouses!shipments_origin_warehouse_id_fkey(code, name, city, state),
        destination:warehouses!shipments_destination_warehouse_id_fkey(code, name, city, state)
      `,
      )
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update shipment" },
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

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Shipment ID is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("shipments").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete shipment" },
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
