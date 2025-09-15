import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { ServerlessModelsPage } from '../../pages/ServerlessModelsPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Serverless Models Page', () => {
  let serverlessPage: ServerlessModelsPage;

  test.beforeEach(async ({ page }) => {
    serverlessPage = new ServerlessModelsPage(page);

    await serverlessPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
  });

  test.describe('Check UI for Serverless Models Page', () => {
    test('should display Serverless Models UI', async () => {
      await serverlessPage.checkUI();
    });

    test('should display Model Detail UI', async () => {
      await serverlessPage.clickModel('GPT-4o-mini');
      await serverlessPage.checkModelDetailUI('GPT-4o-mini');
    });

    test('should display all current models correctly', async () => {
      // Test new models that were added
      const newModels = [
        'Qwen3-Embedding-8B',
        'Seedance-1.0-Pro-Image-to-Video',
        'Seedance-1.0-Pro-Text-to-Video',
        'Seedance-1.0-Lite-Image-to-Video',
        'Seedance-1.0-Lite-Text-to-Video',
        'BGE-reranker-v2-m3'
      ];

      for (const model of newModels) {
        await serverlessPage.checkModelVisible(model);
      }
    });

    test('should not display deprecated models', async () => {
      // These models should NOT be visible anymore
      const deprecatedModels = [
        'Claude-Sonnet-4',
        'Llama3.3-70B',
        'SD-XL 1.0-base',
        'FLUX.1 [schnell]',
        'Seedance-1-0-pro',
        'Seedance-1.0-lite-i2v',
        'Seedance-1.0-lite-t2v'
      ];

      for (const model of deprecatedModels) {
        const modelElement = await serverlessPage.getModelDiv(model);
        await expect(modelElement).not.toBeVisible();
      }
    });
  });
}); 