import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Dashboard Page', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new DashboardPage(page);

    await dashboardPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.DASHBOARD));
  });

  test('Check sidebar and active state', async ({ page }) => {
    await dashboardPage.checkSidebarMenu();
  });

  test('Check user information', async ({ page }) => {
    await dashboardPage.checkUserInfo();
  });

  test('check switch language buttons', async ({ page }) => {
    await dashboardPage.checkSwitchLanguageButtons();
  });

  test('Check dashboard links/tabs', async ({ page }) => {
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

  // Commented out tests for future implementation
  /*
  test.skip('LLM/VLM/Embedding API Requests and data table should be displayed correctly', async ({ page }) => {
    // Test implementation
  });

  test.skip('LLM/VLM/Embedding Token Generation and data table should be displayed correctly', async ({ page }) => {
    // Test implementation
  });

  test.skip('Image API Requests and data table should be displayed correctly', async ({ page }) => {
    // Test implementation
  });

  test.skip('Image Generation and data table should be displayed correctly', async ({ page }) => {
    // Test implementation
  });
  */
}); 