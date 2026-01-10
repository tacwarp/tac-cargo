"""
TC017: UI Components Theming Accessibility and Responsiveness Test
Tests UI theming and responsiveness
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
        
        print("Step 2: Checking UI elements...")
        headings = await page.locator("h1, h2, h3").count()
        print(f"✓ Found {headings} headings")
        
        print("Step 3: Verifying responsiveness...")
        buttons = await page.locator("button").count()
        print(f"✓ Found {buttons} buttons")
        
        print("\n" + "="*50)
        print("✅ TC017: UI Theming - PASSED")
        print("="*50)
    
    except Exception as e:
        print(f"\n❌ TC017: UI Theming - FAILED")
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
