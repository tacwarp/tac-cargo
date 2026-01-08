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

    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.organization_id || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limitParam = parseInt(searchParams.get("limit") || "50", 10);
    const offsetParam = parseInt(searchParams.get("offset") || "0", 10);
    const limit = Math.min(
      Math.max(1, isNaN(limitParam) ? 50 : limitParam),
      100,
    );
    const offset = Math.max(0, isNaN(offsetParam) ? 0 : offsetParam);
    const entityType = searchParams.get("entity_type");
    const action = searchParams.get("action");

    let query = supabase
      .from("audit_logs")
      .select(
        `
        *,
        user:profiles(full_name, avatar_url)
      `,
        { count: "exact" },
      )
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (entityType) {
      query = query.eq("entity_type", entityType);
    }

    if (action) {
      query = query.eq("action", action);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Audit logs fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch audit logs" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      auditLogs: data,
      count: count ?? data.length,
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
