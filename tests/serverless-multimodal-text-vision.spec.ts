import { test, expect } from '@playwright/test';
import { ServerlessModelsPage } from '../pages/ServerlessModelsPage';
import { LoginPage } from '../pages/LoginPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Serverless Page - Multimodal, text, vision model', () => {
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

  test.describe('Check chat with each model via Model Detail UI, time out 20s', () => {
    const models = [
      'Claude-Sonnet-4',
      'GPT-4o-mini',
      'Gemini-2.5-Pro-Preview-06-05',
      'Gemini-2.5-Pro-Preview-05-06',
      'Gemini-2.5-Flash-Preview-05-20',
      'Gemini-2.0-Flash',
      'DeepSeek-R1-0528 (free)',
      'DeepSeek-V3-0324 (free)',
      'DeepSeek-R1 (free)',
      'Llama3.3-70B',
      'Qwen-QwQ-32B',
      'Qwen2.5-VL-7B-Instruct',
    ];

    for (const modelName of models) {
      test(`should chat with model: ${modelName}`, async ({ page }) => {
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