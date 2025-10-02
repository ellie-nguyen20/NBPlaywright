import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { InstancesPage } from '../../pages/InstancesPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Instances Page - Empty State', () => {
  let instancesPage: InstancesPage;

  test.beforeEach(async ({ page }) => {
    instancesPage = new InstancesPage(page);
    
    // Mock empty instances list API
    await page.route('**/api/v1/computing/instances?limit=10&offset=1&type=0', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          message: "No instances found",
          status: "success"
        })
      });
    });
    
    await expect(async () => {
      await instancesPage.navigateTo();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.INSTANCES), { timeout: 10000 });
    }).toPass({ timeout: 20000 });
  });

  test('should display empty state UI', async ({ page }) => {
    await instancesPage.checkUI();
  });

  test('should verify page responsiveness on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await instancesPage.checkUI();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await instancesPage.checkUI();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await instancesPage.checkUI();
  });
});
