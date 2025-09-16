import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { ServerlessModelsPage } from '../../pages/ServerlessModelsPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Serverless Page - Image model', () => {
  let serverlessPage: ServerlessModelsPage;

  test.beforeEach(async ({ page }) => {
    serverlessPage = new ServerlessModelsPage(page);

    await serverlessPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
  });

  test.describe('Check chat with each image model via Model Detail UI, timeout 60s', () => {
    test.setTimeout(120000);
    const imageModels = [
      'Bytedance-Seedream-3.0',
      'FLUX.1 [Kontext-dev]',
      'Bytedance-Seedream-4.0',
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
        
        await page.waitForTimeout(60000);
      });
    }
  });
}); 