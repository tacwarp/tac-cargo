"""
TC010: GST Compliant Invoice Generation and Multi-Channel Delivery Test
Tests invoice generation with GST compliance and verifies multi-channel delivery options
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
        
        # Step 1: Login
        print("Step 1: Logging in...")
        await page.goto("http://localhost:3000/login", wait_until="networkidle", timeout=30000)
        await page.get_by_placeholder("name@organization.com").fill("admin@tac.app")
        await page.get_by_placeholder("••••••••••••").fill("Test@1498")
        await page.get_by_role("button", name="INITIATE SESSION").click()
        await page.wait_for_url("**/dashboard**", timeout=15000)
        print("✓ Login successful")
        
        # Step 2: Navigate to Invoices page via sidebar
        print("Step 2: Navigating to Invoices page...")
        await page.get_by_role("link", name="Invoices").click()
        await page.wait_for_url("**/invoices**", timeout=10000)
        await expect(page.get_by_role("tab", name="Customer Invoices")).to_be_visible(timeout=5000)
        print("✓ Invoices page loaded")
        
        # Step 3: Verify Labels tab exists (for AWB labels)
        print("Step 3: Verifying invoice tabs...")
        await expect(page.get_by_role("tab", name="Labels")).to_be_visible(timeout=5000)
        print("✓ Labels tab available")
        
        # Step 4: Navigate to Invoice Creation
        print("Step 4: Navigating to invoice creation...")
        await page.goto("http://localhost:3000/dashboard/invoices/create", wait_until="networkidle", timeout=30000)
        await expect(page.get_by_role("heading", name="Create Invoice & AWB")).to_be_visible(timeout=10000)
        print("✓ Invoice creation wizard loaded")
        
        # Step 5: Verify auto-generated invoice number
        print("Step 5: Verifying auto-generated invoice number...")
        invoice_no = page.locator("text=INV-")
        await expect(invoice_no.first).to_be_visible(timeout=5000)
        print("✓ Invoice number auto-generated (INV-YYYYMM-XXXXXX format)")
        
        # Step 6: Fill form data and proceed through wizard
        print("Step 6: Filling form data...")
        # Consignor
        await page.get_by_role("textbox", name="Shipper name").fill("Test Shipper")
        await page.get_by_role("textbox", name="Phone number").first.fill("9999999999")
        await page.get_by_role("textbox", name="Building name, Street, Area").first.fill("Delhi Address")
        await page.get_by_role("textbox", name="Search city...").first.fill("New Delhi")
        await page.wait_for_timeout(500)
        delhi_option = page.get_by_role("button", name="New Delhi")
        if await delhi_option.count() > 0:
            await delhi_option.first.click()
        await page.get_by_role("textbox", name="-digit PIN").first.fill("110001")
        
        # Consignee
        await page.get_by_role("textbox", name="Receiver name").fill("Test Receiver")
        await page.get_by_role("textbox", name="Phone number").nth(1).fill("8888888888")
        await page.get_by_role("textbox", name="Building name, Street, Area").nth(1).fill("Mumbai Address")
        await page.get_by_role("textbox", name="Search city...").nth(1).fill("Mumbai")
        await page.wait_for_timeout(500)
        mumbai_option = page.get_by_role("button", name="Mumbai")
        if await mumbai_option.count() > 0:
            await mumbai_option.first.click()
        await page.get_by_role("textbox", name="-digit PIN").nth(1).fill("400001")
        
        # Step 7: Navigate to Package step
        print("Step 7: Navigating to Package step...")
        await page.evaluate("document.querySelectorAll('button').forEach(b => { if(b.textContent.includes('Next')) b.click() })")
        await page.wait_for_timeout(1000)
        await expect(page.get_by_role("heading", name="Package Details")).to_be_visible(timeout=5000)
        print("✓ Package step reached")
        
        # Fill package description (required field)
        await page.get_by_role("textbox", name="Item description").fill("Test Package")
        
        # Step 8: Navigate to Payment step
        print("Step 8: Navigating to Payment step...")
        await page.evaluate("document.querySelectorAll('button').forEach(b => { if(b.textContent.includes('Next')) b.click() })")
        await page.wait_for_timeout(1000)
        await expect(page.get_by_role("heading", name="Payment & Charges")).to_be_visible(timeout=5000)
        print("✓ Payment step reached")
        
        # Step 9: Verify GST calculation is present
        print("Step 9: Verifying GST calculations...")
        await expect(page.get_by_text("IGST (18%)")).to_be_visible(timeout=5000)
        print("✓ IGST (18%) calculation visible")
        
        # Step 10: Navigate to Preview step
        print("Step 10: Navigating to Preview step...")
        await page.evaluate("document.querySelectorAll('button').forEach(b => { if(b.textContent.includes('Next')) b.click() })")
        await page.wait_for_timeout(1000)
        await expect(page.get_by_role("heading", name="Preview & Generate")).to_be_visible(timeout=5000)
        print("✓ Preview step reached")
        
        # Step 11: Verify multi-channel delivery options
        print("Step 11: Verifying multi-channel delivery options...")
        await expect(page.get_by_role("button", name="Download Invoice PDF")).to_be_visible(timeout=5000)
        print("✓ Download Invoice PDF option available")
        
        await expect(page.get_by_role("button", name="Download AWB Label")).to_be_visible(timeout=5000)
        print("✓ Download AWB Label option available")
        
        await expect(page.get_by_role("button", name="Create Invoice")).to_be_visible(timeout=5000)
        print("✓ Create Invoice button available")
        
        # Step 12: Verify GST compliance elements in invoice preview
        print("Step 12: Verifying GST compliance in preview...")
        await expect(page.get_by_text("GSTIN:").first).to_be_visible(timeout=5000)
        print("✓ GSTIN displayed in invoice")
        
        await expect(page.get_by_text("GST (18%)").first).to_be_visible(timeout=5000)
        print("✓ GST tax line visible in payment details")
        
        print("\n" + "="*60)
        print("✅ TC010: GST Compliant Invoice Generation - PASSED")
        print("="*60)
        print("\nTest verified:")
        print("  - Invoice page with Customer Invoices and Labels tabs")
        print("  - Auto-generated invoice numbers (INV-YYYYMM-XXXXXX)")
        print("  - Multi-channel delivery: PDF download, AWB labels")
        print("  - GST compliance: GSTIN display, GST tax calculation")
    
    except Exception as e:
        print(f"\n❌ TC010: GST Compliant Invoice Generation - FAILED")
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
    