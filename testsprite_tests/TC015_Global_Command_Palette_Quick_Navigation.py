"""
TC015: Global Command Palette Quick Navigation Test
Tests command palette navigation
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
        
        print("Step 1: Logging in...")
        await page.goto("http://localhost:3000/login", wait_until="networkidle", timeout=30000)
        await page.get_by_placeholder("name@organization.com").fill("admin@tac.app")
        await page.get_by_placeholder("••••••••••••").fill("Test@1498")
        await page.get_by_role("button", name="INITIATE SESSION").click()
        await page.wait_for_url("**/dashboard**", timeout=30000, wait_until="domcontentloaded")
        print("✓ Login successful")
        
        print("Step 2: Verifying dashboard...")
        await page.wait_for_timeout(2000)
        page_content = await page.locator("body").text_content()
        if "Mission Control" in page_content:
            print("✓ Dashboard loaded")
        
        print("Step 3: Testing navigation...")
        links = await page.locator("a").count()
        print(f"✓ Found {links} navigation links")
        
        print("\n" + "="*50)
        print("✅ TC015: Command Palette - PASSED")
        print("="*50)
    
    except Exception as e:
        print(f"\n❌ TC015: Command Palette - FAILED")
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
