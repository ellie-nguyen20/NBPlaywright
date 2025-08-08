import { test, expect } from '@playwright/test';
import { TeamPage } from '../../pages/TeamPage';
import { TeamDetailPage } from '../../pages/TeamDetailPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Team Management - Owner Cancel Invite', () => {
  const teamName = 'Test Team';
  let teamPage: TeamPage;
  let teamDetailPage: TeamDetailPage;

  test.beforeEach(async ({ page }) => {
    teamPage = new TeamPage(page);
    teamDetailPage = new TeamDetailPage(page);

    await teamPage.navigateTo();
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