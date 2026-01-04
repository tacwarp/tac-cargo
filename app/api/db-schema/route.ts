import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    // Validate environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Require authentication to prevent unauthorized schema inspection
    const authClient = await createServerClient()
    const { data: { user }, error: authError } = await authClient.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get actual shipments data to see columns
    const { data: shipments, error: shipmentsError } = await supabase
      .from('shipments')
      .select('id, reference, status')
      .limit(3)

    // Check invoices table structure
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .limit(1)

    // Check if shipment_exceptions exists
    const { data: exceptions, error: exceptionsError } = await supabase
      .from('shipment_exceptions')
      .select('*')
      .limit(1)

    // Check if payments exists
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .limit(1)

    // Check profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    return NextResponse.json({
      tables: {
        shipments: {
          exists: !shipmentsError?.message?.includes('does not exist'),
          sample: shipments?.[0] ? Object.keys(shipments[0]) : null,
          error: shipmentsError?.message
        },
        invoices: {
          exists: !invoicesError?.message?.includes('does not exist'),
          sample: invoices?.[0] ? Object.keys(invoices[0]) : null,
          error: invoicesError?.message
        },
        shipment_exceptions: {
          exists: !exceptionsError?.message?.includes('does not exist'),
          sample: exceptions?.[0] ? Object.keys(exceptions[0]) : null,
          error: exceptionsError?.message
        },
        payments: {
          exists: !paymentsError?.message?.includes('does not exist'),
          sample: payments?.[0] ? Object.keys(payments[0]) : null,
          error: paymentsError?.message
        },
        profiles: {
          exists: !profilesError?.message?.includes('does not exist'),
          sample: profiles?.[0] ? Object.keys(profiles[0]) : null,
          error: profilesError?.message
        }
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
