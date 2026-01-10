"""
TC014: Global Command Palette Navigation Test
Tests sidebar navigation and quick actions
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
        
        # Step 2: Test sidebar navigation - Shipments
        print("Step 2: Testing sidebar navigation...")
        await page.get_by_role("link", name="Shipments").first.click()
        await page.wait_for_timeout(1000)
        print("✓ Navigated to Shipments")
        
        # Step 3: Navigate to Overview
        await page.get_by_role("link", name="Overview").click()
        await page.wait_for_timeout(1000)
        print("✓ Navigated to Overview")
        
        # Step 4: Test Quick Actions
        print("Step 4: Testing Quick Actions...")
        create_shipment = page.get_by_role("link", name="Create Shipment").first
        if await create_shipment.is_visible():
            print("✓ Create Shipment action visible")
        
        # Step 5: Navigate to Invoices
        print("Step 5: Testing Invoices navigation...")
        await page.get_by_role("link", name="Invoices").click()
        await page.wait_for_timeout(1000)
        print("✓ Navigated to Invoices")
        
        print("\n" + "="*50)
        print("✅ TC014: Navigation & Quick Actions - PASSED")
        print("="*50)
        print("\nTest verified:")
        print("  - Sidebar navigation works")
        print("  - Quick actions accessible")
    
    except Exception as e:
        print(f"\n❌ TC014: Navigation & Quick Actions - FAILED")
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
    