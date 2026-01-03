import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit } from '../rate-limit'

export async function GET(
  request: Request,
  { params }: { params: { reference: string } }
) {
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown'
  const rateLimitResult = rateLimit(clientIp, 10, 60000)

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        limit: rateLimitResult.limit,
        reset: new Date(rateLimitResult.reset).toISOString(),
      },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        }
      }
    )
  }

  const supabase = await createClient()
  const reference = params.reference.toUpperCase()

  try {
    const { data: shipment, error } = await supabase
      .from('shipments')
      .select(`
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
      `)
      .eq('reference', reference)
      .single()

    if (error || !shipment) {
      return NextResponse.json(
        { error: 'Shipment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        shipment,
        tracking: {
          lastUpdate: shipment.scan_events?.[0]?.scanned_at,
          currentLocation: shipment.scan_events?.[0]?.warehouse?.city,
          eventsCount: shipment.scan_events?.length || 0,
        },
      },
      {
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    )
  } catch (error) {
    console.error('Tracking API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
