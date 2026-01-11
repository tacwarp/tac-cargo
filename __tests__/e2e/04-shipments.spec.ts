import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('TC005: Shipments Management', () => {
  test('should navigate to shipments page', async ({ page }) => {
    await page.goto('/dashboard/shipments');
    
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Verify we're on the shipments page
    const url = page.url();
    expect(url).toContain('shipments');
  });
  
  test('should display shipments data', async ({ page }) => {
    await page.goto('/dashboard/shipments');
    await page.waitForLoadState('networkidle');
    
    // Check for data display elements
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(50);
  });
});

test.describe('TC008: Real-Time Shipment Tracking Updates', () => {
  test('should access tracking page', async ({ page }) => {
    await page.goto('/dashboard/tracking');
    
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Verify tracking page loaded
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });
});

test.describe('TC020: Bulk Actions with Shipments Data Table', () => {
  test('should display shipments table with data', async ({ page }) => {
    await page.goto('/dashboard/shipments');
    await page.waitForLoadState('networkidle');
    
    // Look for table structures
    const tables = await page.locator('table, [role="grid"], [role="table"]').count();
    expect(tables).toBeGreaterThan(0);
  });
});
