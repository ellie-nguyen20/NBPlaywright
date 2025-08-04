import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ServerlessModelsPage } from '../pages/ServerlessModelsPage';
import { ENDPOINTS } from '../constants/endpoints';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Serverless Page', () => {
  let loginPage: LoginPage;
  let serverlessPage: ServerlessModelsPage;
  let credentials: any;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    serverlessPage = new ServerlessModelsPage(page);

    // Load credentials from fixture
    const fixturePath = path.join(__dirname, '../fixtures/credential.json');
    const fixtureData = fs.readFileSync(fixturePath, 'utf8');
    credentials = JSON.parse(fixtureData);

    // Login
    await loginPage.visit();
    await loginPage.login(credentials.valid.email, credentials.valid.password);
    await loginPage.isLoggedIn(credentials.valid.username);
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));

    // Navigate to Serverless Models page
    await serverlessPage.visit();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
  });

  test.describe('Check UI for Serverless Models Page', () => {
    test('should display Serverless Models UI', async () => {
      await serverlessPage.checkUI();
    });

    test('should display Model Detail UI', async () => {
      await serverlessPage.clickModel('Claude-Sonnet-4');
      await serverlessPage.checkModelDetailUI('Claude-Sonnet-4');
    });
  });
}); 