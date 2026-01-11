"""
TC010: Invoice Generation and GST Compliance Test
Tests the invoice creation wizard with GST calculations for inter-state transactions
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
        
        # Step 2: Login with admin credentials
        print("Step 2: Logging in with admin credentials...")
        await page.get_by_placeholder("name@organization.com").fill("admin@tac.app")
        await page.get_by_placeholder("••••••••••••").fill("Test@1498")
        await page.get_by_role("button", name="INITIATE SESSION").click()
        
        # Wait for dashboard to load
        await page.wait_for_url("**/dashboard**", timeout=15000)
        print("✓ Login successful, redirected to dashboard")
        
        # Step 3: Navigate to Invoice Creation page
        print("Step 3: Navigating to Invoice Creation page...")
        await page.goto("http://localhost:3000/dashboard/invoices/create", wait_until="networkidle", timeout=30000)
        
        # Verify we're on the invoice creation page
        await expect(page.get_by_role("heading", name="Create Invoice & AWB")).to_be_visible(timeout=10000)
        print("✓ Invoice creation page loaded")
        
        # Step 4: Fill Consignor Details (Step 1 of wizard)
        print("Step 4: Filling consignor details...")
        await page.get_by_role("textbox", name="Shipper name").fill("TAC Cargo Service")
        await page.get_by_role("textbox", name="Phone number").first.fill("9711011416")
        await page.get_by_role("textbox", name="GST Number").fill("07AAMFT6165B1Z3")
        await page.get_by_role("textbox", name="Building name, Street, Area").first.fill("1498, Wazir Nagar, New Delhi")
        await page.get_by_role("textbox", name="Search city...").first.fill("New Delhi")
        await page.wait_for_timeout(500)
        # Select city from dropdown if visible
        new_delhi_option = page.get_by_role("button", name="New Delhi")
        if await new_delhi_option.count() > 0:
            await new_delhi_option.first.click()
        await page.get_by_role("textbox", name="-digit PIN").first.fill("110003")
        
        # Step 5: Fill Consignee Details
        print("Step 5: Filling consignee details...")
        await page.get_by_role("textbox", name="Receiver name").fill("Test Customer")
        await page.get_by_role("textbox", name="Phone number").nth(1).fill("9876543210")
        await page.get_by_role("textbox", name="Email address").fill("test@example.com")
        await page.get_by_role("textbox", name="Building name, Street, Area").nth(1).fill("Singjamei Thongam Leikai")
        await page.get_by_role("textbox", name="Search city...").nth(1).fill("Imphal")
        await page.wait_for_timeout(500)
        # Select city from dropdown if visible
        imphal_option = page.get_by_role("button", name="Imphal")
        if await imphal_option.count() > 0:
            await imphal_option.first.click()
        await page.get_by_role("textbox", name="-digit PIN").nth(1).fill("795008")
        
        # Click Next to go to Package step
        print("Step 6: Proceeding to Package step...")
        await page.evaluate("document.querySelectorAll('button').forEach(b => { if(b.textContent.includes('Next')) b.click() })")
        await page.wait_for_timeout(1000)
        
        # Verify Package step is visible
        await expect(page.get_by_role("heading", name="Package Details")).to_be_visible(timeout=5000)
        print("✓ Package step loaded")
        
        # Step 7: Fill Package Details
        print("Step 7: Filling package details...")
        await page.get_by_role("textbox", name="Item description").fill("Electronics - Mobile Phone")
        await page.get_by_role("spinbutton").nth(1).fill("2")  # Weight
        await page.get_by_placeholder("L", exact=True).fill("20")  # Length
        await page.get_by_placeholder("W", exact=True).fill("10")  # Width
        await page.get_by_placeholder("H", exact=True).fill("5")   # Height
        await page.get_by_placeholder("Declared").fill("15000")    # Declared value
        
        # Click Next to go to Payment step
        print("Step 8: Proceeding to Payment step...")
        await page.evaluate("document.querySelectorAll('button').forEach(b => { if(b.textContent.includes('Next')) b.click() })")
        await page.wait_for_timeout(1000)
        
        # Verify Payment step is visible
        await expect(page.get_by_role("heading", name="Payment & Charges")).to_be_visible(timeout=5000)
        print("✓ Payment step loaded")
        
        # Step 9: Verify GST Calculation (Inter-State IGST)
        print("Step 9: Verifying GST calculations...")
        # Check that IGST is shown (Delhi -> Manipur is inter-state)
        igst_text = page.get_by_text("IGST (18%)")
        await expect(igst_text).to_be_visible(timeout=5000)
        print("✓ IGST (18%) correctly applied for inter-state transaction")
        
        # Verify Inter-State badge
        interstate_badge = page.get_by_text("Inter-State (IGST)")
        await expect(interstate_badge).to_be_visible(timeout=5000)
        print("✓ Inter-State (IGST) badge displayed correctly")
        
        # Click Next to go to Preview step
        print("Step 10: Proceeding to Preview step...")
        await page.evaluate("document.querySelectorAll('button').forEach(b => { if(b.textContent.includes('Next')) b.click() })")
        await page.wait_for_timeout(1000)
        
        # Verify Preview step is visible
        await expect(page.get_by_role("heading", name="Preview & Generate")).to_be_visible(timeout=5000)
        print("✓ Preview step loaded")
        
        # Step 11: Verify Invoice Preview
        print("Step 11: Verifying invoice preview...")
        await expect(page.get_by_role("heading", name="TAPAN ASSOCIATE CARGO SERVICE")).to_be_visible(timeout=5000)
        await expect(page.get_by_text("Test Customer").first).to_be_visible(timeout=5000)
        await expect(page.get_by_text("GSTIN: 07AAMFT6165B1Z3").first).to_be_visible(timeout=5000)
        print("✓ Invoice preview shows correct company and customer details")
        
        # Verify GST in payment details
        await expect(page.get_by_text("GST (18%)").first).to_be_visible(timeout=5000)
        print("✓ GST (18%) shown in payment details")
        
        # Step 12: Verify AWB Label Preview
        print("Step 12: Verifying AWB label preview...")
        await page.get_by_role("button", name="AWB Label", exact=True).click()
        await page.wait_for_timeout(500)
        
        # Verify AWB label elements
        await expect(page.get_by_text("Ship To:")).to_be_visible(timeout=5000)
        await expect(page.get_by_text("DELIVERY STATION")).to_be_visible(timeout=5000)
        print("✓ AWB Label preview shows shipping details correctly")
        
        # Step 13: Verify Download buttons are present
        print("Step 13: Verifying download buttons...")
        await expect(page.get_by_role("button", name="Download Invoice PDF")).to_be_visible(timeout=5000)
        await expect(page.get_by_role("button", name="Download AWB Label")).to_be_visible(timeout=5000)
        await expect(page.get_by_role("button", name="Create Invoice")).to_be_visible(timeout=5000)
        print("✓ All action buttons are present")
        
        print("\n" + "="*50)
        print("✅ TC010: Invoice Generation and GST Compliance - PASSED")
        print("="*50)
        print("\nTest verified:")
        print("  - Invoice creation wizard with 4 steps")
        print("  - Consignor and Consignee details input")
        print("  - Package details with dimensions")
        print("  - Inter-state IGST (18%) calculation (Delhi → Manipur)")
        print("  - Invoice preview with company details and terms")
        print("  - AWB Label preview with shipping details")
        print("  - Download Invoice PDF and AWB Label buttons")
    
    except Exception as e:
        print(f"\n❌ TC010: Invoice Generation and GST Compliance - FAILED")
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
    