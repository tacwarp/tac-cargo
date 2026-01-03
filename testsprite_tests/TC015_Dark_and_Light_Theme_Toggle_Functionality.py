import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Toggle the theme switcher on the dashboard to switch to light mode and verify UI changes.
        frame = context.pages[-1]
        # Toggle the theme switcher button to switch theme from dark to light mode
        elem = frame.locator('xpath=html/body/div[2]/nav/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Verify accessibility of UI elements with keyboard navigation and ARIA attributes in light mode.
        frame = context.pages[-1]
        # Toggle the theme switcher button to switch theme back to dark mode for accessibility testing
        elem = frame.locator('xpath=html/body/div[2]/nav/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Toggle theme')).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Toggle theme')).to_be_enabled(timeout=30000)
        await expect(frame.locator('text=Toggle theme')).to_have_attribute('aria-pressed', 'true', timeout=30000)
        await expect(frame.locator('text=Toggle theme')).to_have_attribute('role', 'switch', timeout=30000)
        await expect(frame.locator('text=Premier Logistics Partner Delivering Certainty For Over 15 Years')).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Customer-first logistics built on experience, precision, and trust.')).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    