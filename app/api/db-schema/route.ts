import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: "Service role key required for schema inspection" },
        { status: 500 },
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Require authentication to prevent unauthorized schema inspection
    const authClient = await createServerClient();
    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await authClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const checkTable = async (tableName: string) => {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .limit(1);

      return {
        exists: !error,
        sample: data?.[0] ? Object.keys(data[0]) : null,
        error: error?.message,
      };
    };

    const tablesToCheck = [
      "shipments",
      "invoices",
      "shipment_exceptions",
      "payments",
      "profiles",
    ];

    // Run checks in parallel
    const results = await Promise.all(
      tablesToCheck.map(async (table) => {
        return [table, await checkTable(table)] as const;
      }),
    );

    const tables = Object.fromEntries(results);

    return NextResponse.json({ tables });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
