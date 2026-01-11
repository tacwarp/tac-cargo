import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Navigation and Routing', () => {
  const routes = [
    '/dashboard',
    '/dashboard/invoices',
    '/dashboard/shipments',
    '/dashboard/tracking',
    '/dashboard/manifests',
    '/dashboard/analytics',
    '/dashboard/payments',
  ];
  
  for (const route of routes) {
    test(`should successfully navigate to ${route}`, async ({ page }) => {
      await page.goto(route);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle', { timeout: 15000 });
      
      // Verify navigation was successful
      const url = page.url();
      expect(url).toContain(route.split('/').pop()!);
      
      // Verify page has content
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
      expect(bodyText!.length).toBeGreaterThan(10);
    });
  }
});

test.describe('TC015: Global Command Palette Quick Navigation', () => {
  test('should have navigation menu or sidebar', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Look for navigation elements
    const nav = await page.locator('nav, [role="navigation"]').count();
    expect(nav).toBeGreaterThan(0);
  });
});
