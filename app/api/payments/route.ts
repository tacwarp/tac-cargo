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
      .from("payments")
      .select(
        `
        *,
        invoice:invoices(reference, total, customer:customers(name))
      `,
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply status filter if provided
    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch payments" },
        { status: 500 },
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from("payments")
      .select("*", { count: "exact", head: true });
    if (status) {
      countQuery = countQuery.eq("status", status);
    }
    const { count: totalCount } = await countQuery;

    return NextResponse.json({
      payments: data,
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
    if (
      !body.invoice_id ||
      typeof body.amount !== "number" ||
      body.amount <= 0
    ) {
      return NextResponse.json(
        { error: "invoice_id and valid amount are required" },
        { status: 400 },
      );
    }

    const paymentData = {
      invoice_id: body.invoice_id,
      amount: body.amount,
      payment_mode: body.payment_mode || "cash",
      transaction_ref: body.transaction_ref || null,
      notes: body.notes || null,
      received_by: user.id,
      paid_at: body.paid_at || new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("payments")
      .insert([paymentData])
      .select(
        `
        *,
        invoice:invoices(reference, total, customer:customers(name))
      `,
      )
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create payment" },
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
        { error: "Payment ID is required" },
        { status: 400 },
      );
    }

    // Only allow specific fields to be updated
    const allowedFields = [
      "amount",
      "payment_mode",
      "transaction_ref",
      "notes",
      "status",
    ];
    const sanitizedUpdate = Object.fromEntries(
      Object.entries(updateData).filter(([key]) => allowedFields.includes(key)),
    );

    const { data, error } = await supabase
      .from("payments")
      .update(sanitizedUpdate)
      .eq("id", id)
      .select(
        `
        *,
        invoice:invoices(reference, total, customer:customers(name))
      `,
      )
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update payment" },
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
        { error: "Payment ID is required" },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("payments").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete payment" },
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
