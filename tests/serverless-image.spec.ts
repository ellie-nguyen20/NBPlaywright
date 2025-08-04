import { test, expect } from '@playwright/test';
import { ServerlessModelsPage } from '../pages/ServerlessModelsPage';
import { LoginPage } from '../pages/LoginPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Serverless Page - Image model', () => {
  let serverlessPage: ServerlessModelsPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    serverlessPage = new ServerlessModelsPage(page);
    loginPage = new LoginPage(page);

    // Load credentials and login
    const creds = require('../fixtures/credential.json');
    
    await loginPage.visit();
    await loginPage.login(creds.valid.email, creds.valid.password);
    await loginPage.isLoggedIn(creds.valid.username);
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
    
    await serverlessPage.visit();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
  });

  test.describe('Check chat with each image model via Model Detail UI, time for limitation 60s', () => {
    const imageModels = [
      'Bytedance-Seedream-3.0',
      'SD-XL 1.0-base',
      'FLUX.1 [schnell]',
    ];

    for (const modelName of imageModels) {
      test(`should chat with image model: ${modelName}`, async ({ page }) => {
        await serverlessPage.clickModel(modelName);
        
        // Wait for chat input and type image prompt
        const chatInput = page.locator('textarea[placeholder="Enter message here"]');
        await chatInput.waitFor({ state: 'visible', timeout: 10000 });
        await chatInput.fill('A beautiful cat');
        
        await serverlessPage.clickSendButton();
        
        // Check for image result
        await serverlessPage.checkImageResult();
        await serverlessPage.checkBase64ImageResult();
        
        // Wait 60 seconds for rate limiting (equivalent to cy.wait(60000))
        await page.waitForTimeout(60000);
      });
    }
  });
}); 