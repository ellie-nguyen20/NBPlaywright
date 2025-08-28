import { test } from '../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { ReferralPage } from '../pages/ReferralPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Referral Page', () => {
  let referralPage: ReferralPage;

  test.beforeEach(async ({ page }) => {
    referralPage = new ReferralPage(page);
    await referralPage.navigateTo();
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

  test.skip('should apply invalid referral code and show error', async ({ page }) => {
    await referralPage.fillReferralCode('invalid-code');
    await referralPage.applyReferralCode();
    await referralPage.checkApplyError();
  });
}); 