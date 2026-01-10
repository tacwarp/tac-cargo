"""
TC004: Mission Control Dashboard Loads with Real-Time Data Test
Tests that dashboard loads with all key sections and real-time data
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
        
        # Step 2: Verify Mission Control header
        print("Step 2: Verifying Mission Control header...")
        await expect(page.get_by_text("Mission Control")).to_be_visible(timeout=10000)
        print("✓ Mission Control header visible")
        
        # Step 3: Verify greeting (time-based)
        print("Step 3: Verifying welcome greeting...")
        greeting = page.locator("text=/Good (morning|afternoon|evening), there!/")
        await expect(greeting.first).to_be_visible(timeout=10000)
        print("✓ Welcome greeting visible")
        
        # Step 4: Verify stats cards are present
        print("Step 4: Verifying stats cards...")
        await expect(page.get_by_text("Total Shipments").first).to_be_visible(timeout=10000)
        await expect(page.get_by_text("In Transit").first).to_be_visible(timeout=10000)
        await expect(page.get_by_text("Revenue").first).to_be_visible(timeout=10000)
        await expect(page.get_by_text("Delivery Rate").first).to_be_visible(timeout=10000)
        print("✓ Stats cards visible")
        
        # Step 5: Verify Shipment Pipeline section
        print("Step 5: Verifying Shipment Pipeline...")
        await expect(page.get_by_text("Shipment Pipeline")).to_be_visible(timeout=10000)
        await expect(page.locator("button:has-text('Pending')").first).to_be_visible(timeout=10000)
        await expect(page.locator("button:has-text('In Transit')").first).to_be_visible(timeout=10000)
        await expect(page.locator("button:has-text('Delivered')").first).to_be_visible(timeout=10000)
        print("✓ Shipment Pipeline visible")
        
        # Step 6: Verify Recent Activity section
        print("Step 6: Verifying Recent Activity...")
        await expect(page.get_by_text("Recent Activity")).to_be_visible(timeout=10000)
        print("✓ Recent Activity visible")
        
        # Step 7: Verify Quick Actions
        print("Step 7: Verifying Quick Actions...")
        await expect(page.get_by_text("Quick Actions")).to_be_visible(timeout=10000)
        await expect(page.get_by_role("link", name="Create Shipment").first).to_be_visible(timeout=10000)
        await expect(page.get_by_role("link", name="New Manifest")).to_be_visible(timeout=10000)
        await expect(page.get_by_role("link", name="Scan Barcode")).to_be_visible(timeout=10000)
        await expect(page.get_by_role("link", name="Generate Invoice")).to_be_visible(timeout=10000)
        await expect(page.get_by_role("link", name="Track Shipment")).to_be_visible(timeout=10000)
        print("✓ Quick Actions visible")
        
        print("\n" + "="*60)
        print("✅ TC004: Mission Control Dashboard - PASSED")
        print("="*60)
        print("\nTest verified:")
        print("  - Dashboard loads after login")
        print("  - Stats cards display (Shipments, Revenue, Delivery Rate)")
        print("  - Shipment Pipeline with status buttons")
        print("  - Recent Activity section")
        print("  - Quick Actions (Create Shipment, Manifest, Invoice, etc.)")
    
    except Exception as e:
        print(f"\n❌ TC004: Mission Control Dashboard - FAILED")
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
    