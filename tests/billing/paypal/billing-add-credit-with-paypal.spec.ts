import { test } from '../../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { BillingPage } from '../../../pages/BillingPage';
import { ENDPOINTS } from '../../../constants/endpoints';
import { loginAndGetToken } from '../../../utils/auth';
import { PAYPAL_TEST_DATA } from '../../../utils/testData';

test.describe('Billing Page, Add Credit with PayPal', () => {
  let billingPage: BillingPage;

  test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);
    await billingPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.BILLING), {timeout: 60000});
  });

  test('P0 - should add credit by PayPal successfully', async ({ context, page }) => {
    test.setTimeout(180000); // 3 minutes for PayPal flow
    
    // Use PayPal test data for payment
    const paymentData = PAYPAL_TEST_DATA.validPayPal;
    const token = await page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    // Get initial invoice records
    const invoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const invoiceRecords = await invoiceResponse.json();
    const initialTotal = invoiceRecords.data?.total_invoices || 0;
    console.log('Initial total invoices:', initialTotal);
    
    // Add credit by PayPal using the complete flow
    await billingPage.addCreditByPayPal(paymentData);

    // Wait for invoice to be created and retry if needed
    let newTotal = initialTotal;
    let retryCount = 0;
    const maxRetries = 5;
    
    while (newTotal === initialTotal && retryCount < maxRetries) {
      await page.waitForTimeout(2000); // Wait 2 seconds
      
      const newInvoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const newInvoiceRecords = await newInvoiceResponse.json();
      newTotal = newInvoiceRecords.data?.total_invoices || 0;
      
      console.log(`Retry ${retryCount + 1}: New total invoices: ${newTotal}`);
      retryCount++;
    }

    // Verify new invoice record was created
    console.log(`Final comparison: Expected ${initialTotal + 1}, Got ${newTotal}`);
    expect(newTotal).toBe(initialTotal + 1);

    await page.reload();

    // Wait for invoice table to load and verify invoice record
    await page.waitForSelector('.transaction-container .el-table tbody tr', { timeout: 10000 });
    
    const firstInvoiceRecord = page.locator('.transaction-container .el-table tbody tr:first-child').first();
    await expect(firstInvoiceRecord).toBeVisible({ timeout: 10000 });
    await expect(firstInvoiceRecord).toContainText('Reload');
    await expect(firstInvoiceRecord).toContainText(`$${paymentData.amount}`);
  });

  test('should handle PayPal payment cancellation and verify no invoice created', async ({ context, page }) => {
    test.setTimeout(120000);
    
    const token = await page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    // Get initial invoice records
    const invoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const invoiceRecords = await invoiceResponse.json();
    const initialTotal = invoiceRecords.data?.total_invoices || 0;
    console.log('Initial total invoices before cancellation:', initialTotal);
    
    // Start PayPal payment flow but cancel it
    await billingPage.clickAddCredits();
    await billingPage.selectCreditAmount(PAYPAL_TEST_DATA.validPayPal.amount);
    await billingPage.payWithPayPal();
    await billingPage.verifyPayPalLoginPage();
    
    // Cancel the payment
    await billingPage.cancelPayPalPayment();
    
    // Verify we're back on billing page
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.BILLING));
    
    // Wait a bit and verify no new invoice was created
    await page.waitForTimeout(3000);
    
    const finalInvoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const finalInvoiceRecords = await finalInvoiceResponse.json();
    const finalTotal = finalInvoiceRecords.data?.total_invoices || 0;
    
    console.log(`Final comparison after cancellation: Expected ${initialTotal}, Got ${finalTotal}`);
    expect(finalTotal).toBe(initialTotal);
  });

  test('should handle PayPal payment error and verify no invoice created', async ({ context, page }) => {
    test.setTimeout(120000);
    
    const token = await page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    // Get initial invoice records
    const invoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const invoiceRecords = await invoiceResponse.json();
    const initialTotal = invoiceRecords.data?.total_invoices || 0;
    console.log('Initial total invoices before error:', initialTotal);
    
    // Start PayPal payment flow with invalid credentials
    await billingPage.clickAddCredits();
    await billingPage.selectCreditAmount(PAYPAL_TEST_DATA.validPayPal.amount);
    await billingPage.payWithPayPal();
    await billingPage.verifyPayPalLoginPage();
    
    // Enter invalid credentials to trigger error
    await billingPage.enterPayPalCredentials(
      PAYPAL_TEST_DATA.invalidCredentials.paypalEmail, 
      PAYPAL_TEST_DATA.invalidCredentials.paypalPassword
    );
    
    // Verify error message appears
    await billingPage.verifyPayPalPaymentError(PAYPAL_TEST_DATA.invalidCredentials.expectedError);
    
    // Wait a bit and verify no new invoice was created
    await page.waitForTimeout(3000);
    
    const finalInvoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const finalInvoiceRecords = await finalInvoiceResponse.json();
    const finalTotal = finalInvoiceRecords.data?.total_invoices || 0;
    
    console.log(`Final comparison after error: Expected ${initialTotal}, Got ${finalTotal}`);
    expect(finalTotal).toBe(initialTotal);
  });

  test('should verify PayPal payment creates correct invoice amount', async ({ context, page }) => {
    test.setTimeout(180000);
    
    const paymentData = PAYPAL_TEST_DATA.validPayPal;
    const token = await page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    // Get initial invoice records
    const invoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const invoiceRecords = await invoiceResponse.json();
    const initialInvoices = invoiceRecords.data?.invoices || [];
    
    // Add credit by PayPal
    await billingPage.addCreditByPayPal(paymentData);

    // Wait for invoice to be created
    let newInvoices = initialInvoices;
    let retryCount = 0;
    const maxRetries = 5;
    
    while (newInvoices.length === initialInvoices.length && retryCount < maxRetries) {
      await page.waitForTimeout(2000);
      
      const newInvoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const newInvoiceRecords = await newInvoiceResponse.json();
      newInvoices = newInvoiceRecords.data?.invoices || [];
      
      console.log(`Retry ${retryCount + 1}: Invoice count ${newInvoices.length}`);
      retryCount++;
    }

    // Verify new invoice was created
    expect(newInvoices.length).toBe(initialInvoices.length + 1);
    
    // Verify the latest invoice has correct amount
    const latestInvoice = newInvoices[0]; // Most recent invoice
    console.log('Latest invoice:', latestInvoice);
    
    // The amount might include fees, so we check it's close to expected amount
    const expectedAmount = parseFloat(paymentData.amount);
    const actualAmount = parseFloat(latestInvoice.amount || latestInvoice.total_amount);
    
    console.log(`Expected amount: $${expectedAmount}, Actual amount: $${actualAmount}`);
    expect(actualAmount).toBeGreaterThanOrEqual(expectedAmount * 0.9); // Allow for fees
    expect(actualAmount).toBeLessThanOrEqual(expectedAmount * 1.1); // Allow for fees

    await page.reload();

    // Verify invoice appears in UI with correct amount
    await page.waitForSelector('.transaction-container .el-table tbody tr', { timeout: 10000 });
    
    const firstInvoiceRecord = page.locator('.transaction-container .el-table tbody tr:first-child').first();
    await expect(firstInvoiceRecord).toBeVisible({ timeout: 10000 });
    await expect(firstInvoiceRecord).toContainText('Reload');
    await expect(firstInvoiceRecord).toContainText(`$${paymentData.amount}`);
  });

  test.skip('should verify PayPal payment method is saved for future use', async ({ request }) => {
    // This test would verify if PayPal payment method is saved
    // and can be reused for future payments
    const creds = require('../../../fixtures/credential.json');
    const token = await loginAndGetToken(request, creds.valid.email, creds.valid.password); 
  });
});