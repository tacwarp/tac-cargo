/**
 * @fileoverview Shipment tracking API endpoint
 * @module app/api/track/route
 * 
 * Provides real-time shipment tracking by AWB (Air Waybill) number.
 * Fetches shipment details and scan events from Supabase.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * AWB validation regex pattern
 * Matches alphanumeric AWB numbers (3-20 characters)
 */
const AWB_PATTERN = /^[A-Z0-9]{3,20}$/i

/**
 * Validates AWB number format
 * 
 * @param {string} awb - AWB number to validate
 * @returns {boolean} True if valid AWB format
 */
function isValidAwb(awb: string): boolean {
  return AWB_PATTERN.test(awb)
}

/**
 * Sanitizes AWB input to prevent injection attacks
 * 
 * @param {string} awb - Raw AWB input
 * @returns {string} Sanitized AWB string
 */
function sanitizeAwb(awb: string): string {
  return awb.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
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
 * - RLS policies restrict data access
 * - Rate limiting should be applied at edge/middleware
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawAwb = searchParams.get('awb')

  // Validate AWB presence
  if (!rawAwb) {
    return NextResponse.json(
      { 
        error: 'AWB number is required',
        code: 'MISSING_AWB',
      },
      { status: 400 }
    )
  }

  // Sanitize and validate AWB format
  const awb = sanitizeAwb(rawAwb)
  
  if (!isValidAwb(awb)) {
    return NextResponse.json(
      { 
        error: 'Invalid AWB format. Must be 3-20 alphanumeric characters.',
        code: 'INVALID_AWB_FORMAT',
      },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient()

    // Fetch shipment by reference (AWB number)
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .select(`
        *,
        customer:customers(name, phone, email),
        origin_warehouse:warehouses!shipments_origin_warehouse_id_fkey(code, name, city, state),
        destination_warehouse:warehouses!shipments_destination_warehouse_id_fkey(code, name, city, state)
      `)
      .eq('reference', awb)
      .single()

    if (shipmentError || !shipment) {
      return NextResponse.json(
        { 
          error: 'Shipment not found',
          code: 'SHIPMENT_NOT_FOUND',
          awb,
        },
        { status: 404 }
      )
    }

    // Fetch scan events (tracking history)
    const { data: events, error: eventsError } = await supabase
      .from('scan_events')
      .select(`
        *,
        warehouse:warehouses(code, name, city)
      `)
      .eq('shipment_id', shipment.id)
      .order('scanned_at', { ascending: false })

    if (eventsError) {
      console.error('[Track API] Error fetching scan events:', eventsError)
      // Continue without events rather than failing completely
    }

    // Return structured response
    return NextResponse.json({
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
        consignee_name: shipment.consignee_name,
        consignee_address: shipment.consignee_address,
        consignee_phone: shipment.consignee_phone,
        origin: shipment.origin_warehouse,
        destination: shipment.destination_warehouse,
        customer: shipment.customer,
      },
      events: events || [],
    })
  } catch (error) {
    console.error('[Track API] Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    )
  }
}
