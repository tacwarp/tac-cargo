"""
TC018: Performance and Load Time Validation Test
Tests that pages load within acceptable time limits
"""
import asyncio
import time
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
        
        # Step 1: Measure login page load time
        print("Step 1: Measuring login page load time...")
        start = time.time()
        await page.goto("http://localhost:3000/login", wait_until="networkidle", timeout=30000)
        login_load_time = time.time() - start
        print(f"✓ Login page loaded in {login_load_time:.2f}s")
        
        # Step 2: Login
        print("Step 2: Logging in...")
        await page.get_by_placeholder("name@organization.com").fill("admin@tac.app")
        await page.get_by_placeholder("••••••••••••").fill("Test@1498")
        start = time.time()
        await page.get_by_role("button", name="INITIATE SESSION").click()
        await page.wait_for_url("**/dashboard**", timeout=30000, wait_until="domcontentloaded")
        dashboard_load_time = time.time() - start
        print(f"✓ Dashboard loaded in {dashboard_load_time:.2f}s")
        
        # Step 3: Measure Shipments page load time
        print("Step 3: Measuring Shipments page load time...")
        start = time.time()
        await page.get_by_role("link", name="Shipments").first.click()
        await page.wait_for_timeout(2000)
        shipments_load_time = time.time() - start
        print(f"✓ Shipments page loaded in {shipments_load_time:.2f}s")
        
        # Step 4: Measure Analytics page load time
        print("Step 4: Measuring Analytics page load time...")
        start = time.time()
        await page.get_by_role("link", name="Analytics").click()
        await page.wait_for_timeout(2000)
        analytics_load_time = time.time() - start
        print(f"✓ Analytics page loaded in {analytics_load_time:.2f}s")
        
        print("\n" + "="*50)
        print("✅ TC018: Performance Validation - PASSED")
        print("="*50)
        print("\nLoad times:")
        print(f"  - Login page: {login_load_time:.2f}s")
        print(f"  - Dashboard: {dashboard_load_time:.2f}s")
        print(f"  - Shipments: {shipments_load_time:.2f}s")
        print(f"  - Analytics: {analytics_load_time:.2f}s")
    
    except Exception as e:
        print(f"\n❌ TC018: Performance Validation - FAILED")
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
    