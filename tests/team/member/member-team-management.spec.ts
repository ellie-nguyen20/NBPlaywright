import { test, expect } from '@playwright/test';
import { TeamPage } from '../../../pages/TeamPage';
import { TeamDetailPage } from '../../../pages/TeamDetailPage';
import { ENDPOINTS } from '../../../constants/endpoints';
import { getTeams } from '../../../utils/team';

test.describe('Team Management - Member Role Tests', () => {
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

  test.describe('Member Permissions', () => {
    test('should have limited member permissions', async ({ page, request }) => {
      // Get teams where user is a member
      const teams = await getTeams(request, authToken);
      const memberTeam = teams.find((team: any) => team.role === 1); // Assuming 1 is member role
      
      if (memberTeam) {
        await teamPage.clickRefresh();
        await teamPage.clickManage(memberTeam.name);
        
        // Verify member UI elements
        await teamDetailPage.checkMemberUI();
        
        // Verify member cannot see owner-only elements
        await expect(page.locator('[data-cy=invite-member-button]')).not.toBeVisible();
        await expect(page.locator('[data-cy=team-settings-tab]')).not.toBeVisible();
        await expect(page.locator('[data-cy=disband-team-button]')).not.toBeVisible();
        
        // Verify member can see member-only elements
        await expect(page.locator('[data-cy=leave-team-button]')).toBeVisible();
      }
    });

    test('should see View button for member teams', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      const memberTeam = teams.find((team: any) => team.role === 1);
      
      if (memberTeam) {
        await teamPage.clickRefresh();
        await teamPage.viewButtonVisible(memberTeam.name);
      }
    });

    test('should not see Manage and Delete buttons for member teams', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      const memberTeam = teams.find((team: any) => team.role === 1);
      
      if (memberTeam) {
        await teamPage.clickRefresh();
        await teamPage.checkManageButtonNotExist();
        await teamPage.checkDeleteButtonNotExist();
      }
    });
  });

  test.describe('Member Actions', () => {
    test('should be able to leave team', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      const memberTeam = teams.find((team: any) => team.role === 1);
      
      if (memberTeam) {
        await teamPage.clickRefresh();
        await teamPage.clickManage(memberTeam.name);
        
        // Click leave team button
        await page.locator('[data-cy=leave-team-button]').click();
        
        // Confirm leaving
        await page.locator('text=Leave Team').click();
        
        // Verify success message
        await expect(page.locator('text=Left team successfully')).toBeVisible({ timeout: 10000 });
      }
    });

    test('should not be able to invite members', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      const memberTeam = teams.find((team: any) => team.role === 1);
      
      if (memberTeam) {
        await teamPage.clickRefresh();
        await teamPage.clickManage(memberTeam.name);
        
        // Verify invite member button is not visible
        await expect(page.locator('[data-cy=invite-member-button]')).not.toBeVisible();
      }
    });

    test('should not be able to delete team', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      const memberTeam = teams.find((team: any) => team.role === 1);
      
      if (memberTeam) {
        await teamPage.clickRefresh();
        await teamPage.clickManage(memberTeam.name);
        
        // Verify delete team button is not visible
        await expect(page.locator('[data-cy=disband-team-button]')).not.toBeVisible();
      }
    });

    test('should not be able to transfer ownership', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      const memberTeam = teams.find((team: any) => team.role === 1);
      
      if (memberTeam) {
        await teamPage.clickRefresh();
        await teamPage.clickManage(memberTeam.name);
        
        // Verify transfer ownership button is not visible
        await expect(page.locator('text=Transfer Ownership')).not.toBeVisible();
      }
    });
  });

  test.describe('Member UI Validation', () => {
    test('should display correct member role text', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      const memberTeam = teams.find((team: any) => team.role === 1);
      
      if (memberTeam) {
        await teamPage.clickRefresh();
        await teamPage.checkRoleText(memberTeam.name, 'Member');
      }
    });

    test('should show correct member UI elements', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      const memberTeam = teams.find((team: any) => team.role === 1);
      
      if (memberTeam) {
        await teamPage.clickRefresh();
        await teamPage.clickManage(memberTeam.name);
        
        // Check member-specific UI elements
        await expect(page.locator('text=Team Members')).toBeVisible();
        await expect(page.locator('[data-cy=leave-team-button]')).toBeVisible();
        
        // Verify member cannot see owner-only tabs
        await expect(page.locator('[data-cy=team-settings-tab]')).not.toBeVisible();
      }
    });
  });
}); 