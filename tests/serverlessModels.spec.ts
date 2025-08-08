import { test, expect } from '@playwright/test';
import { ServerlessModelsPage } from '../pages/ServerlessModelsPage';
import { ENDPOINTS } from '../constants/endpoints';

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
      await serverlessPage.clickModel('Claude-Sonnet-4');
      await serverlessPage.checkModelDetailUI('Claude-Sonnet-4');
    });
  });
}); 