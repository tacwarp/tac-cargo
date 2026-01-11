import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Invoice Test Endpoint for TestSprite
 * GET /api/test/invoices - Get test invoices
 * POST /api/test/invoices - Create test invoice
 */

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');

    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: invoices?.length || 0,
      invoices: invoices || [],
    });
  } catch (err) {
    console.error('Get invoices error:', err);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized',
      }, { status: 401 });
    }

    const body = await request.json();
    
    // Get organization ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single();

    const testInvoice = {
      organization_id: profile?.organization_id,
      created_by: user.id,
      invoice_no: `TEST-${Date.now()}`,
      invoice_date: new Date().toISOString(),
      consignor_name: body.consignor_name || 'Test Consignor',
      consignee_name: body.consignee_name || 'Test Consignee',
      transport_mode: body.transport_mode || 'air',
      payment_mode: body.payment_mode || 'PREPAID',
      total_amount: body.total_amount || 1000,
      status: body.status || 'pending',
      ...body,
    };

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert(testInvoice)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      invoice,
    }, { status: 201 });
  } catch (err) {
    console.error('Create invoice error:', err);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
