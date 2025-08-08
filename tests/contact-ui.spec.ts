import { test, expect } from '@playwright/test';
import { ContactPage } from '../pages/ContactPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Contact Page - UI', () => {
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.CONTACT));
  });

  test('should display Contact UI', async () => {
    await contactPage.checkUI();
  });

  test('should display all tabs', async () => {
    await contactPage.checkTabs();
  });

  test('should display correct UI for User Problems tab', async () => {
    await contactPage.switchToTab('User Problems');
    await contactPage.checkUserProblemsTabUI();
  });

  test('should display correct UI for Startup Applications tab', async () => {
    await contactPage.switchToTab('Startup Applications');
    await contactPage.checkStartupApplicationsTabUI();
  });

  test('should display correct UI for Academia Application tab', async () => {
    await contactPage.switchToTab('Academia Application');
    await contactPage.checkAcademiaApplicationTabUI();
  });
}); 