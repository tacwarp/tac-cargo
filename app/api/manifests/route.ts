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
    const limit = parseInt(searchParams.get("limit") || "50");

    let query = supabase
      .from("manifests")
      .select(
        `
        *,
        origin:warehouses!manifests_origin_warehouse_id_fkey(code, name),
        destination:warehouses!manifests_destination_warehouse_id_fkey(code, name)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch manifests" },
        { status: 500 },
      );
    }

    return NextResponse.json({ manifests: data });
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

    // Generate unique reference number using crypto for better uniqueness
    const { randomBytes } = await import("crypto");
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomPart = randomBytes(4).toString("hex").toUpperCase();
    const reference = `MAN-${timestamp}-${randomPart}`;

    const manifestData = {
      reference,
      origin_warehouse_id: body.origin_warehouse_id,
      destination_warehouse_id: body.destination_warehouse_id,
      transport_mode: body.transport_mode || "surface",
      carrier_name: body.carrier_name || null,
      vehicle_number: body.vehicle_number || null,
      flight_number: body.flight_number || null,
      notes: body.notes || null,
      status: "draft",
      created_by: user.id,
    };

    const { data, error } = await supabase
      .from("manifests")
      .insert([manifestData])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create manifest" },
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
