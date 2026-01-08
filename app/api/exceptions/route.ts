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
      .from("shipment_exceptions")
      .select(
        `
        *,
        shipment:shipments(reference, consignee_name, status)
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
        { error: "Failed to fetch exceptions" },
        { status: 500 },
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from("shipment_exceptions")
      .select("*", { count: "exact", head: true });
    if (status) {
      countQuery = countQuery.eq("status", status);
    }
    const { count: totalCount } = await countQuery;

    return NextResponse.json({
      exceptions: data,
      count: totalCount ?? data.length,
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

    // Validate required fields
    if (!body.exception_type || !body.description) {
      return NextResponse.json(
        { error: "exception_type and description are required" },
        { status: 400 },
      );
    }

    const exceptionData = {
      shipment_id: body.shipment_id || null,
      exception_type: body.exception_type,
      description: body.description,
      status: body.status || "open",
      priority: body.priority || "medium",
    };

    const { data, error } = await supabase
      .from("shipment_exceptions")
      .insert([exceptionData])
      .select(
        `
        *,
        shipment:shipments(reference, consignee_name, status)
      `,
      )
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create exception" },
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
        { error: "Exception ID is required" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("shipment_exceptions")
      .update({
        exception_type: updateData.exception_type,
        description: updateData.description,
        status: updateData.status,
        priority: updateData.priority,
        resolution_notes: updateData.resolution_notes,
        resolved_at:
          updateData.status === "resolved" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        `
        *,
        shipment:shipments(reference, consignee_name, status)
      `,
      )
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update exception" },
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
        { error: "Exception ID is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase
      .from("shipment_exceptions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete exception" },
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
