import { test, expect, request } from '@playwright/test';
import { ApiKeysPage } from '../pages/ApiKeysPage';
import { ENDPOINTS } from '../constants/endpoints';
import { loginAndGetToken } from '../utils/auth';
import { createTeam, deleteTeam, createApiTeamKey } from '../utils/team';

test.describe('API Keys Page', () => {
  let apiKeysPage: ApiKeysPage;

  test.beforeEach(async ({ page }) => {
    apiKeysPage = new ApiKeysPage(page);
    
    await apiKeysPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.API_KEYS));
  });

  test.describe('when user have 1 API personal key (default value)', () => {
    test('should display API Keys Default UI', async ({ page }) => {
      await apiKeysPage.checkUI();
    });

    test('should regenerate API key', async ({ page }) => {
      const uniqueName = `Test API Key ${Date.now()}`;
      await apiKeysPage.createApiKey(uniqueName);
    });

    test('should copy API key', async ({ page }) => {
      await apiKeysPage.copyApiKey('Test API Key');
    });
  });

  test.describe('when user has own team, he can create, delete API key for team', () => {
    let teamId: string;
    let teamName: string;
    let token: string;

    test.beforeEach(async ({ page, request }) => {
      const creds = require('../fixtures/credential.json');
      
      // Login via API and set localStorage
      token = await loginAndGetToken(request, creds.valid.email, creds.valid.password);
      teamName = `Test team apikey using Playwright ${Date.now()}`;
      const teamDesc = 'Test Description';
      // Create team using real API
      const team = await createTeam(request, token, teamName, teamDesc);
      teamId = team.id;
    });

    test.afterEach(async ({ page, request }) => {
      if (teamId) {
        const creds = require('../fixtures/credential.json');
        const token = await loginAndGetToken(request, creds.valid.email, creds.valid.password);
        await deleteTeam(request, token, teamId);
      }
    });

    test('should create API key for team', async ({ page }) => {
      await apiKeysPage.clickCreateApiKey();
      await apiKeysPage.createNewApiKey('Test key', teamName);
    });

    test('should delete API key for team', async ({ page, request }) => {
      test.setTimeout(40000);
      const key = await createApiTeamKey(request, token, 'Test DeL key', 'Test description', teamId);
      await page.reload();
      await apiKeysPage.deleteApikey('Test DeL key');
    });
  });
}); 