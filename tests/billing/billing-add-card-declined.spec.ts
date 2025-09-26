import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { BillingPage } from '../../pages/BillingPage';
import { ENDPOINTS } from '../../constants/endpoints';
import { DECLINED_CARDS } from '../../utils/testData';

test.describe('Billing Page, Add Card - Declined Cards', () => {
  let billingPage: BillingPage;
  
  const testData = {
    fullName: 'Ellie nguyen',
    addressLine1: '123 Main Street',
    addressLine2: 'Apt 4B',
    city: 'HCM',
    postalCode: '90000',
    expirationDate: '0327',
    securityCode: '111'
  };

  test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);
    await billingPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.BILLING), {timeout: 60000});
  });

  test('should reject generic decline card when adding - 4000000000000002', async ({ context, page }) => {
    test.setTimeout(120000);
    
    const cardData = DECLINED_CARDS.genericDecline;
    
    // Get initial payment methods count
    const token = await page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    const initialResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const initialData = await initialResponse.json();
    const initialCount = initialData.data?.length || 0;
    console.log('Initial payment methods count:', initialCount);
    
    // Attempt to add declined card
    await billingPage.addNewCard(testData, cardData.cardNumber);
    
    // Wait for error to appear
    await page.waitForTimeout(5000);
    
    // Verify no new payment method was added
    const newResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newData = await newResponse.json();
    const newCount = newData.data?.length || 0;
    
    console.log(`Payment methods count: Expected ${initialCount}, Got ${newCount}`);
    expect(newCount).toBe(initialCount); // No new payment method should be added
    
    // Verify error message is displayed
    await billingPage.verifyGenericDeclineError();
  });

  test('should reject insufficient funds card when adding - 4000000000009995', async ({ context, page }) => {
    test.setTimeout(120000);
    
    const cardData = DECLINED_CARDS.insufficientFunds;
    
    // Get initial payment methods count
    const token = await page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    const initialResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const initialData = await initialResponse.json();
    const initialCount = initialData.data?.length || 0;
    console.log('Initial payment methods count:', initialCount);
    
    // Attempt to add insufficient funds card
    await billingPage.addNewCard(testData, cardData.cardNumber);
    
    // Wait for error to appear
    await page.waitForTimeout(5000);
    
    // Verify no new payment method was added
    const newResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newData = await newResponse.json();
    const newCount = newData.data?.length || 0;
    
    console.log(`Payment methods count: Expected ${initialCount}, Got ${newCount}`);
    expect(newCount).toBe(initialCount); // No new payment method should be added
    
    // Verify error message is displayed
    await billingPage.verifyInsufficientFundsError();
  });

  test('should reject lost card when adding - 4000000000009987', async ({ context, page }) => {
    test.setTimeout(120000);
    
    const cardData = DECLINED_CARDS.lostCard;
    
    // Get initial payment methods count
    const token = await page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    const initialResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const initialData = await initialResponse.json();
    const initialCount = initialData.data?.length || 0;
    console.log('Initial payment methods count:', initialCount);
    
    // Attempt to add lost card
    await billingPage.addNewCard(testData, cardData.cardNumber);
    
    // Wait for error to appear
    await page.waitForTimeout(5000);
    
    // Verify no new payment method was added
    const newResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newData = await newResponse.json();
    const newCount = newData.data?.length || 0;
    
    console.log(`Payment methods count: Expected ${initialCount}, Got ${newCount}`);
    expect(newCount).toBe(initialCount); // No new payment method should be added
    
    // Verify error message is displayed
    await billingPage.verifyGenericDeclineError();
  });

  test('should reject stolen card when adding - 4000000000009979', async ({ context, page }) => {
    test.setTimeout(120000);
    
    const cardData = DECLINED_CARDS.stolenCard;
    
    // Get initial payment methods count
    const token = await page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    const initialResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const initialData = await initialResponse.json();
    const initialCount = initialData.data?.length || 0;
    console.log('Initial payment methods count:', initialCount);
    
    // Attempt to add stolen card
    await billingPage.addNewCard(testData, cardData.cardNumber);
    
    // Wait for error to appear
    await page.waitForTimeout(5000);
    
    // Verify no new payment method was added
    const newResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newData = await newResponse.json();
    const newCount = newData.data?.length || 0;
    
    console.log(`Payment methods count: Expected ${initialCount}, Got ${newCount}`);
    expect(newCount).toBe(initialCount); // No new payment method should be added
    
    // Verify error message is displayed
    await billingPage.verifyGenericDeclineError();
  });

  test('should reject expired card when adding - 4000000000000069', async ({ context, page }) => {
    test.setTimeout(120000);
    
    const cardData = DECLINED_CARDS.expiredCard;
    
    // Get initial payment methods count
    const token = await page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    const initialResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const initialData = await initialResponse.json();
    const initialCount = initialData.data?.length || 0;
    console.log('Initial payment methods count:', initialCount);
    
    // Attempt to add expired card
    await billingPage.addNewCard(testData, cardData.cardNumber);
    
    // Wait for error to appear
    await page.waitForTimeout(5000);
    
    // Verify no new payment method was added
    const newResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newData = await newResponse.json();
    const newCount = newData.data?.length || 0;
    
    console.log(`Payment methods count: Expected ${initialCount}, Got ${newCount}`);
    expect(newCount).toBe(initialCount); // No new payment method should be added
    
    // Verify error message is displayed
    await billingPage.verifyExpiredCardError();
  });

  test('should reject incorrect CVC card when adding - 4000000000000127', async ({ context, page }) => {
    test.setTimeout(120000);
    
    const cardData = DECLINED_CARDS.incorrectCVC;
    
    // Get initial payment methods count
    const token = await page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    const initialResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const initialData = await initialResponse.json();
    const initialCount = initialData.data?.length || 0;
    console.log('Initial payment methods count:', initialCount);
    
    // Attempt to add incorrect CVC card
    await billingPage.addNewCard(testData, cardData.cardNumber);
    
    // Wait for error to appear
    await page.waitForTimeout(5000);
    
    // Verify no new payment method was added
    const newResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newData = await newResponse.json();
    const newCount = newData.data?.length || 0;
    
    console.log(`Payment methods count: Expected ${initialCount}, Got ${newCount}`);
    expect(newCount).toBe(initialCount); // No new payment method should be added
    
    // Verify error message is displayed
    await billingPage.verifyIncorrectCVCError();
  });

  test('should reject processing error card when adding - 4000000000000119', async ({ context, page }) => {
    test.setTimeout(120000);
    
    const cardData = DECLINED_CARDS.processingError;
    
    // Get initial payment methods count
    const token = await page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    const initialResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const initialData = await initialResponse.json();
    const initialCount = initialData.data?.length || 0;
    console.log('Initial payment methods count:', initialCount);
    
    // Attempt to add processing error card
    await billingPage.addNewCard(testData, cardData.cardNumber);
    
    // Wait for error to appear
    await page.waitForTimeout(5000);
    
    // Verify no new payment method was added
    const newResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newData = await newResponse.json();
    const newCount = newData.data?.length || 0;
    
    console.log(`Payment methods count: Expected ${initialCount}, Got ${newCount}`);
    expect(newCount).toBe(initialCount); // No new payment method should be added
    
    // Verify error message is displayed
    await billingPage.verifyProcessingError();
  });

  test('should reject incorrect card number when adding - 4242424242424241', async ({ context, page }) => {
    test.setTimeout(120000);
    
    const cardData = DECLINED_CARDS.incorrectNumber;
    
    // Get initial payment methods count
    const token = await page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    const initialResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const initialData = await initialResponse.json();
    const initialCount = initialData.data?.length || 0;
    console.log('Initial payment methods count:', initialCount);
    
    // Attempt to add incorrect card number
    await billingPage.addNewCard(testData, cardData.cardNumber);
    
    // Wait for error to appear
    await page.waitForTimeout(5000);
    
    // Verify no new payment method was added
    const newResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newData = await newResponse.json();
    const newCount = newData.data?.length || 0;
    
    console.log(`Payment methods count: Expected ${initialCount}, Got ${newCount}`);
    expect(newCount).toBe(initialCount); // No new payment method should be added
    
    // Verify error message is displayed
    await billingPage.verifyIncorrectNumberError();
  });

  test('should reject velocity exceeded card when adding - 4000000000006975', async ({ context, page }) => {
    test.setTimeout(120000);
    
    const cardData = DECLINED_CARDS.velocityExceeded;
    
    // Get initial payment methods count
    const token = await page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    const initialResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const initialData = await initialResponse.json();
    const initialCount = initialData.data?.length || 0;
    console.log('Initial payment methods count:', initialCount);
    
    // Attempt to add velocity exceeded card
    await billingPage.addNewCard(testData, cardData.cardNumber);
    
    // Wait for error to appear
    await page.waitForTimeout(5000);
    
    // Verify no new payment method was added
    const newResponse = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const newData = await newResponse.json();
    const newCount = newData.data?.length || 0;
    
    console.log(`Payment methods count: Expected ${initialCount}, Got ${newCount}`);
    expect(newCount).toBe(initialCount); // No new payment method should be added
    
    // Verify error message is displayed
    await billingPage.verifyVelocityExceededError();
  });
});
