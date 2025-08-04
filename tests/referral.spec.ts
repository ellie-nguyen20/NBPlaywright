import { test, expect } from '@playwright/test';
import { ReferralPage } from '../pages/ReferralPage';
import { LoginPage } from '../pages/LoginPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Referral Page', () => {
  let referralPage: ReferralPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    referralPage = new ReferralPage(page);
    loginPage = new LoginPage(page);

    // Load credentials and login
    const creds = require('../fixtures/credential.json');
    
    await loginPage.visit();
    await loginPage.login(creds.valid.email, creds.valid.password);
    await loginPage.isLoggedIn(creds.valid.username);
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
    
    await referralPage.visit();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.REFERRAL));
  });

  test('should display Referral UI', async ({ page }) => {
    await referralPage.checkUI();
  });

  test.skip('should check referral history', async ({ page }) => {
    await referralPage.checkHistory();
  });

  test.skip('should check referral rewards', async ({ page }) => {
    await referralPage.checkRewards();
  });

  test('should copy referral link and code successfully', async ({ page }) => {
    await referralPage.copyLink();
    await referralPage.copyCode();
  });

  test('should apply invalid referral code and show error', async ({ page }) => {
    await referralPage.fillReferralCode('invalid-code');
    await referralPage.applyReferralCode();
    await referralPage.checkApplyError();
  });
}); 