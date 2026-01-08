import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  // Require authentication for migration endpoints
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    message:
      "Please apply migrations manually via Supabase Dashboard SQL Editor",
    instructions: "See APPLY_MIGRATIONS.md for complete SQL",
    note: "Supabase client cannot execute DDL statements. Use the SQL Editor in the dashboard.",
  });
}
