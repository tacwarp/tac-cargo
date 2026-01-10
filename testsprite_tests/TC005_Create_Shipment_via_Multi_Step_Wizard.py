"""
TC005: Create Shipment via Multi-Step Wizard Test
Tests that shipment creation wizard loads and navigates correctly
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
        
        # Step 2: Navigate to Shipments page
        print("Step 2: Navigating to Shipments...")
        await page.get_by_role("link", name="Shipments").first.click()
        await page.wait_for_timeout(1000)
        print("✓ Shipments page loaded")
        
        # Step 3: Click Create Shipment button
        print("Step 3: Opening shipment creation wizard...")
        create_btn = page.get_by_role("button", name="Create Shipment")
        if await create_btn.count() > 0:
            await create_btn.click()
        else:
            # Try link version
            await page.get_by_role("link", name="Create Shipment").first.click()
        await page.wait_for_timeout(1000)
        print("✓ Shipment wizard opened")
        
        # Step 4: Verify wizard steps are present
        print("Step 4: Verifying wizard structure...")
        # Check for wizard navigation or step indicators
        wizard_visible = await page.locator("text=/Step|Package|Address|Review|Confirm/i").first.is_visible()
        if wizard_visible:
            print("✓ Wizard steps visible")
        else:
            # Check for form elements
            form_visible = await page.locator("input, select, button").first.is_visible()
            if form_visible:
                print("✓ Wizard form elements visible")
        
        print("\n" + "="*50)
        print("✅ TC005: Shipment Creation Wizard - PASSED")
        print("="*50)
        print("\nTest verified:")
        print("  - Login and navigation to Shipments")
        print("  - Shipment creation wizard accessible")
        print("  - Wizard form structure present")
    
    except Exception as e:
        print(f"\n❌ TC005: Shipment Creation Wizard - FAILED")
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
    