import { test, expect } from '@playwright/test';
import { TeamPage } from '../../pages/TeamPage';
import { TeamDetailPage } from '../../pages/TeamDetailPage';
import { LoginPage } from '../../pages/LoginPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Team Management - Owner Remove Member', () => {
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

  test('should remove member from the team successfully', async ({ page }) => {
    // Mock team creation
    await page.route('**/api/v1/teams', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: { id: 123, name: teamName },
          message: "Team created successfully",
          status: "success"
        })
      });
    });

    // Mock remove member API
    await page.route('**/api/v1/teams/*/members/*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: "Member removed successfully",
          status: "success"
        })
      });
    });

    await teamPage.clickCreateTeam();
    await teamPage.fillTeamName(teamName);
    await teamPage.fillTeamDescription('Test Description');
    await teamPage.confirmCreate();
    
    await teamPage.clickRefresh();
    await teamPage.clickManage(teamName);
    await teamDetailPage.removeMemberByEmail('thivunguyen1506+member1@gmail.com');
    await teamDetailPage.clickConfirmRemoveMember();
  });
}); 