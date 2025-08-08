import { test, expect } from '@playwright/test';
import { ServerlessModelsPage } from '../pages/ServerlessModelsPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Serverless Page - Multimodal model', () => {
  let serverlessPage: ServerlessModelsPage;

  test.beforeEach(async ({ page }) => {
    serverlessPage = new ServerlessModelsPage(page);

    await serverlessPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
  });

  test.describe('Check chat with multimodal models via Model Detail UI, timeout 60s', () => {
    test.setTimeout(60000);
    
    const multimodalModels = [
      'Claude-Sonnet-4',
      'GPT-4o-mini',
      'Gemini-2.5-Pro-Preview-06-05',
      'Gemini-2.5-Pro-Preview-05-06',
      'Gemini-2.5-Flash-Preview-05-20',
      'Gemini-2.0-Flash',
      // 'Qwen2.5-VL-7B-Instruct',
    ];

    for (const modelName of multimodalModels) {
      test(`should chat with multimodal model: ${modelName}`, async ({ page }) => {
        // Click on the model to open detail page
        await serverlessPage.clickModel(modelName);
        
        // Wait for chat input to be visible and type message
        const chatInput = page.locator('textarea[placeholder="Enter message here"]');
        await chatInput.waitFor({ state: 'visible', timeout: 10000 });
        await chatInput.fill('Hi, I need help');
        
        // Click send button
        await serverlessPage.clickSendButton();
        
        // Verify the message is visible
        await expect(page.locator('div.text:has-text("Hi, I need help")')).toBeVisible({ timeout: 30000 });
        
        // Check for tools div
        const toolsDiv = page.locator('div.tools.show');
        await expect(toolsDiv).toHaveCount(1, { timeout: 50000 });
      });
    }
  });
}); 