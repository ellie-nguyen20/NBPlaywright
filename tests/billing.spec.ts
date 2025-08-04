import { test, expect } from '@playwright/test';
import { BillingPage } from '../pages/BillingPage';
import { LoginPage } from '../pages/LoginPage';
import { ENDPOINTS } from '../constants/endpoints';
import { getCredentials } from '../utils/testData';

test.describe.configure({ mode: 'parallel' });
test.describe('Billing Page', () => {
  let billingPage: BillingPage;
  let loginPage: LoginPage;
  let credentials: any;

  test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);
    loginPage = new LoginPage(page);
    credentials = getCredentials();

    // Login first
    await loginPage.visit();
    await loginPage.login(credentials.valid.email, credentials.valid.password);
    await loginPage.isLoggedIn(credentials.valid.username);
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS), { timeout: 20000 });

    // Navigate to Billing page
    await billingPage.visit();
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