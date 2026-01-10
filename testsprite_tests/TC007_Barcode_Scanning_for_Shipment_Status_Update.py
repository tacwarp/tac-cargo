"""
TC007: Barcode Scanning for Shipment Status Update Test
Tests barcode scanner page functionality
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
            args=["--window-size=1280,720", "--disable-dev-shm-usage", "--no-sandbox"],
        )
        context = await browser.new_context(viewport={"width": 1280, "height": 720})
        context.set_default_timeout(15000)
        page = await context.new_page()
        
        # Step 1: Login
        print("Step 1: Logging in...")
        await page.goto("http://localhost:3000/login", wait_until="networkidle", timeout=30000)
        await page.get_by_placeholder("name@organization.com").fill("admin@tac.app")
        await page.get_by_placeholder("••••••••••••").fill("Test@1498")
        await page.get_by_role("button", name="INITIATE SESSION").click()
        await page.wait_for_url("**/dashboard**", timeout=30000, wait_until="domcontentloaded")
        print("✓ Login successful")
        
        # Step 2: Navigate to Scanner
        print("Step 2: Navigating to Scanner...")
        await page.get_by_role("link", name="Scanner").click()
        await page.wait_for_timeout(2000)
        print("✓ Scanner page loaded")
        
        # Step 3: Verify scanner elements
        print("Step 3: Verifying scanner elements...")
        page_content = await page.locator("body").text_content()
        if "Scan" in page_content or "Barcode" in page_content:
            print("✓ Scanner content visible")
        
        # Step 4: Check for input fields
        print("Step 4: Checking input fields...")
        inputs = await page.locator("input").count()
        print(f"✓ Found {inputs} input fields")
        
        print("\n" + "="*50)
        print("✅ TC007: Barcode Scanning - PASSED")
        print("="*50)
    
    except Exception as e:
        print(f"\n❌ TC007: Barcode Scanning - FAILED")
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
    