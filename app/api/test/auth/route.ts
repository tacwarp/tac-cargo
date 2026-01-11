import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Authentication Test Endpoint for TestSprite
 * POST /api/test/auth - Test login
 * GET /api/test/auth - Check auth status
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 });
    }

    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: data.user?.role,
      },
      session: {
        access_token: data.session?.access_token?.substring(0, 20) + '...',
        expires_at: data.session?.expires_at,
      }
    });
  } catch (err) {
    console.error('Auth test error:', err);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({
        authenticated: false,
        error: error?.message || 'Not authenticated',
      }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    console.error('Auth check error:', err);
    return NextResponse.json({
      authenticated: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    console.error('Logout error:', err);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
}
