import { test, expect } from '@playwright/test';
import { AccountPage } from '../pages/AccountPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Account Page', () => {
  let accountPage: AccountPage;

  test.beforeEach(async ({ page }) => {
    accountPage = new AccountPage(page);

    await accountPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.ACCOUNT));
  });

  test('should display Account UI', async () => {
    await accountPage.checkUI();
  });

  test('should update profile information successfully', async () => {
    const credentials = require('../fixtures/credential.json');
    await accountPage.updateProfile(credentials.account.updateUsername);
    await accountPage.updateProfile(credentials.account.username);
  });

  test('should change password successfully', async () => {
    const credentials = require('../fixtures/credential.json');
    await accountPage.changePassword(credentials.account.password, credentials.account.newPassword);
    await accountPage.changePassword(credentials.account.newPassword, credentials.account.password);
  });

  test('should not change password with wrong current password', async () => {
    await accountPage.changeWithWrongPassword('wrongpassword', 'newWrongpassword');
  });

  test('should not change password with duplicate password', async () => {
    const credentials = require('../fixtures/credential.json');
    await accountPage.changeWithDuplicatePassword(credentials.account.password, credentials.account.password);
  });
}); 