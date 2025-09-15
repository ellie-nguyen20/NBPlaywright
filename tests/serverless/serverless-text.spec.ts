import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { ServerlessModelsPage } from '../../pages/ServerlessModelsPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Serverless Page - Text model', () => {
  let serverlessPage: ServerlessModelsPage;

  test.beforeEach(async ({ page }) => {
    serverlessPage = new ServerlessModelsPage(page);

    await serverlessPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
  });

  test.describe('Check chat with text models via Model Detail UI, timeout 60s', () => {
    test.setTimeout(60000);
    
    const textModels = [
      'L3.3-MS-Nevoria-70b',
      'Mistral-Small-3.2-24B-Instruct-2506(beta)',
      'Midnight-Rose-70B-v2.0.3(beta)',
      'L3-70B-Euryale-v2.1(beta)',
      'L3-8B-Stheno-v3.2',
      'DeepSeek-R1-0528 (free)',
      'DeepSeek-V3-0324 (free)',
      'DeepSeek-R1 (free)',
      'Llama3.3-70B',
      'Qwen-QwQ-32B',
      'DeepSeek-V3-0324',
      'DeepSeek-R1-0528'
    ];

    for (const modelName of textModels) {
      test(`should chat with text model: ${modelName}`, async ({ page }) => {
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