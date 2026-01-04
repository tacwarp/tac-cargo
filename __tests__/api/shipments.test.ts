import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      order: vi.fn(() => ({
        range: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: { id: '123' }, error: null })),
      })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: '123' }, error: null })),
        })),
      })),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null })),
    })),
  })),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase)),
}))

describe('Shipments API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/shipments', () => {
    it('should return 401 if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      const { GET } = await import('@/app/api/shipments/route')
      const request = new NextRequest('http://localhost:3000/api/shipments')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return shipments for authenticated user', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@test.com' } },
        error: null,
      })

      const mockShipments = [
        { id: '1', reference: 'TAC001', status: 'pending' },
        { id: '2', reference: 'TAC002', status: 'in_transit' },
      ]

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          order: vi.fn(() => ({
            range: vi.fn(() => Promise.resolve({ data: mockShipments, error: null })),
          })),
        })),
      })

      const { GET } = await import('@/app/api/shipments/route')
      const request = new NextRequest('http://localhost:3000/api/shipments')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.shipments).toBeDefined()
    })
  })

  describe('POST /api/shipments', () => {
    it('should return 401 if not authenticated', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      })

      const { POST } = await import('@/app/api/shipments/route')
      const request = new NextRequest('http://localhost:3000/api/shipments', {
        method: 'POST',
        body: JSON.stringify({}),
      })
      const response = await POST(request)

      expect(response.status).toBe(401)
    })

    it('should return 400 for invalid data', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      })

      const { POST } = await import('@/app/api/shipments/route')
      const request = new NextRequest('http://localhost:3000/api/shipments', {
        method: 'POST',
        body: JSON.stringify({ invalid: 'data' }),
      })
      const response = await POST(request)

      expect(response.status).toBe(400)
    })
  })
})
