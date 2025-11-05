import { test } from '../../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { BillingPage } from '../../../pages/BillingPage';
import { ENDPOINTS } from '../../../constants/endpoints';
import { loginAndGetToken } from '../../../utils/auth';
import { DECLINED_CARDS } from '../../../utils/testData';

test.describe('Billing Page, Declined Payments', () => {
  let billingPage: BillingPage;


  test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);
    await billingPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.BILLING), {timeout: 60000});
  });

  test('should handle generic decline card - 4000000000000002', async ({ context, page }) => {
    test.setTimeout(90000);
    
    const paymentData = DECLINED_CARDS.genericDecline;
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
    
    // Attempt to add credit with declined card
    await billingPage.addCreditByCard(paymentData);

    // Verify no new invoice was created
    await page.waitForTimeout(3000);
    
    const newInvoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newInvoiceRecords = await newInvoiceResponse.json();
    const newTotal = newInvoiceRecords.data?.total_invoices || 0;
    
    console.log(`Invoice comparison: Expected ${initialTotal}, Got ${newTotal}`);
    expect(newTotal).toBe(initialTotal); // No new invoice should be created
    
    // Verify error message is displayed
    await expect(page.locator('text=Your card was declined')).toBeVisible({ timeout: 10000 });
  });

  test('should handle insufficient funds card - 4000000000009995', async ({ context, page }) => {
    test.setTimeout(90000);
    
    const paymentData = DECLINED_CARDS.insufficientFunds;
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
    
    // Attempt to add credit with insufficient funds card
    await billingPage.addCreditByCard(paymentData);

    // Verify no new invoice was created
    await page.waitForTimeout(3000);
    
    const newInvoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newInvoiceRecords = await newInvoiceResponse.json();
    const newTotal = newInvoiceRecords.data?.total_invoices || 0;
    
    console.log(`Invoice comparison: Expected ${initialTotal}, Got ${newTotal}`);
    expect(newTotal).toBe(initialTotal); // No new invoice should be created
    
    // Verify error message is displayed
    await expect(page.locator('text=Payment validation failed. Your card has insufficient funds.')).toBeVisible({ timeout: 10000 });
  });

  test('should handle lost card - 4000000000009987', async ({ context, page }) => {
    test.setTimeout(90000);
    
    const paymentData = DECLINED_CARDS.lostCard;
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
    
    // Attempt to add credit with lost card
    await billingPage.addCreditByCard(paymentData);

    // Verify no new invoice was created
    await page.waitForTimeout(3000);
    
    const newInvoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newInvoiceRecords = await newInvoiceResponse.json();
    const newTotal = newInvoiceRecords.data?.total_invoices || 0;
    
    console.log(`Invoice comparison: Expected ${initialTotal}, Got ${newTotal}`);
    expect(newTotal).toBe(initialTotal); // No new invoice should be created
    
    // Verify error message is displayed
    await expect(page.locator('text=Your card was declined')).toBeVisible({ timeout: 10000 });
  });

  test('should handle stolen card - 4000000000009979', async ({ context, page }) => {
    test.setTimeout(90000);
    
    const paymentData = DECLINED_CARDS.stolenCard;
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
    
    // Attempt to add credit with stolen card
    await billingPage.addCreditByCard(paymentData);

    // Verify no new invoice was created
    await page.waitForTimeout(3000);
    
    const newInvoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newInvoiceRecords = await newInvoiceResponse.json();
    const newTotal = newInvoiceRecords.data?.total_invoices || 0;
    
    console.log(`Invoice comparison: Expected ${initialTotal}, Got ${newTotal}`);
    expect(newTotal).toBe(initialTotal); // No new invoice should be created
    
    // Verify error message is displayed
    await expect(page.locator('text=Your card was declined')).toBeVisible({ timeout: 10000 });
  });

  test('should handle expired card - 4000000000000069', async ({ context, page }) => {
    test.setTimeout(90000);
    
    const paymentData = DECLINED_CARDS.expiredCard;
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
    
    // Attempt to add credit with expired card
    await billingPage.addCreditByCard(paymentData);

    // Verify no new invoice was created
    await page.waitForTimeout(3000);
    
    const newInvoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newInvoiceRecords = await newInvoiceResponse.json();
    const newTotal = newInvoiceRecords.data?.total_invoices || 0;
    
    console.log(`Invoice comparison: Expected ${initialTotal}, Got ${newTotal}`);
    expect(newTotal).toBe(initialTotal); // No new invoice should be created
    
    // Verify error message is displayed
    await expect(page.locator('text=Your card has expired')).toBeVisible({ timeout: 10000 });
  });

  test('should handle incorrect CVC - 4000000000000127', async ({ context, page }) => {
    test.setTimeout(90000);
    
    const paymentData = DECLINED_CARDS.incorrectCVC;
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
    
    // Attempt to add credit with incorrect CVC
    await billingPage.addCreditByCard(paymentData);

    // Verify no new invoice was created
    await page.waitForTimeout(3000);
    
    const newInvoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newInvoiceRecords = await newInvoiceResponse.json();
    const newTotal = newInvoiceRecords.data?.total_invoices || 0;
    
    console.log(`Invoice comparison: Expected ${initialTotal}, Got ${newTotal}`);
    expect(newTotal).toBe(initialTotal); // No new invoice should be created
    
    // Verify error message is displayed
    await expect(page.locator('text=Your card\'s security code is incorrect')).toBeVisible({ timeout: 10000 });
  });

  test('should handle processing error - 4000000000000119', async ({ context, page }) => {
    test.setTimeout(90000);
    
    const paymentData = DECLINED_CARDS.processingError;
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
    
    // Attempt to add credit with processing error card
    await billingPage.addCreditByCard(paymentData);

    // Verify no new invoice was created
    await page.waitForTimeout(3000);
    
    const newInvoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newInvoiceRecords = await newInvoiceResponse.json();
    const newTotal = newInvoiceRecords.data?.total_invoices || 0;
    
    console.log(`Invoice comparison: Expected ${initialTotal}, Got ${newTotal}`);
    expect(newTotal).toBe(initialTotal); // No new invoice should be created
    
    // Verify error message is displayed
    await expect(page.locator('text=An error occurred while processing your card')).toBeVisible({ timeout: 10000 });
  });

  test('should handle incorrect card number - 4242424242424241', async ({ context, page }) => {
    test.setTimeout(90000);
    
    const paymentData = DECLINED_CARDS.incorrectNumber;
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
    
    // Attempt to add credit with incorrect card number
    await billingPage.addCreditByCard(paymentData);

    // Verify no new invoice was created
    await page.waitForTimeout(3000);
    
    const newInvoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newInvoiceRecords = await newInvoiceResponse.json();
    const newTotal = newInvoiceRecords.data?.total_invoices || 0;
    
    console.log(`Invoice comparison: Expected ${initialTotal}, Got ${newTotal}`);
    expect(newTotal).toBe(initialTotal); // No new invoice should be created
    
    // Verify error message is displayed
    await expect(page.locator('text=Your card number is incorrect')).toBeVisible({ timeout: 10000 });
  });

  test('should handle velocity exceeded - 4000000000006975', async ({ context, page }) => {
    test.setTimeout(90000);
    
    const paymentData = DECLINED_CARDS.velocityExceeded;
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
    
    // Attempt to add credit with velocity exceeded card
    await billingPage.addCreditByCard(paymentData);

    // Verify no new invoice was created
    await page.waitForTimeout(3000);
    
    const newInvoiceResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/users/invoices?limit=10&offset=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newInvoiceRecords = await newInvoiceResponse.json();
    const newTotal = newInvoiceRecords.data?.total_invoices || 0;
    
    console.log(`Invoice comparison: Expected ${initialTotal}, Got ${newTotal}`);
    expect(newTotal).toBe(initialTotal); // No new invoice should be created
    
    // Verify error message is displayed
    await expect(page.locator('text=Your card was declined')).toBeVisible({ timeout: 10000 });
  });
});
