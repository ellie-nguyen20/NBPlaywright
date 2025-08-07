import { test, expect } from '@playwright/test';
import { TeamPage } from '../../pages/TeamPage';
import { TeamDetailPage } from '../../pages/TeamDetailPage';
import { LoginPage } from '../../pages/LoginPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Team Management - Owner Invite Member', () => {
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

  test('should invite user to team successfully', async ({ page }) => {
    // Mock team creation API
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

    // Mock team list API
    await page.route('**/api/v1/teams?*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [{ id: 123, name: teamName, role: 0 }],
          message: "Teams retrieved successfully",
          status: "success"
        })
      });
    });

    // Mock invite API
    await page.route('**/api/v1/teams/*/invite', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: "Team member invited successfully",
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
    await teamDetailPage.clickInviteMember();
    await teamDetailPage.fillInviteEmail('test@gmail.com');
    await page.waitForTimeout(1000);
    await teamDetailPage.confirmInvite();
    await expect(page.locator('text=Team member invited successfully')).toBeVisible({ timeout: 10000 });
  });
}); 