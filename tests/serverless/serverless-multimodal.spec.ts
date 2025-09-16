import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { ServerlessModelsPage } from '../../pages/ServerlessModelsPage';
import { ENDPOINTS } from '../../constants/endpoints';

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
      'GPT-4o-mini',
      'Gemini-2.5-Pro',
      'Gemini-2.5-Flash',
      'Gemini-2.5-Flash-Lite',
      'Gemini-2.0-Flash',
      'Gemini-2.0-Flash-Lite',
    ];

    for (const modelName of multimodalModels) {
      test(`should chat with multimodal model: ${modelName}`, async ({ page }) => {
        // Click on the model to open detail page
        await serverlessPage.clickModel(modelName);
        
        // Wait for chat input to be visible and type message
        const chatInput = page.locator('textarea[placeholder="Enter message here"]');
        await chatInput.waitFor({ state: 'visible', timeout: 20000 });
        await chatInput.fill('Hi, I need help');

        await expect(async () => {
          await serverlessPage.clickSendButton();
          await expect(page.locator('div.text:has-text("Hi, I need help")')).toBeVisible({ timeout: 500 });
          const toolsDiv = page.locator('div.tools.show');
          await expect(toolsDiv).toHaveCount(1, { timeout: 30000 });
        }).toPass({ timeout: 40000 });
      });
    }
  });
}); 