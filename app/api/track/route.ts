/**
 * @fileoverview Shipment tracking API endpoint
 * @module app/api/track/route
 *
 * Provides real-time shipment tracking by AWB (Air Waybill) number.
 * Fetches shipment details and scan events from Supabase.
 *
 * @security
 * - Input validation and sanitization
 * - Rate limiting (60 requests/minute per IP)
 * - RLS policies for data access control
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  checkRateLimit,
  getClientIp,
  getRateLimitHeaders,
  RATE_LIMITS,
} from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

/**
 * AWB validation regex pattern
 * Matches alphanumeric AWB numbers (3-20 characters)
 */
const AWB_PATTERN = /^[A-Z0-9]{3,20}$/i;

/**
 * Validates AWB number format
 *
 * @param {string} awb - AWB number to validate
 * @returns {boolean} True if valid AWB format
 */
function isValidAwb(awb: string): boolean {
  return AWB_PATTERN.test(awb);
}

/**
 * Sanitizes AWB input to prevent injection attacks
 *
 * @param {string} awb - Raw AWB input
 * @returns {string} Sanitized AWB string
 */
function sanitizeAwb(awb: string): string {
  return awb
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

/**
 * GET /api/track
 *
 * Retrieves shipment tracking information by AWB number.
 *
 * @param {Request} request - Incoming request object
 * @returns {Promise<NextResponse>} JSON response with shipment data or error
 *
 * @example
 * ```
 * GET /api/track?awb=TAC123456
 *
 * Response:
 * {
 *   "shipment": {
 *     "reference": "TAC123456",
 *     "status": "in_transit",
 *     "origin": { "code": "DEL", "city": "Delhi" },
 *     "destination": { "code": "MUM", "city": "Mumbai" }
 *   },
 *   "events": [...]
 * }
 * ```
 *
 * @security
 * - Input validation prevents SQL injection
 * - Rate limited to 60 requests/minute per IP
 * - RLS policies restrict data access
 */
export async function GET(request: Request) {
  // Rate limiting check
  const clientIp = getClientIp(request);
  const rateLimitResult = checkRateLimit(`track:${clientIp}`, RATE_LIMITS.api);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again later.",
        code: "RATE_LIMIT_EXCEEDED",
        retryAfter: Math.ceil(rateLimitResult.resetIn / 1000),
      },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const rawAwb = searchParams.get("awb");

  // Validate AWB presence
  if (!rawAwb) {
    return NextResponse.json(
      {
        error: "AWB number is required",
        code: "MISSING_AWB",
      },
      {
        status: 400,
        headers: getRateLimitHeaders(rateLimitResult),
      },
    );
  }

  // Sanitize and validate AWB format
  const awb = sanitizeAwb(rawAwb);

  if (!isValidAwb(awb)) {
    return NextResponse.json(
      {
        error: "Invalid AWB format. Must be 3-20 alphanumeric characters.",
        code: "INVALID_AWB_FORMAT",
      },
      {
        status: 400,
        headers: getRateLimitHeaders(rateLimitResult),
      },
    );
  }

  try {
    const supabase = await createClient();

    // Fetch shipment by reference (AWB number)
    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .select(
        `
        *,
        customer:customers(name, phone, email),
        origin_warehouse:warehouses!shipments_origin_warehouse_id_fkey(code, name, city, state),
        destination_warehouse:warehouses!shipments_destination_warehouse_id_fkey(code, name, city, state)
      `,
      )
      .eq("reference", awb)
      .single();

    if (shipmentError || !shipment) {
      return NextResponse.json(
        {
          error: "Shipment not found",
          code: "SHIPMENT_NOT_FOUND",
          awb,
        },
        {
          status: 404,
          headers: getRateLimitHeaders(rateLimitResult),
        },
      );
    }

    // Fetch scan events (tracking history)
    const { data: events, error: eventsError } = await supabase
      .from("scan_events")
      .select(
        `
        *,
        warehouse:warehouses(code, name, city)
      `,
      )
      .eq("shipment_id", shipment.id)
      .order("scanned_at", { ascending: false });

    if (eventsError) {
      logger.error("Failed to fetch scan events", eventsError, {
        shipmentId: shipment.id,
        awb,
      });
      // Continue without events rather than failing complete
    }

    // Return structured response with rate limit headers
    // PII removed for public tracking - only essential tracking information exposed
    return NextResponse.json(
      {
        shipment: {
          reference: shipment.reference,
          status: shipment.status,
          transport_mode: shipment.transport_mode,
          weight: shipment.weight,
          pieces: shipment.pieces,
          description: shipment.description,
          eta: shipment.eta,
          delivered_at: shipment.delivered_at,
          created_at: shipment.created_at,
          origin: shipment.origin_warehouse
            ? {
                code: shipment.origin_warehouse.code,
                city: shipment.origin_warehouse.city,
                state: shipment.origin_warehouse.state,
              }
            : null,
          destination: shipment.destination_warehouse
            ? {
                code: shipment.destination_warehouse.code,
                city: shipment.destination_warehouse.city,
                state: shipment.destination_warehouse.state,
              }
            : null,
        },
        events:
          events?.map((event) => ({
            id: event.id,
            scan_type: event.scan_type,
            scanned_at: event.scanned_at,
            location: event.warehouse
              ? {
                  code: event.warehouse.code,
                  city: event.warehouse.city,
                }
              : null,
            remarks: event.remarks,
          })) || [],
      },
      {
        headers: getRateLimitHeaders(rateLimitResult),
      },
    );
  } catch (error) {
    logger.error("Tracking API unexpected error", error, { awb });
    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
      },
      {
        status: 500,
        headers: getRateLimitHeaders(rateLimitResult),
      },
    );
  }
}
