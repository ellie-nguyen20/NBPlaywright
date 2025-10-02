import { test } from '../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { AccountPage } from '../pages/AccountPage';
import { LoginPage } from '../pages/LoginPage';
import { ENDPOINTS } from '../constants/endpoints';
import { getCredentials } from '../utils/testData';

test.describe('Account Page', () => {
  let accountPage: AccountPage;
  let loginPage: LoginPage;
  let credentials: any;

  test.beforeEach(async ({ page }) => {
    accountPage = new AccountPage(page);
    loginPage = new LoginPage(page);
    credentials = getCredentials();

    // Login first
    await loginPage.visit();
    await loginPage.login(credentials.account.email, credentials.account.password);
    await loginPage.isLoggedIn(credentials.account.username);
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));

    // Navigate to Account page
    await accountPage.visit();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.ACCOUNT));
  });

  test('should display Account UI', async () => {
    await accountPage.checkUI();
  });

  test('should update profile information successfully', async () => {
    await expect(async () => {
      await accountPage.updateProfile(credentials.account.updateUsername);
      await accountPage.updateProfile(credentials.account.username);
    }).toPass();
  });

  test('should change password successfully', async () => {
    await accountPage.changePassword(credentials.account.password, credentials.account.newPassword);
    await accountPage.changePassword(credentials.account.newPassword, credentials.account.password);
  });

  test('should not change password with wrong current password', async () => {
    await accountPage.changeWithWrongPassword('wrongpassword', 'newWrongpassword');
  });

  test('should not change password with duplicate password', async () => {
    await accountPage.changeWithDuplicatePassword(credentials.account.password, credentials.account.password);
  });

  test('should verify page responsiveness on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await accountPage.checkUI();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await accountPage.checkUI();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await accountPage.checkUI();
  });
}); 