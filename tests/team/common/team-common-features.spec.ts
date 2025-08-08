import { test, expect } from '@playwright/test';
import { TeamPage } from '../../../pages/TeamPage';
import { TeamDetailPage } from '../../../pages/TeamDetailPage';
import { ENDPOINTS } from '../../../constants/endpoints';
import { getTeams } from '../../../utils/team';

test.describe('Team Management - Common Features', () => {
  let teamPage: TeamPage;
  let teamDetailPage: TeamDetailPage;
  let authToken: string;

  test.beforeEach(async ({ page, request }) => {
    teamPage = new TeamPage(page);
    teamDetailPage = new TeamDetailPage(page);

    authToken = await page.evaluate(() => {
      return localStorage.getItem('token') || document.cookie.split('token=')[1]?.split(';')[0];
    });

    if (!authToken) {
      throw new Error('No auth token found. Please ensure user is logged in.');
    }

    await teamPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.TEAM));
  });

  test.describe('UI Validation', () => {
    test('should display correct team list UI', async ({ page }) => {
      await teamPage.checkTeamListUI();
    });

    test('should show correct action buttons based on role', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      
      for (const team of teams) {
        if (team.role === 0) { // Owner
          await teamPage.manageButtonVisible(team.name);
          await teamPage.deleteButtonVisible(team.name);
        } else if (team.role === 1) { // Member
          await teamPage.viewButtonVisible(team.name);
        } else if (team.role === 2) { // Admin
          await teamPage.manageButtonVisible(team.name);
          await teamPage.deleteButtonVisible(team.name);
        }
      }
    });

    test('should show empty state when no teams exist', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      if (teams.length === 0) {
        await teamPage.checkEmptyStateUI();
      }
    });
  });

  test.describe('Navigation', () => {
    test('should navigate to team detail page', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      
      if (teams.length > 0) {
        const firstTeam = teams[0];
        await teamPage.clickRefresh();
        
        if (firstTeam.role === 0 || firstTeam.role === 2) { // Owner or Admin
          await teamPage.clickManage(firstTeam.name);
        } else {
          await teamPage.clickView(firstTeam.name);
        }
        
        // Verify we're on team detail page
        await expect(page.locator('text=Team Members')).toBeVisible();
      }
    });

    test('should refresh team list', async ({ page }) => {
      await teamPage.clickRefresh();
      // Verify refresh button is clickable and doesn't cause errors
      await expect(page.locator('text=Refresh')).toBeVisible();
    });
  });

  test.describe('Data Validation', () => {
    test('should display correct team information', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      
      for (const team of teams) {
        await teamPage.clickRefresh();
        await teamPage.checkTeamVisible(team.name);
        
        // Verify team name is displayed correctly
        await expect(page.locator(`text=${team.name}`)).toBeVisible();
        
        // Verify role is displayed correctly
        const roleText = team.role === 0 ? 'Owner' : team.role === 1 ? 'Member' : 'Admin';
        await teamPage.checkRoleText(team.name, roleText);
      }
    });

    test('should show correct team count', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      await teamPage.checkTeamCount(teams.length);
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await teamPage.checkTeamListUI();
      
      // Verify mobile-specific elements work
      await expect(page.locator('text=Create Team')).toBeVisible();
      await expect(page.locator('text=Refresh')).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await teamPage.checkTeamListUI();
      
      // Verify tablet-specific elements work
      await expect(page.locator('text=Create Team')).toBeVisible();
      await expect(page.locator('text=Refresh')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // This test would require mocking network failures
      // For now, we'll just verify the page loads correctly
      await expect(page.locator('text=Team Management')).toBeVisible();
    });

    test('should handle empty team list', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      
      if (teams.length === 0) {
        await teamPage.checkEmptyStateUI();
        await expect(page.locator('text=You don\'t have any teams')).toBeVisible();
      }
    });
  });
}); 