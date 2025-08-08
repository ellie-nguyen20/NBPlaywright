import { test, expect } from '@playwright/test';
import { TeamPage } from '../../pages/TeamPage';
import { TeamDetailPage } from '../../pages/TeamDetailPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Team Management - Owner Transfer Ownership', () => {
  const teamName = 'Test Team';
  let teamPage: TeamPage;
  let teamDetailPage: TeamDetailPage;

  test.beforeEach(async ({ page }) => {
    teamPage = new TeamPage(page);
    teamDetailPage = new TeamDetailPage(page);

    await teamPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.TEAM));
  });

  test('should transfer ownership of the team successfully', async ({ page }) => {
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

    // Mock transfer ownership API
    await page.route('**/api/v1/teams/*/transfer-ownership', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: "Ownership transferred successfully",
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
    await page.waitForTimeout(2000);
    await teamDetailPage.clickTransferOwnership();
    await page.waitForTimeout(2000);
    await teamDetailPage.clickDropdownChoice('thivunguyen1506+member1@gmail.com');
    await page.waitForTimeout(1000);
    await teamDetailPage.clickConfirmTransferOwnership();
    await page.waitForTimeout(1000);
    
    // Check role change
    const row = page.locator('tr:has-text("You")');
    await expect(row.locator('text=Admin')).toBeVisible();
  });
}); 