import { test, expect } from '@playwright/test';
import { ContactPage } from '../pages/ContactPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Contact Page', () => {
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);
    await contactPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.CONTACT));
  });

  test.describe('Check UI', () => {
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

  test.describe('Check submit form functionality', () => {
    test('should upload file on User Problems tab', async () => {
      await contactPage.submitUserProblemsForm(
        'Test subject for User Problems',
        'Test description for User Problems',
        './fixtures/test.png'
      );
    });

    test('should submit form on User Problems tab', async () => {
      await contactPage.submitUserProblemsForm(
        'Test subject for User Problems',
        'Test description for User Problems'
      );
    });

    test('should submit form on Startup Applications tab', async () => {
      await contactPage.submitStartupApplicationsForm(
        'Test Startup',
        'https://teststartup.com',
        'startup@email.com',
        'Test description for Startup Applications'
      );
    });

    test('should submit form on Academia Application tab', async () => {
      await contactPage.submitAcademiaApplicationForm(
        'Test Project Title',
        'Test Institution',
        'academia@email.com',
        'Test description for Academia Application'
      );
    });
  });
}); 