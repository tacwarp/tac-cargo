import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("warehouses")
      .select("id, code, name, city, is_active")
      .eq("is_active", true)
      .order("code");

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch warehouses" },
        { status: 500 },
      );
    }

    return NextResponse.json({ warehouses: data });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
