import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // Require authentication for migration endpoints
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { step } = await request.json();

    const migrations: Record<string, string> = {
      "1": `
        CREATE TABLE IF NOT EXISTS shipment_exceptions (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          shipment_id uuid,
          exception_type text NOT NULL,
          description text NOT NULL,
          status text NOT NULL DEFAULT 'open',
          priority text NOT NULL DEFAULT 'medium',
          resolution_notes text,
          resolved_at timestamptz,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
      `,
      "2": `
        CREATE TABLE IF NOT EXISTS payments (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          invoice_id uuid,
          shipment_id uuid,
          amount numeric(10,2) NOT NULL,
          payment_method text NOT NULL,
          payment_reference text,
          status text NOT NULL DEFAULT 'pending',
          payment_date date,
          created_at timestamptz DEFAULT now(),
          updated_at timestamptz DEFAULT now()
        );
      `,
      "3": `
        ALTER TABLE shipment_exceptions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
      `,
      "4": `
        CREATE POLICY IF NOT EXISTS "exceptions_select" ON shipment_exceptions FOR SELECT TO authenticated USING (true);
        CREATE POLICY IF NOT EXISTS "exceptions_insert" ON shipment_exceptions FOR INSERT TO authenticated WITH CHECK (true);
        CREATE POLICY IF NOT EXISTS "exceptions_update" ON shipment_exceptions FOR UPDATE TO authenticated USING (true);
        CREATE POLICY IF NOT EXISTS "exceptions_delete" ON shipment_exceptions FOR DELETE TO authenticated USING (true);
      `,
      "5": `
        CREATE POLICY IF NOT EXISTS "payments_select" ON payments FOR SELECT TO authenticated USING (true);
        CREATE POLICY IF NOT EXISTS "payments_insert" ON payments FOR INSERT TO authenticated WITH CHECK (true);
        CREATE POLICY IF NOT EXISTS "payments_update" ON payments FOR UPDATE TO authenticated USING (true);
        CREATE POLICY IF NOT EXISTS "payments_delete" ON payments FOR DELETE TO authenticated USING (true);
      `,
    };

    const sql = migrations[step];
    if (!sql) {
      return NextResponse.json(
        { error: "Invalid step. Use 1-5." },
        { status: 400 },
      );
    }

    // Use Supabase REST API to execute SQL via RPC (using service role key for migrations)
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ sql_query: sql }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          step,
          success: false,
          error: errorText,
          note: "Migration must be run via Supabase Dashboard SQL Editor",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      step,
      success: true,
      message: "Migration applied successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Migration API",
    instructions: 'POST with { "step": "1" } through { "step": "5" }',
    steps: {
      "1": "Create shipment_exceptions table",
      "2": "Create payments table",
      "3": "Enable RLS",
      "4": "Add exceptions RLS policies",
      "5": "Add payments RLS policies",
    },
    fullMigration: {
      description: "Run the full cargo logistics schema",
      migrationFile: "/supabase/migrations/001_cargo_logistics_schema.sql",
      instructions: [
        "1. Open the Supabase Dashboard SQL Editor",
        "2. Copy the contents of the migration file",
        "3. Paste into the SQL editor and click Run",
        "4. Verify tables are created in Table Editor",
      ],
    },
  });
}
