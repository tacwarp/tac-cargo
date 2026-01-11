import { test, expect } from '@playwright/test';
import credentials from '../../testsprite_tests/test_credentials.json';

test.describe('TC001: User Authentication Success', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto(credentials.loginUrl);
    await page.waitForLoadState('networkidle');
    
    // Enter valid credentials using correct IDs
    await page.fill('#operative-id', credentials.auth.username);
    await page.fill('#security-key', credentials.auth.password);
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 15000 });
    
    // Verify dashboard loaded
    await expect(page).toHaveURL(/.*dashboard.*/);
    
    // Verify dashboard components are visible
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });
});

test.describe('TC002: User Authentication Failure', () => {
  test('should fail login with invalid credentials', async ({ page }) => {
    await page.goto(credentials.loginUrl);
    
    // Enter invalid credentials
    await page.fill('input[type="email"], input[name="email"]', 'invalid@test.com');
    await page.fill('input[type="password"], input[name="password"]', 'wrongpassword');
    
    // Click login button
    await page.click('button[type="submit"]');
    
    // Wait a bit for error message
    await page.waitForTimeout(2000);
    
    // Verify user remains on login page
    await expect(page).toHaveURL(/.*login.*/);
  });
});

test.describe('TC019: Session Expiration and Secure Redirects', () => {
  test('should redirect to login when accessing protected route without auth', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');
    
    // Should be redirected to login
    await page.waitForURL('**/login**', { timeout: 5000 });
    await expect(page).toHaveURL(/.*login.*/);
  });
});
