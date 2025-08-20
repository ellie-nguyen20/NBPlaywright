import { test, expect } from '@playwright/test';
import { TeamPage } from '../../pages/TeamPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Team Page - Empty State UI', () => {
  let teamPage: TeamPage;

  test.beforeEach(async ({ page }) => {
    teamPage = new TeamPage(page);
    
    // Mock empty team list
    await page.route('**/api/v1/teams?*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          message: "Teams retrieved successfully",
          status: "success"
        })
      });
    });

    await teamPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.TEAM));
  });

  test('should display empty state UI', async ({ page }) => {
    await teamPage.checkEmptyStateUI();
  });

  test('should click create team button', async ({ page }) => {
    await teamPage.clickCreateTeam();
  });
}); 