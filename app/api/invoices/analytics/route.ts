import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";

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

    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("status, total_amount, created_at");

    if (error) {
      console.error("Analytics error:", error);
      return NextResponse.json(
        { error: "Failed to fetch analytics" },
        { status: 500 },
      );
    }

    const totalRevenue =
      invoices?.reduce(
        (sum, inv) => sum + (Number(inv.total_amount) || 0),
        0,
      ) ?? 0;

    const outstanding =
      invoices
        ?.filter((inv) => inv.status === "pending")
        .reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0) ?? 0;

    const paidCount =
      invoices?.filter((inv) => inv.status === "paid").length ?? 0;
    const overdueCount =
      invoices?.filter((inv) => inv.status === "overdue").length ?? 0;

    // Monthly revenue aggregation
    const monthlyMap =
      invoices?.reduce(
        (acc, inv) => {
          const month = format(new Date(inv.created_at), "MMM yyyy");
          acc[month] = (acc[month] || 0) + (Number(inv.total_amount) || 0);
          return acc;
        },
        {} as Record<string, number>,
      ) ?? {};

    const monthlyData = Object.entries(monthlyMap)
      .map(([month, revenue]) => ({ month, revenue }))
      .slice(-6); // Last 6 months

    return NextResponse.json({
      totalRevenue,
      outstanding,
      paidCount,
      overdueCount,
      monthlyData,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
