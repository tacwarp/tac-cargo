import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const awb = searchParams.get('awb')

  if (!awb) {
    return NextResponse.json(
      { error: 'AWB number is required' },
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
      .eq('reference', awb.toUpperCase())
      .single()

    if (shipmentError || !shipment) {
      return NextResponse.json(
        { error: 'Shipment not found', awb },
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
      console.error('Error fetching scan events:', eventsError)
    }

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
    console.error('Tracking error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
