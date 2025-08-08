import { test, expect } from '@playwright/test';
import { ContactPage } from '../pages/ContactPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Contact Page - Form Functionality', () => {
  let contactPage: ContactPage;

  test.beforeEach(async ({ page }) => {
    contactPage = new ContactPage(page);

    await contactPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.CONTACT));
  });

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