import { test, expect } from '@playwright/test';
import { TeamPage } from '../../../pages/TeamPage';
import { TeamDetailPage } from '../../../pages/TeamDetailPage';
import { ENDPOINTS } from '../../../constants/endpoints';
import { createTeam, inviteMemberToTeam, deleteTeamByName, getTeams } from '../../../utils/team';

test.describe('Team Management - Owner Role Tests', () => {
  const testData = {
    teamName: 'Owner Test Team',
    teamDescription: 'Test Description',
    inviteEmail: 'test@gmail.com',
    memberEmail: 'member@gmail.com'
  };

  let teamPage: TeamPage;
  let teamDetailPage: TeamDetailPage;
  let authToken: string;
  let teamId: number;

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

  test.afterEach(async ({ request }) => {
    if (authToken) {
      await deleteTeamByName(request, authToken, testData.teamName);
    }
  });

  test.describe('Owner Permissions', () => {
    test('should have all owner permissions', async ({ page, request }) => {
      const teamData = await createTeam(request, authToken, testData.teamName, testData.teamDescription);
      teamId = teamData.id;
      
      await teamPage.clickRefresh();
      await teamPage.clickManage(testData.teamName);
      
      // Verify owner UI elements
      await teamDetailPage.checkOwnerUI();
      
      // Verify specific owner permissions
      await expect(page.locator('[data-cy=invite-member-button]')).toBeVisible();
      await expect(page.locator('[data-cy=team-settings-tab]')).toBeVisible();
      await expect(page.locator('[data-cy=disband-team-button]')).toBeVisible();
    });

    test('should see Manage and Delete buttons for owned teams', async ({ page, request }) => {
      const teamData = await createTeam(request, authToken, testData.teamName, testData.teamDescription);
      teamId = teamData.id;
      
      await teamPage.clickRefresh();
      await teamPage.manageButtonVisible(testData.teamName);
      await teamPage.deleteButtonVisible(testData.teamName);
    });
  });

  test.describe('Team Creation', () => {
    test('should create team successfully', async ({ page, request }) => {
      const teamData = await createTeam(request, authToken, testData.teamName, testData.teamDescription);
      teamId = teamData.id;
      
      await teamPage.clickRefresh();
      await teamPage.checkTeamVisible(testData.teamName);
      await teamPage.checkRoleText(testData.teamName, 'Owner');
    });
  });

  test.describe('Member Management', () => {
    test.beforeEach(async ({ request }) => {
      const teamData = await createTeam(request, authToken, testData.teamName, testData.teamDescription);
      teamId = teamData.id;
    });

    test('should invite member to team', async ({ page }) => {
      await teamPage.clickRefresh();
      await teamPage.clickManage(testData.teamName);
      
      await teamDetailPage.clickInviteMember();
      await teamDetailPage.fillInviteEmail(testData.inviteEmail);
      await page.waitForTimeout(1000);
      await teamDetailPage.confirmInvite();
      
      await expect(page.locator('text=Team member invited successfully')).toBeVisible({ timeout: 10000 });
    });

    test('should cancel pending invitation', async ({ page, request }) => {
      await inviteMemberToTeam(request, authToken, teamId.toString(), testData.inviteEmail);
      
      await teamPage.clickRefresh();
      await teamPage.clickManage(testData.teamName);
      
      await teamDetailPage.clickCancelPendingButton();
      await teamDetailPage.clickConfirmCancel();
      
      await expect(page.locator('text=Invitation cancelled successfully')).toBeVisible({ timeout: 10000 });
    });

    test('should remove team member', async ({ page, request }) => {
      await inviteMemberToTeam(request, authToken, teamId.toString(), testData.memberEmail);
      
      await teamPage.clickRefresh();
      await teamPage.clickManage(testData.teamName);
      
      await teamDetailPage.removeMemberByEmail(testData.memberEmail);
      await teamDetailPage.clickConfirmRemoveMember();
      
      await expect(page.locator('text=Team member removed successfully')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Ownership Management', () => {
    test.beforeEach(async ({ request }) => {
      const teamData = await createTeam(request, authToken, testData.teamName, testData.teamDescription);
      teamId = teamData.id;
    });

    test('should transfer team ownership', async ({ page, request }) => {
      await inviteMemberToTeam(request, authToken, teamId.toString(), testData.memberEmail);
      
      await teamPage.clickRefresh();
      await teamPage.clickManage(testData.teamName);
      
      await teamDetailPage.clickTransferOwnership();
      await teamDetailPage.clickDropdownChoice(testData.memberEmail);
      await teamDetailPage.clickConfirmTransferOwnership();
      
      await expect(page.locator('text=Ownership transferred successfully')).toBeVisible({ timeout: 10000 });
    });

    test('should delete team', async ({ page }) => {
      await teamPage.clickRefresh();
      await teamPage.clickManage(testData.teamName);
      
      await teamDetailPage.clickDeleteTeam();
      await teamDetailPage.clickConfirmDelete();
      
      await expect(page.locator('text=Team deleted successfully')).toBeVisible({ timeout: 10000 });
    });
  });
}); 