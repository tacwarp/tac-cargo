import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint for TestSprite
 * GET /api/test/health
 */
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TAC Cargo',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    uptime: process.uptime(),
    endpoints: {
      health: '/api/test/health',
      auth: '/api/test/auth',
      invoices: '/api/test/invoices',
      shipments: '/api/test/shipments',
      data: '/api/test/data',
    }
  });
}
