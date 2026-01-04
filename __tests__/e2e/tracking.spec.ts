import { test, expect } from '@playwright/test'

test.describe('Public Tracking', () => {
  test('should display tracking search page', async ({ page }) => {
    await page.goto('/track')
    
    await expect(page.getByRole('heading', { name: /track your shipment/i })).toBeVisible()
    await expect(page.getByPlaceholder(/enter awb number/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /track shipment/i })).toBeVisible()
  })

  test('should show error for empty AWB', async ({ page }) => {
    await page.goto('/track')
    
    await page.getByRole('button', { name: /track shipment/i }).click()
    
    await expect(page.getByText(/please enter an awb number/i)).toBeVisible()
  })

  test('should navigate to tracking details page', async ({ page }) => {
    await page.goto('/track')
    
    await page.getByPlaceholder(/enter awb number/i).fill('TAC123456')
    await page.getByRole('button', { name: /track shipment/i }).click()
    
    await expect(page).toHaveURL(/\/track\/TAC123456/)
  })

  test('should display not found for invalid AWB', async ({ page }) => {
    await page.goto('/track/INVALID999')
    
    await expect(page.getByText(/shipment not found/i)).toBeVisible()
  })
})

test.describe('Tracking Details Page', () => {
  test('should display shipment information', async ({ page }) => {
    // This test requires a valid AWB in the database
    // Skip in CI if no test data available
    test.skip(process.env.CI === 'true', 'Requires test data')
    
    await page.goto('/track/TAC100001')
    
    await expect(page.getByText(/TAC100001/)).toBeVisible()
  })

  test('should display tracking history', async ({ page }) => {
    test.skip(process.env.CI === 'true', 'Requires test data')
    
    await page.goto('/track/TAC100001')
    
    await expect(page.getByText(/tracking history/i)).toBeVisible()
  })
})
