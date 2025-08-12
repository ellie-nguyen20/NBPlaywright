import { test, expect, request } from '@playwright/test';
import { BillingPage } from '../pages/BillingPage';
import { ENDPOINTS } from '../constants/endpoints';
import { loginAndGetToken } from '../utils/auth';

test.describe.configure({ mode: 'parallel' });
test.describe('Billing Page, Add credit by card', () => {
  let billingPage: BillingPage;

  test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);

    await billingPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.BILLING));
  });

  test('should add payment method successfully', async () => {
    await billingPage.addPaymentMethod();

  });
    
  test('should add credit by card successfully', async () => {

  });

  test.skip('should not allow adding credit in currencies other than USD', async ({ request }) => {
    const creds = require('../fixtures/credential.json');
    const token = await loginAndGetToken(request, creds.valid.email, creds.valid.password); 

    // await billingPage.clickAddCredits();
    // await billingPage.selectCurrency('EUR');
    // await expect(page.locator('text=Please select a valid currency')).toBeVisible();
  });

  test('should add credit by crypto successfully', async () => {

  });


});