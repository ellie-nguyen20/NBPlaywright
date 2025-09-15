import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { BillingPage } from '../../pages/BillingPage';
import { ENDPOINTS } from '../../constants/endpoints';
import { loginAndGetToken } from '../../utils/auth';
import { PAYMENT_TEST_DATA } from '../../utils/testData';

test.describe('Billing Page, Add Credit', () => {
  let billingPage: BillingPage;

  test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);
    await billingPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.BILLING), {timeout: 60000});
  });

  test('should add credit by card successfully', async ({ context, page }) => {
    test.setTimeout(90000); 
    
    // Use test data for payment
    const paymentData = PAYMENT_TEST_DATA.validCard;
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
    
    // Add credit by card using the complete flow
    await billingPage.addCreditByCard(paymentData);

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
    await expect(firstInvoiceRecord).toContainText('$10');
  });

  test.skip('should not allow adding credit in currencies other than USD', async ({ request }) => {
    const creds = require('../fixtures/credential.json');
    const token = await loginAndGetToken(request, creds.valid.email, creds.valid.password); 
  });

  test.skip('should add credit by crypto successfully', async () => {
  });
});
