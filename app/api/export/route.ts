import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  exportShipmentsToCSV,
  exportInvoicesToCSV,
  exportManifestsToCSV,
  exportPaymentsToCSV,
  createCSVBlob,
} from "@/lib/export/csv-generator";
import { format } from "date-fns";

type ExportType = "shipments" | "invoices" | "manifests" | "payments";

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
    const type = searchParams.get("type") as ExportType;
    const status = searchParams.get("status");
    const fromDate = searchParams.get("from");
    const toDate = searchParams.get("to");
    const limit = parseInt(searchParams.get("limit") || "1000");

    if (!type || !["shipments", "invoices", "manifests", "payments"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid export type. Must be: shipments, invoices, manifests, or payments" },
        { status: 400 }
      );
    }

    let csvContent = "";
    let filename = "";

    switch (type) {
      case "shipments": {
        let query = supabase
          .from("shipments")
          .select(`
            *,
            origin_warehouse:warehouses!origin_warehouse_id(name, code),
            destination_warehouse:warehouses!destination_warehouse_id(name, code),
            customers(name)
          `)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (status) query = query.eq("status", status);
        if (fromDate) query = query.gte("created_at", fromDate);
        if (toDate) query = query.lte("created_at", toDate);

        const { data, error } = await query;
        if (error) throw error;

        csvContent = exportShipmentsToCSV(data || []);
        filename = `shipments-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
        break;
      }

      case "invoices": {
        let query = supabase
          .from("invoices")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit);

        if (status) query = query.eq("status", status);
        if (fromDate) query = query.gte("invoice_date", fromDate);
        if (toDate) query = query.lte("invoice_date", toDate);

        const { data, error } = await query;
        if (error) throw error;

        csvContent = exportInvoicesToCSV(data || []);
        filename = `invoices-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
        break;
      }

      case "manifests": {
        let query = supabase
          .from("manifests")
          .select(`
            *,
            origin_warehouse:warehouses!origin_warehouse_id(name, code),
            destination_warehouse:warehouses!destination_warehouse_id(name, code)
          `)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (status) query = query.eq("status", status);
        if (fromDate) query = query.gte("created_at", fromDate);
        if (toDate) query = query.lte("created_at", toDate);

        const { data, error } = await query;
        if (error) throw error;

        csvContent = exportManifestsToCSV(data || []);
        filename = `manifests-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
        break;
      }

      case "payments": {
        let query = supabase
          .from("payments")
          .select(`
            *,
            invoice:invoices(invoice_no, customer:customers(name))
          `)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (status) query = query.eq("status", status);
        if (fromDate) query = query.gte("paid_at", fromDate);
        if (toDate) query = query.lte("paid_at", toDate);

        const { data, error } = await query;
        if (error) throw error;

        csvContent = exportPaymentsToCSV(data || []);
        filename = `payments-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
        break;
      }
    }

    const blob = createCSVBlob(csvContent);
    const arrayBuffer = await blob.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": arrayBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to generate export" },
      { status: 500 }
    );
  }
}
