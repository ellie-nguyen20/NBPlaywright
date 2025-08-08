import { test, expect } from '@playwright/test';
import { TeamPage } from '../../pages/TeamPage';
import { TeamDetailPage } from '../../pages/TeamDetailPage';
import { ENDPOINTS } from '../../constants/endpoints';
import { createTeam, deleteTeamByName } from '../../utils/team';
import { loginAndGetToken } from '../../utils/auth';


test.describe('Team Management - Owner Basic Operations', () => {
  let teamPage: TeamPage;
  let teamDetailPage: TeamDetailPage;
  let teamName: string;

  test.describe('when user is Owner, he can create, delete team', () => {
    test.beforeEach(async ({ page, request }) => {
      teamName = `Test Team ${Date.now()}`;

      teamPage = new TeamPage(page);
      teamDetailPage = new TeamDetailPage(page);
      
      await teamPage.navigateTo();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.TEAM));
    });

    test.afterEach(async ({ request }) => {
      try {
        const creds = require('../fixtures/credential.json');
        const token = await loginAndGetToken(request, creds.valid.email, creds.valid.password);
        await deleteTeamByName(request, token, teamName);
      } catch (error) {
        // Silently ignore cleanup errors - team might not exist or already deleted
        // No need to log or raise error for cleanup failures
      }
    });

    test('should create new team successfully', async ({ page }) => {
      await teamPage.clickCreateTeam();
      await teamPage.fillTeamName(teamName);
      await teamPage.fillTeamDescription('Test Description');
      await teamPage.confirmCreate();
      await expect(page.locator('text=Team created successfully')).toBeVisible();
    });

    test('should delete team successfully', async ({ page, request }) => {
      const creds = require('../../fixtures/credential.json');
      const token = await loginAndGetToken(request, creds.valid.email, creds.valid.password);
      await createTeam(request, token, teamName, 'Test Description');
      await page.reload();
      await teamPage.clickDelete(teamName);
      await teamPage.confirmDelete();
      await expect(page.locator('text=Team deleted successfully')).toBeVisible();
    });
  });
}); 