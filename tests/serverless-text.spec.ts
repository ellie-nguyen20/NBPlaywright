import { test, expect } from '@playwright/test';
import { ServerlessModelsPage } from '../pages/ServerlessModelsPage';
import { LoginPage } from '../pages/LoginPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Serverless Page - Text Models', () => {
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

  test.describe('Check chat with text models via Model Detail UI, timeout 30s', () => {
    test.setTimeout(30000);
    
    const textModels = [
      'DeepSeek-R1-0528 (free)',
      'DeepSeek-V3-0324 (free)',
      'DeepSeek-R1 (free)',
      'Llama3.3-70B',
      'Qwen-QwQ-32B',
      'Mistral-Small-3.2-24B-Instruct-2506(beta)',
      'Midnight-Rose-70B-v2.0.3(beta)',
      'L3-70B-Euryale-v2.1(beta)',
      'L3-8B-Stheno-v3.2',
    ];

    for (const modelName of textModels) {
      test(`should chat with text model: ${modelName}`, async ({ page }) => {
        // Click on the model to open detail page
        await serverlessPage.clickModel(modelName);
        
        // Wait for chat input to be visible and type message
        const chatInput = page.locator('textarea[placeholder="Enter message here"]');
        await chatInput.waitFor({ state: 'visible', timeout: 10000 });
        await chatInput.fill('Hi, I need help');
        
        // Click send button
        await serverlessPage.clickSendButton();
        
        // Verify the message is visible
        await page.waitForTimeout(20000);
        await expect(page.locator('div.text:has-text("Hi, I need help")')).toBeVisible({ timeout: 30000 });
        
        // Check for tools div
        const toolsDiv = page.locator('div.tools.show');
        await expect(toolsDiv).toHaveCount(1, { timeout: 30000 });
      });
    }
  });
}); 