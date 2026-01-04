import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { name, url, events, secret } = body

    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('webhooks')
      .insert({
        organization_id: profile.organization_id,
        name,
        url,
        events: events || ['shipment.created', 'shipment.delivered'],
        secret,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Webhook creation error:', error)
      return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) {
      return NextResponse.json({ webhooks: [] })
    }

    const { data, error } = await supabase
      .from('webhooks')
      .select('id, name, url, events, is_active, last_triggered_at, failure_count, created_at')
      .eq('organization_id', profile.organization_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Webhook fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 })
    }

    return NextResponse.json({ webhooks: data })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Webhook ID is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Webhook deletion error:', error)
      return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
