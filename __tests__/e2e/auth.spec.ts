import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page.getByRole('heading', { name: /sign in|login|welcome/i })).toBeVisible()
  })

  test('should redirect unauthenticated users from dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    
    await expect(page).toHaveURL(/\/login/)
  })

  test('should preserve redirect URL on login redirect', async ({ page }) => {
    await page.goto('/dashboard/shipments')
    
    await expect(page).toHaveURL(/\/login\?redirect=/)
  })
})

test.describe('Protected Routes', () => {
  test('dashboard requires authentication', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('shipments page requires authentication', async ({ page }) => {
    await page.goto('/dashboard/shipments')
    await expect(page).toHaveURL(/\/login/)
  })

  test('invoices page requires authentication', async ({ page }) => {
    await page.goto('/dashboard/invoices')
    await expect(page).toHaveURL(/\/login/)
  })
})
