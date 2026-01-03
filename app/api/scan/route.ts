import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateGS1Barcode } from '@/lib/barcode/gs1-validator'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { barcode, warehouse_id, status, notes } = body

    // Validate barcode format
    const validation = validateGS1Barcode(barcode)
    if (!validation.isValid) {
      return NextResponse.json({ 
        success: false,
        error: validation.error || 'Invalid barcode format',
        details: validation.error 
      }, { status: 400 })
    }

    // Find shipment by barcode or reference
    const { data: shipment, error: shipmentError } = await supabase
      .from('shipments')
      .select('id, reference, status')
      .or(`reference.eq.${barcode},id.in.(select shipment_id from barcodes where barcode_number.eq.${barcode})`)
      .single()

    if (shipmentError || !shipment) {
      return NextResponse.json({ 
        success: false,
        error: 'Shipment not found',
        barcode 
      }, { status: 404 })
    }

    // Check for duplicate scan
    const { data: existingScans } = await supabase
      .from('scan_events')
      .select('id')
      .eq('shipment_id', shipment.id)
      .eq('status', status)
      .gte('scanned_at', new Date(Date.now() - 3600000).toISOString()) // Last hour

    if (existingScans && existingScans.length > 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Duplicate scan',
        message: 'Package already scanned in the last hour',
        shipment 
      }, { status: 409 })
    }

    // Create scan event
    const { data: scanEvent, error: scanError } = await supabase
      .from('scan_events')
      .insert([{
        shipment_id: shipment.id,
        warehouse_id,
        status,
        notes,
        scanned_by: user.id,
        location: warehouse_id ? undefined : 'Manual Entry'
      }])
      .select()
      .single()

    if (scanError) {
      console.error('Scan error:', scanError)
      return NextResponse.json({ error: 'Failed to record scan' }, { status: 500 })
    }

    // Update shipment status if needed
    if (shipment.status !== status) {
      await supabase
        .from('shipments')
        .update({ status })
        .eq('id', shipment.id)
    }

    return NextResponse.json({ 
      success: true,
      scanEvent,
      shipment,
      validation 
    })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')

    const { data, error } = await supabase
      .from('scan_events')
      .select('*')
      .order('scanned_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to fetch scan events' }, { status: 500 })
    }

    return NextResponse.json({ scanEvents: data })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
