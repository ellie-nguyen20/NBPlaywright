import { test, expect } from '@playwright/test';
import { BillingPage } from '../../pages/BillingPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe.configure({ mode: 'parallel' });
test.describe('Billing Page', () => {
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

  test('should open and interact with payment methods', async () => {
    await billingPage.payWithCard();
    await billingPage.payWithCrypto();
  });

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
}); 