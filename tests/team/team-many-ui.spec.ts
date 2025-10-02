import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { TeamPage } from '../../pages/TeamPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Team Page - Many Teams UI', () => {
  let teamPage: TeamPage;

  test.beforeEach(async ({ page }) => {
    teamPage = new TeamPage(page);
    // Mock team data with 100 teams
    const mockTeamData = Array.from({ length: 100 }, (_, i) => ({
      id: 31 + i,
      name: `Mock Team ${i + 1}`,
      description: `This is a description for team ${i + 1}`,
      role: Math.floor(Math.random() * 3),
      permissions: [],
      members: Math.floor(Math.random() * 500) + 1,
      created_at: Math.floor(Date.now() / 1000) - (i * 10000),
      owner: {
        id: 422,
        name: "Member 5",
        tier: "ENGINEER_TIER_1"
      }
    }));

    await page.route('**/api/v1/teams?*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: mockTeamData,
          message: "Teams retrieved successfully",
          status: "success"
        })
      });
    });

    await teamPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.TEAM));
  });

  test('should click create team button', async ({ page }) => {
  });

  test('should click refresh button', async ({ page }) => {
    await teamPage.clickRefresh();
  });

  test('should display the team list table with 100 teams', async ({ page }) => {
    await teamPage.checkTeamListUI();
    await teamPage.checkTeamCount(100);
    await teamPage.checkTeamVisible('Mock Team 1');
    
    // Scroll to last team and check visibility
    const lastTeam = page.locator('text=Mock Team 100');
    await lastTeam.scrollIntoViewIfNeeded();
    await expect(lastTeam).toBeVisible();
  });

  test('should verify page responsiveness on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await teamPage.checkTeamListUI();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await teamPage.checkTeamListUI();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await teamPage.checkTeamListUI();
  });
}); 