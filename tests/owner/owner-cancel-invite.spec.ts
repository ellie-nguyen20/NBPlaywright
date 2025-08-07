import { test, expect } from '@playwright/test';
import { TeamPage } from '../../pages/TeamPage';
import { TeamDetailPage } from '../../pages/TeamDetailPage';
import { LoginPage } from '../../pages/LoginPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Team Management - Owner Cancel Invite', () => {
  const teamName = 'Test Team';
  let teamPage: TeamPage;
  let teamDetailPage: TeamDetailPage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    teamPage = new TeamPage(page);
    teamDetailPage = new TeamDetailPage(page);
    loginPage = new LoginPage(page);

    // Load credentials and login
    const creds = require('../../fixtures/credential.json');
    
    await loginPage.visit();
    await loginPage.login(creds.valid.email, creds.valid.password);
    await loginPage.isLoggedIn(creds.valid.username);
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
    
    await teamPage.visit();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.TEAM));
  });

  test('should cancel pending invitation successfully', async ({ page }) => {
    await teamPage.clickManage(teamName);
    await teamDetailPage.clickCancelPendingButton();
    await teamDetailPage.clickConfirmCancel();
    await expect(page.locator('text=canceled')).toBeVisible();
    await teamDetailPage.clickDeleteTeam();
    await teamDetailPage.clickConfirmDelete();
    await page.waitForTimeout(1000);
  });
}); 