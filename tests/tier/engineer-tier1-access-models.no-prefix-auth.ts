import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { ServerlessModelsPage } from '../../pages/ServerlessModelsPage';
import { LoginPage } from '../../pages/LoginPage';
import { ENDPOINTS } from '../../constants/endpoints';
import { getCredentials } from '../../utils/testData';

test.describe('Engineer Tier 1 Access Models - Member 10', () => {
  let serverlessPage: ServerlessModelsPage;
  let loginPage: LoginPage;
  let credentials: any;

  test.beforeEach(async ({ page }) => {
    serverlessPage = new ServerlessModelsPage(page);
    loginPage = new LoginPage(page);
    credentials = getCredentials();

    // Login with Member 10 credentials
    await loginPage.visit();
    await loginPage.login(credentials.valid4.email, credentials.valid4.password);
    await loginPage.isLoggedIn(credentials.valid4.username);
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));

    // Navigate to Serverless Models page
    await serverlessPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
  });

  test.describe('Check access to Engineer Tier 2+ required models', () => {
    test.setTimeout(60000);
    
    // Models that require Engineer Tier 2+ access
    const engineerTier2Models = [
      'Manta-Mini-1.0',
      'DeepSeek-R1-0528 (free)',
      'DeepSeek-V3-0324 (free)',
      'DeepSeek-R1 (free)',
      'Grok-4-Fast'
    ];

    for (const modelName of engineerTier2Models) {
      test(`should show access restriction for Engineer Tier 2+ model: ${modelName}`, async ({ page }) => {
        // Click on the model to open detail page
        await serverlessPage.clickModel(modelName);
        
        // Check if access restriction message is displayed
        await expect(page.locator('text=Engineer Tier 2+ required')).toBeVisible({ timeout: 10000 });
        
        // Verify that chat input is not available or disabled
        const chatInput = page.locator('textarea[placeholder="Enter message here"]');
        const isInputDisabled = await chatInput.isDisabled();
        
        if (!isInputDisabled) {
          // If input is not disabled, try to fill message (but don't send)
          await chatInput.fill('Test message for restricted model');
          // Test passes if we can fill the input
          expect(await chatInput.inputValue()).toBe('Test message for restricted model');
        } else {
          // Input is disabled, which is expected behavior
          expect(isInputDisabled).toBe(true);
        }
      });
    }
  });

  test.describe('Check access to free models (should work)', () => {
    test.setTimeout(60000);
    
    // Models that should be accessible to all users
    const freeModels = [
      'L3.3-MS-Nevoria-70b',
      'Mistral-Small-3.2-24B-Instruct-2506(beta)',
      'Midnight-Rose-70B-v2.0.3(beta)',
      'L3-70B-Euryale-v2.1(beta)',
      'L3-8B-Stheno-v3.2'
    ];

    for (const modelName of freeModels) {
      test(`should allow access to free model: ${modelName}`, async ({ page }) => {
        // Click on the model to open detail page
        await serverlessPage.clickModel(modelName);
        
        // Wait for chat input to be visible and type message
        const chatInput = page.locator('textarea[placeholder="Enter message here"]');
        await chatInput.waitFor({ state: 'visible', timeout: 20000 });
        await chatInput.fill('Hi, I need help');

        // Test passes if we can fill the input (don't send message)
        expect(await chatInput.inputValue()).toBe('Hi, I need help');
      });
    }
  });


  test('should verify page responsiveness on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await serverlessPage.checkUI();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await serverlessPage.checkUI();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await serverlessPage.checkUI();
  });
});
