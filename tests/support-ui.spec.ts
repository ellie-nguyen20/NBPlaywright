import { test } from '../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { SupportPage } from '../pages/SupportPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Support Page - UI', () => {
  let supportPage: SupportPage;

  test.beforeEach(async ({ page }) => {
    supportPage = new SupportPage(page);
    await supportPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SUPPORT));
  });

  test('should display Support UI', async () => {
    await supportPage.checkUI();
  });

  test('should display all tabs', async () => {
    await supportPage.checkTabs();
  });

  test('should display correct UI for User Problems tab', async () => {
    await supportPage.switchToTab('User Problems');
    await supportPage.checkUserProblemsTabUI();
  });

  test('should display correct UI for Startup Applications tab', async () => {
    await supportPage.switchToTab('Startup Applications');
    await supportPage.checkStartupApplicationsTabUI();
  });

  test('should display correct UI for Academia Application tab', async () => {
    await supportPage.switchToTab('Academia Application');
    await supportPage.checkAcademiaApplicationTabUI();
  });
}); 