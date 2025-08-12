import { test, expect } from '@playwright/test';
import { SupportPage } from '../pages/SupportPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Support Page - Form Functionality', () => {
  let supportPage: SupportPage;

  test.beforeEach(async ({ page }) => {
    supportPage = new SupportPage(page);

    await supportPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SUPPORT));
  });

  test('should upload file on User Problems tab', async () => {
    await supportPage.submitUserProblemsForm(
      'Test subject for User Problems',
      'Test description for User Problems',
      './fixtures/test.png'
    );
  });

  test('should submit form on User Problems tab', async () => {
    await supportPage.submitUserProblemsForm(
      'Test subject for User Problems',
      'Test description for User Problems'
    );
  });

  test('should submit form on Startup Applications tab', async () => {
    await supportPage.submitStartupApplicationsForm(
      'Test Startup',
      'https://teststartup.com',
      'startup@email.com',
      'Test description for Startup Applications'
    );
  });

  test('should submit form on Academia Application tab', async () => {
    await supportPage.submitAcademiaApplicationForm(
      'Test Project Title',
      'Test Institution',
      'academia@email.com',
      'Test description for Academia Application'
    );
  });
}); 