import { test } from '../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { ENDPOINTS } from '../constants/endpoints';
import { type } from 'os';

test.describe('Dashboard Page', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);

    await dashboardPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.DASHBOARD));
  });
  // Error monitoring is now handled automatically by fixture afterEach
  // No need for separate test case

  test('Check sidebar and active state', async ({ page }) => {
    await dashboardPage.checkSidebarMenu();
  });

  test('Check user information', async ({ page }) => {
    await dashboardPage.checkUserInfo();
  });

  test('check switch language buttons', async ({ page }) => {
    await dashboardPage.checkSwitchLanguageButtons();
  });

  test.skip('Check dashboard links/tabs', async ({ page }) => {
    await dashboardPage.checkDashboardLinks();
  });

  test('Check docs link', async ({ page }) => {
    await dashboardPage.checkDocsLink();
  });

  test('Check time filter button', async ({ page }) => {
    await dashboardPage.checkTimeFilterButton();
  });
  
  test('should display Dashboard UI', async ({ page }) => {
    await dashboardPage.checkUI();
  });

  test('should display resource summary', async ({ page }) => {
    await dashboardPage.checkResourceSummary();
  });

  test('should display usage statistics', async ({ page }) => {
    await dashboardPage.checkUsageStats();
  });

  test('should display Help button', async ({ page }) => {
    await dashboardPage.checkHelpButton();
    await expect(async () => {
      await dashboardPage.clickHelpButton();
      await dashboardPage.checkFeedbackModal();
    }).toPass();
  });

  test.skip('should submit feedback via Help button successfully', async ({ page }) => {
    await dashboardPage.submitFeedbackViaHelpButton();
  });

  test('should verify page responsiveness on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await dashboardPage.checkUI();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await dashboardPage.checkUI();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await dashboardPage.checkUI();
  });

}); 