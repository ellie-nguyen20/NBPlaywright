import { test, expect } from '@playwright/test';
import { ServerlessModelsPage } from '../pages/ServerlessModelsPage';
import { LoginPage } from '../pages/LoginPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Serverless Page - Video model', () => {
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

  test.describe('Check chat with each video model via Model Detail UI, time out 120s', () => {
    const videoModels = [
      'Seedance-1-0-pro',
      'Seedance-1.0-lite-i2v',
      'Seedance-1.0-lite-t2v',
    ];

    for (const modelName of videoModels) {
      test(`should chat with video model: ${modelName}`, async ({ page }) => {
        await serverlessPage.clickModel(modelName);
        
        // Wait for chat input and type video prompt
        const chatInput = page.locator('textarea[placeholder="Enter message here"]');
        await chatInput.waitFor({ state: 'visible', timeout: 10000 });
        await chatInput.fill('A beautiful unicorn is flying in the sky');
        
        await serverlessPage.clickSendButton();
        
        // Check for video result
        await serverlessPage.checkVideoResult();
        
        // Uncomment these if you want to test video play and download
        // await serverlessPage.checkVideoPlay();
        // await serverlessPage.checkVideoDownload();
      });
    }
  });
}); 