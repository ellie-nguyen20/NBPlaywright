import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { BillingPage } from '../../pages/BillingPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe.configure({ mode: 'parallel' });
test.describe('Billing Page - Check UI', () => {
  let billingPage: BillingPage;

  test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);

    await billingPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.BILLING));
  });
    
  test('should display Billing UI', async () => {
    await billingPage.checkUI();
  });

  test('should open Add Credits and select amount', async () => {
    await billingPage.clickAddCredits();
  });

  test('should open and interact with Card payment methods', async () => {
    await billingPage.payWithCard();
  });

  test('should open and interact with PayPal payment methods', async () => {
    await billingPage.clickAddCredits();
    await billingPage.selectCreditAmount('50');
    await billingPage.payWithPayPal();
    // Note: This will redirect to PayPal, so we don't continue the flow here
    // Full PayPal testing is done in billing-add-credit-with-paypal.spec.ts
  });

  // test('should open and interact with Crypto payment methods', async () => {
  //   await billingPage.payWithCrypto();
  // });

  test('should configure and save Auto-pay', async () => {
    await billingPage.configureAutoPay();
    await billingPage.saveAutoPaySettings();
  });

  test('should open Add Payment Method', async () => {
    await billingPage.addPaymentMethod();
  });

  test('should add and redeem Promotion Code', async () => {
    await billingPage.addPromotionCode();
    await billingPage.redeemCode();
  });

  test('should refresh transactions and download invoice', async () => {
    await billingPage.refreshTransactions();
    await billingPage.downloadInvoice();
  });

  test('should filter usages', async () => {
    await billingPage.filterUsages('Compute');
    await billingPage.filterUsages('Serverless');
    await billingPage.filterUsages('Object Storage');

  });

  test('should verify page responsiveness on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await billingPage.checkUI();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await billingPage.checkUI();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await billingPage.checkUI();
  });
}); 