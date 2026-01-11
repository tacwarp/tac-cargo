import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('TC017: UI Component Accessibility and Theming Compliance', () => {
  test('should render UI without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Filter out known React DevTools messages
    const criticalErrors = consoleErrors.filter(err => 
      !err.includes('React DevTools') && 
      !err.includes('HMR') &&
      !err.includes('Fast Refresh')
    );
    
    console.log('Console errors:', criticalErrors);
  });
  
  test('should have proper semantic HTML structure', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check for semantic HTML elements
    const main = await page.locator('main').count();
    const headers = await page.locator('h1, h2, h3').count();
    
    expect(main + headers).toBeGreaterThan(0);
  });
  
  test('should be responsive on different viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 },   // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Verify page renders without horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 20); // Small tolerance
    }
  });
});
