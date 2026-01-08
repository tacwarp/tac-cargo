import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const checks: Record<
    string,
    { status: "ok" | "error"; latency?: number; error?: string }
  > = {};

  // Database check
  try {
    const dbStart = Date.now();
    const supabase = await createClient();
    const { error } = await supabase.from("warehouses").select("id").limit(1);
    checks.database = {
      status: error ? "error" : "ok",
      latency: Date.now() - dbStart,
      ...(error && { error: error.message }),
    };
  } catch (error) {
    checks.database = {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }

  // Memory check
  const memUsage = process.memoryUsage();
  checks.memory = {
    status: memUsage.heapUsed / memUsage.heapTotal < 0.9 ? "ok" : "error",
  };

  const allHealthy = Object.values(checks).every((c) => c.status === "ok");
  const totalLatency = Date.now() - startTime;

  return NextResponse.json(
    {
      status: allHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV,
      latency: totalLatency,
      checks,
    },
    { status: allHealthy ? 200 : 503 },
  );
}
