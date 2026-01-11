import { test as setup, expect } from '@playwright/test';
import credentials from '../../testsprite_tests/test_credentials.json';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Navigate to login page
  await page.goto(credentials.loginUrl);
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Fill in credentials using the actual input IDs
  await page.fill('#operative-id', credentials.auth.username);
  await page.fill('#security-key', credentials.auth.password);
  
  // Click login button
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard
  await page.waitForURL('**/dashboard**', { timeout: 15000 });
  
  // Verify we're logged in
  await expect(page).toHaveURL(/.*dashboard.*/);
  
  // Save authentication state
  await page.context().storageState({ path: authFile });
});
