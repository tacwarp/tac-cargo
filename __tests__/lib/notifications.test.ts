import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ 
            data: { organization_id: 'org-123' }, 
            error: null 
          })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ 
            data: { id: 'notif-123' }, 
            error: null 
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  })),
}))

describe('Notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createNotification', () => {
    it('should create a notification', async () => {
      const { createNotification } = await import('@/lib/notifications')
      
      const result = await createNotification({
        userId: 'user-123',
        title: 'Test Notification',
        message: 'This is a test',
        type: 'info',
      })

      expect(result).toBe('notif-123')
    })
  })

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const { markAsRead } = await import('@/lib/notifications')
      
      const result = await markAsRead('notif-123', 'user-123')
      
      expect(result).toBe(true)
    })
  })

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const { markAllAsRead } = await import('@/lib/notifications')
      
      const result = await markAllAsRead('user-123')
      
      expect(result).toBe(true)
    })
  })
})
