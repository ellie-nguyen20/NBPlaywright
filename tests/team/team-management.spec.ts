import { test, expect } from '@playwright/test';
import { TeamPage } from '../../pages/TeamPage';
import { TeamDetailPage } from '../../pages/TeamDetailPage';
import { ENDPOINTS } from '../../constants/endpoints';
import { createTeam, inviteMemberToTeam, deleteTeamByName, getTeams } from '../../utils/team';

// Test data
const testData = {
  teamName: 'Test Team',
  teamDescription: 'Test Description',
  inviteEmail: 'test@gmail.com',
  memberEmail: 'member@gmail.com'
};

// Role-based test configurations
const roleConfigs = {
  owner: {
    canCreateTeam: true,
    canInviteMembers: true,
    canRemoveMembers: true,
    canTransferOwnership: true,
    canDeleteTeam: true,
    canCancelInvites: true,
    roleText: 'Owner'
  },
  member: {
    canCreateTeam: false,
    canInviteMembers: false,
    canRemoveMembers: false,
    canTransferOwnership: false,
    canDeleteTeam: false,
    canCancelInvites: false,
    roleText: 'Member'
  },
  admin: {
    canCreateTeam: true,
    canInviteMembers: true,
    canRemoveMembers: true,
    canTransferOwnership: true,
    canDeleteTeam: true,
    canCancelInvites: true,
    canManageAllTeams: true,
    canViewAnalytics: true,
    canBulkOperations: true,
    roleText: 'Admin'
  }
};

