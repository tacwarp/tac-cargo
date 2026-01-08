import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  const { reference } = await params;
  const clientIp = request.headers.get("x-forwarded-for") || "unknown";
  const rateLimitResult = checkRateLimit(clientIp, RATE_LIMITS.api);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many requests",
        limit: rateLimitResult.limit,
        reset: new Date(Date.now() + rateLimitResult.resetIn).toISOString(),
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": Math.ceil(
            rateLimitResult.resetIn / 1000,
          ).toString(),
        },
      },
    );
  }

  const supabase = await createClient();
  const shipmentRef = reference.toUpperCase();

  try {
    const { data: shipment, error } = await supabase
      .from("shipments")
      .select(
        `
        id,
        reference,
        status,
        sla_status,
        sla_target,
        transport_mode,
        weight_kg,
        pieces,
        created_at,
        origin_warehouse:warehouses!shipments_origin_warehouse_id_fkey(code, name, city),
        destination_warehouse:warehouses!shipments_destination_warehouse_id_fkey(code, name, city),
        scan_events(
          id,
          scan_type,
          scanned_at,
          remarks,
          warehouse:warehouses(code, name, city)
        )
      `,
      )
      .eq("reference", shipmentRef)
      .single();

    if (error || !shipment) {
      return NextResponse.json(
        { error: "Shipment not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        shipment,
        tracking: {
          lastUpdate: shipment.scan_events?.[0]?.scanned_at,
          currentLocation:
            Array.isArray(shipment.scan_events) &&
              shipment.scan_events[0]?.warehouse
              ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (shipment.scan_events[0].warehouse as any).city
              : null,
          eventsCount: shipment.scan_events?.length || 0,
        },
      },
      {
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": Math.ceil(
            rateLimitResult.resetIn / 1000,
          ).toString(),
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("Tracking API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
