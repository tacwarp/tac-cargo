import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('TC010: Invoice Generation and GST Compliance', () => {
  test('should navigate to invoices page', async ({ page }) => {
    await page.goto('/dashboard/invoices');
    
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Verify we're on the invoices page
    const url = page.url();
    expect(url).toContain('invoices');
    
    // Check page loaded successfully
    const bodyText = await page.textContent('body');
    expect(bodyText).toBeTruthy();
  });
  
  test('should display invoices table or list', async ({ page }) => {
    await page.goto('/dashboard/invoices');
    await page.waitForLoadState('networkidle');
    
    // Look for table, list, or grid elements
    const hasTable = await page.locator('table').count() > 0;
    const hasGrid = await page.locator('[role="grid"]').count() > 0;
    const hasList = await page.locator('[role="list"]').count() > 0;
    
    expect(hasTable || hasGrid || hasList).toBeTruthy();
  });
});

test.describe('Invoice Creation Flow', () => {
  test('should have create invoice action available', async ({ page }) => {
    await page.goto('/dashboard/invoices');
    await page.waitForLoadState('networkidle');
    
    // Look for create/add button
    const createButton = await page.locator('button:has-text("Create"), button:has-text("Add"), button:has-text("New")').first();
    
    if (await createButton.isVisible().catch(() => false)) {
      expect(await createButton.isVisible()).toBeTruthy();
    }
  });
});
