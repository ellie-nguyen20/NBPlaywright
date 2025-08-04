import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ENDPOINTS } from '../constants/endpoints';
import { getCredentials } from '../utils/testData';

test.describe('Login Page', () => {
  let loginPage: LoginPage;
  let credentials: any;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    credentials = getCredentials();
    await loginPage.visit();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.LOGIN));
  });

  test('should display Login UI', async () => {
    await loginPage.checkUI();
  });

  test('should login with valid credentials', async () => {
    await loginPage.login(credentials.valid.email, credentials.valid.password);
    await loginPage.isLoggedIn(credentials.valid.username);
  });

  test('should show error with invalid credentials', async () => {
    await loginPage.login(credentials.invalid.email, credentials.invalid.password);
    await loginPage.isLoginError();
  });
}); 