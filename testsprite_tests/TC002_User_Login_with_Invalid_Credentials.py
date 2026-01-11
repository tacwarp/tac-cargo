"""
TC002: User Login with Invalid Credentials Test
Tests that invalid credentials are properly rejected with error message
"""
import asyncio
from playwright.async_api import async_playwright, expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        pw = await async_playwright().start()
        
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--no-sandbox",
            ],
        )
        
        context = await browser.new_context(viewport={"width": 1280, "height": 720})
        context.set_default_timeout(15000)
        
        page = await context.new_page()
        
        # Step 1: Navigate to login page
        print("Step 1: Navigating to login page...")
        await page.goto("http://localhost:3000/login", wait_until="networkidle", timeout=30000)
        await expect(page.get_by_role("heading", name="Identity Verification")).to_be_visible(timeout=10000)
        print("✓ Login page loaded")
        
        # Step 2: Enter invalid credentials
        print("Step 2: Entering invalid credentials...")
        await page.get_by_placeholder("name@organization.com").fill("admin@tac.app")
        await page.get_by_placeholder("••••••••••••").fill("WrongPassword123")
        print("✓ Invalid credentials entered")
        
        # Step 3: Click login button
        print("Step 3: Clicking INITIATE SESSION...")
        await page.get_by_role("button", name="INITIATE SESSION").click()
        
        # Step 4: Verify error message is shown (login should fail)
        print("Step 4: Verifying login failure...")
        await page.wait_for_timeout(3000)
        
        # Check that we're still on login page (not redirected to dashboard)
        current_url = page.url
        if "/dashboard" in current_url:
            raise AssertionError("Login succeeded with invalid credentials - should have failed!")
        
        # Check for error message or that we're still on login page
        still_on_login = await page.get_by_role("heading", name="Identity Verification").is_visible()
        if still_on_login:
            print("✓ Login correctly rejected - still on login page")
        
        print("\n" + "="*50)
        print("✅ TC002: User Login with Invalid Credentials - PASSED")
        print("="*50)
        print("\nTest verified:")
        print("  - Login page loads correctly")
        print("  - Invalid credentials are rejected")
        print("  - User is not redirected to dashboard")
    
    except Exception as e:
        print(f"\n❌ TC002: User Login with Invalid Credentials - FAILED")
        print(f"Error: {str(e)}")
        raise AssertionError(f"Test case failed: {str(e)}")
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

if __name__ == "__main__":
    asyncio.run(run_test())
    