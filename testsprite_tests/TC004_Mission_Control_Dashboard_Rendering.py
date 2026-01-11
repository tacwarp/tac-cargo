"""
TC004: Mission Control Dashboard Rendering Test
Tests that dashboard renders with all key UI elements
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
        await page.wait_for_timeout(2000)
        print("✓ Login successful")
        
        # Step 2: Verify dashboard header
        print("Step 2: Verifying dashboard header...")
        await expect(page.get_by_text("Mission Control")).to_be_visible(timeout=10000)
        print("✓ Mission Control header visible")
        
        # Step 3: Verify stats cards
        print("Step 3: Verifying stats cards...")
        await expect(page.get_by_text("Total Shipments").first).to_be_visible(timeout=10000)
        await expect(page.get_by_text("Delivery Rate").first).to_be_visible(timeout=10000)
        print("✓ Stats cards visible")
        
        # Step 4: Verify Shipment Pipeline
        print("Step 4: Verifying Shipment Pipeline...")
        await expect(page.get_by_text("Shipment Pipeline")).to_be_visible(timeout=10000)
        print("✓ Shipment Pipeline visible")
        
        # Step 5: Verify Recent Activity
        print("Step 5: Verifying Recent Activity...")
        await expect(page.get_by_text("Recent Activity")).to_be_visible(timeout=10000)
        print("✓ Recent Activity visible")
        
        print("\n" + "="*50)
        print("✅ TC004: Dashboard Rendering - PASSED")
        print("="*50)
    
    except Exception as e:
        print(f"\n❌ TC004: Dashboard Rendering - FAILED")
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
    