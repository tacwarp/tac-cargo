"""
TC001: User Authentication Success Test
Tests successful login flow with valid admin credentials
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
        
        # Step 2: Enter valid credentials
        print("Step 2: Entering valid credentials...")
        await page.get_by_placeholder("name@organization.com").fill("admin@tac.app")
        await page.get_by_placeholder("••••••••••••").fill("Test@1498")
        print("✓ Credentials entered")
        
        # Step 3: Click login button
        print("Step 3: Clicking INITIATE SESSION...")
        await page.get_by_role("button", name="INITIATE SESSION").click()
        
        # Step 4: Verify redirect to dashboard
        print("Step 4: Verifying dashboard redirect...")
        await page.wait_for_url("**/dashboard**", timeout=30000, wait_until="domcontentloaded")
        await page.wait_for_timeout(2000)  # Allow page to settle
        print("✓ Redirected to dashboard")
        
        # Step 5: Verify dashboard elements are visible
        print("Step 5: Verifying dashboard elements...")
        
        # Check for Mission Control header
        await expect(page.get_by_text("Mission Control")).to_be_visible(timeout=10000)
        print("✓ Mission Control header visible")
        
        # Check for greeting (any time-based greeting)
        greeting = page.locator("text=/Good (morning|afternoon|evening), there!/")
        await expect(greeting.first).to_be_visible(timeout=10000)
        print("✓ Welcome greeting visible")
        
        # Check for Create Shipment button
        await expect(page.get_by_role("link", name="Create Shipment").first).to_be_visible(timeout=10000)
        print("✓ Create Shipment button visible")
        
        # Check for Shipment Pipeline section
        await expect(page.get_by_text("Shipment Pipeline")).to_be_visible(timeout=10000)
        print("✓ Shipment Pipeline section visible")
        
        # Check for Recent Activity section
        await expect(page.get_by_text("Recent Activity")).to_be_visible(timeout=10000)
        print("✓ Recent Activity section visible")
        
        print("\n" + "="*50)
        print("✅ TC001: User Authentication Success - PASSED")
        print("="*50)
        print("\nTest verified:")
        print("  - Login page loads correctly")
        print("  - Valid credentials accepted")
        print("  - Redirect to dashboard after login")
        print("  - Dashboard elements displayed correctly")
    
    except Exception as e:
        print(f"\n❌ TC001: User Authentication Success - FAILED")
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
    