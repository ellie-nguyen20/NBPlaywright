import { test } from '../../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { BillingPage } from '../../../pages/BillingPage';
import { ENDPOINTS } from '../../../constants/endpoints';
import { PAYPAL_TEST_DATA } from '../../../utils/testData';

test.describe('Billing Page - PayPal Basic Flow Tests', () => {
  let billingPage: BillingPage;

  test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);
    await billingPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.BILLING), { timeout: 60000 });
  });

  test('should open Add Credits modal and display PayPal option', async ({ page }) => {
    test.setTimeout(60000);
    
    // Click Add Credits button
    await billingPage.clickAddCredits();
    
    // Verify modal is open
    await expect(page.locator('text=Add Credits')).toBeVisible();
    
    // Select credit amount
    await billingPage.selectCreditAmount(PAYPAL_TEST_DATA.validPayPal.amount);
    
    // Verify amount is selected
    await expect(page.locator(`text=$${PAYPAL_TEST_DATA.validPayPal.amount}`)).toBeVisible();
    
    // Check if PayPal option is available
    await expect(page.locator('text=PayPal')).toBeVisible();
  });

  test('should initiate PayPal payment flow and reach login page', async ({ page }) => {
    test.setTimeout(120000);
    
    // Open Add Credits modal and select amount
    await billingPage.clickAddCredits();
    await billingPage.selectCreditAmount(PAYPAL_TEST_DATA.validPayPal.amount);
    
    // Click PayPal option
    await billingPage.payWithPayPal();
    
    // Verify PayPal login page appears
    await billingPage.verifyPayPalLoginPage();
  });

  test('should handle PayPal payment cancellation', async ({ page }) => {
    test.setTimeout(120000);
    
    // Open Add Credits modal and select amount
    await billingPage.clickAddCredits();
    await billingPage.selectCreditAmount(PAYPAL_TEST_DATA.validPayPal.amount);
    
    // Click PayPal option
    await billingPage.payWithPayPal();
    
    // Wait for PayPal page to load
    await billingPage.verifyPayPalLoginPage();
    
    // Cancel PayPal payment
    await billingPage.cancelPayPalPayment();
    
    // Verify we're back to billing page
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.BILLING));
  });

  test('should handle PayPal payment error with invalid credentials', async ({ page }) => {
    test.setTimeout(120000);
    
    // Open Add Credits modal and select amount
    await billingPage.clickAddCredits();
    await billingPage.selectCreditAmount(PAYPAL_TEST_DATA.validPayPal.amount);
    
    // Click PayPal option
    await billingPage.payWithPayPal();
    
    // Wait for PayPal page to load
    await billingPage.verifyPayPalLoginPage();
    
    // Simulate payment error by entering invalid credentials
    await billingPage.enterPayPalCredentials(
      PAYPAL_TEST_DATA.invalidCredentials.paypalEmail, 
      PAYPAL_TEST_DATA.invalidCredentials.paypalPassword
    );
    
    // Verify error message appears
    await billingPage.verifyPayPalPaymentError(PAYPAL_TEST_DATA.invalidCredentials.expectedError);
  });

  test('should complete PayPal payment successfully', async ({ page }) => {
    test.setTimeout(180000);
    
    // Open Add Credits modal and select amount
    await billingPage.clickAddCredits();
    await billingPage.selectCreditAmount(PAYPAL_TEST_DATA.validPayPal.amount);
    
    // Click PayPal option
    await billingPage.payWithPayPal();
    
    // Wait for PayPal page to load
    await billingPage.verifyPayPalLoginPage();
    
    // Enter valid PayPal credentials
    await billingPage.enterPayPalCredentials(
      PAYPAL_TEST_DATA.validPayPal.paypalEmail, 
      PAYPAL_TEST_DATA.validPayPal.paypalPassword
    );
    
    // Verify PayPal payment page elements
    await billingPage.verifyPayPalPaymentPage();
    
    // Click Complete Purchase on PayPal page
    await billingPage.confirmPayPalPayment();
    
    // Wait for payment processing and success page
    await billingPage.waitForPayPalPaymentProcessing();
    
    // Verify success message and return to billing
    await billingPage.verifyPayPalPaymentSuccess();
  });

  test('should verify PayPal payment method is displayed in payment methods section', async ({ page }) => {
    test.setTimeout(60000);
    
    // Navigate to payment methods section
    await expect(page.locator('text=Payment Method')).toBeVisible();
    
    // Check if PayPal is listed as a payment method option
    await expect(page.locator('text=PayPal')).toBeVisible();
  });

  test('should verify page responsiveness with PayPal payment on mobile', async ({ page }) => {
    test.setTimeout(120000);
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open Add Credits modal and select amount
    await billingPage.clickAddCredits();
    await billingPage.selectCreditAmount(PAYPAL_TEST_DATA.validPayPal.amount);
    
    // Click PayPal option
    await billingPage.payWithPayPal();
    
    // Verify PayPal page loads correctly on mobile
    await billingPage.verifyPayPalLoginPage();
    
    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});