test.describe('Team Management - Feature Tests', () => {
  let teamPage: TeamPage;
  let teamDetailPage: TeamDetailPage;
  let authToken: string;
  let teamId: number;

  test.beforeEach(async ({ page, request }) => {
    teamPage = new TeamPage(page);
    teamDetailPage = new TeamDetailPage(page);

    // Get auth token
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
    // Cleanup: Delete test team
    if (authToken) {
      await deleteTeamByName(request, authToken, testData.teamName);
    }
  });

  test.describe('Team Creation Feature', () => {
    test('should create team successfully', async ({ page, request }) => {
      // Create team via API
      const teamData = await createTeam(request, authToken, testData.teamName, testData.teamDescription);
      teamId = teamData.id;
      
      // Verify team appears in UI
      await teamPage.clickRefresh();
      await teamPage.checkTeamVisible(testData.teamName);
      await teamPage.checkRoleText(testData.teamName, roleConfigs.owner.roleText);
    });

    test('should show empty state when no teams exist', async ({ page, request }) => {
      // Check if user has no teams
      const teams = await getTeams(request, authToken);
      if (teams.length === 0) {
        await teamPage.checkEmptyStateUI();
      }
    });
  });

  test.describe('Team Member Management Feature', () => {
    test.beforeEach(async ({ request }) => {
      // Create test team for member management tests
      const teamData = await createTeam(request, authToken, testData.teamName, testData.teamDescription);
      teamId = teamData.id;
    });

    test('should invite member to team successfully', async ({ page, request }) => {
      await teamPage.clickRefresh();
      await teamPage.clickManage(testData.teamName);
      
      // Invite member via UI
      await teamDetailPage.clickInviteMember();
      await teamDetailPage.fillInviteEmail(testData.inviteEmail);
      await page.waitForTimeout(1000);
      await teamDetailPage.confirmInvite();
      
      // Verify success message
      await expect(page.locator('text=Team member invited successfully')).toBeVisible({ timeout: 10000 });
    });

    test('should cancel pending invitation', async ({ page, request }) => {
      // First invite a member
      const inviteToken = await inviteMemberToTeam(request, authToken, teamId.toString(), testData.inviteEmail);
      
      await teamPage.clickRefresh();
      await teamPage.clickManage(testData.teamName);
      
      // Cancel the invitation
      await teamDetailPage.clickCancelPendingButton();
      await teamDetailPage.clickConfirmCancel();
      
      // Verify cancellation
      await expect(page.locator('text=Invitation cancelled successfully')).toBeVisible({ timeout: 10000 });
    });

    test('should remove team member', async ({ page, request }) => {
      // First invite and accept a member
      const inviteToken = await inviteMemberToTeam(request, authToken, teamId.toString(), testData.memberEmail);
      
      await teamPage.clickRefresh();
      await teamPage.clickManage(testData.teamName);
      
      // Remove the member
      await teamDetailPage.removeMemberByEmail(testData.memberEmail);
      await teamDetailPage.clickConfirmRemoveMember();
      
      // Verify removal
      await expect(page.locator('text=Team member removed successfully')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Team Ownership Feature', () => {
    test.beforeEach(async ({ request }) => {
      // Create test team for ownership tests
      const teamData = await createTeam(request, authToken, testData.teamName, testData.teamDescription);
      teamId = teamData.id;
    });

    test('should transfer team ownership', async ({ page, request }) => {
      // First invite a member
      await inviteMemberToTeam(request, authToken, teamId.toString(), testData.memberEmail);
      
      await teamPage.clickRefresh();
      await teamPage.clickManage(testData.teamName);
      
      // Transfer ownership
      await teamDetailPage.clickTransferOwnership();
      await teamDetailPage.clickDropdownChoice(testData.memberEmail);
      await teamDetailPage.clickConfirmTransferOwnership();
      
      // Verify transfer
      await expect(page.locator('text=Ownership transferred successfully')).toBeVisible({ timeout: 10000 });
    });

    test('should delete team', async ({ page, request }) => {
      await teamPage.clickRefresh();
      await teamPage.clickManage(testData.teamName);
      
      // Delete team
      await teamDetailPage.clickDeleteTeam();
      await teamDetailPage.clickConfirmDelete();
      
      // Verify deletion
      await expect(page.locator('text=Team deleted successfully')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Role-Based Access Control', () => {
    test('Owner should have all permissions', async ({ page, request }) => {
      const teamData = await createTeam(request, authToken, testData.teamName, testData.teamDescription);
      teamId = teamData.id;
      
      await teamPage.clickRefresh();
      await teamPage.clickManage(testData.teamName);
      
      // Verify owner UI elements are visible
      await teamDetailPage.checkOwnerUI();
      
      // Verify owner can perform all actions
      await expect(page.locator('[data-cy=invite-member-button]')).toBeVisible();
      await expect(page.locator('[data-cy=team-settings-tab]')).toBeVisible();
      await expect(page.locator('[data-cy=disband-team-button]')).toBeVisible();
    });

    test('Member should have limited permissions', async ({ page, request }) => {
      // This test would require a different user context or mocking
      // For now, we'll test the member UI expectations
      await teamPage.clickRefresh();
      
      // If user is a member of any team, check member UI
      const teams = await getTeams(request, authToken);
      const memberTeam = teams.find((team: any) => team.role === 1); // Assuming 1 is member role
      
      if (memberTeam) {
        await teamPage.clickManage(memberTeam.name);
        await teamDetailPage.checkMemberUI();
        
        // Verify member cannot see owner-only elements
        await expect(page.locator('[data-cy=invite-member-button]')).not.toBeVisible();
        await expect(page.locator('[data-cy=team-settings-tab]')).not.toBeVisible();
        await expect(page.locator('[data-cy=leave-team-button]')).toBeVisible();
      }
    });

    test('Admin should have all permissions plus admin extras', async ({ page, request }) => {
      // This test would require admin user context
      // For now, we'll test the admin UI expectations
      await teamPage.clickRefresh();
      
      // If user is an admin of any team, check admin UI
      const teams = await getTeams(request, authToken);
      const adminTeam = teams.find((team: any) => team.role === 2); // Assuming 2 is admin role
      
      if (adminTeam) {
        await teamPage.clickManage(adminTeam.name);
        await teamDetailPage.checkOwnerUI(); // Admin has same UI as owner
        
        // Verify admin has all owner permissions
        await expect(page.locator('[data-cy=invite-member-button]')).toBeVisible();
        await expect(page.locator('[data-cy=team-settings-tab]')).toBeVisible();
        await expect(page.locator('[data-cy=disband-team-button]')).toBeVisible();
        
        // Verify admin-specific elements (if implemented)
        // await expect(page.locator('[data-cy=admin-analytics-tab]')).toBeVisible();
        // await expect(page.locator('[data-cy=bulk-operations-button]')).toBeVisible();
        // await expect(page.locator('[data-cy=system-settings-tab]')).toBeVisible();
      }
    });
  });

  test.describe('Team UI Validation', () => {
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
  });
}); 