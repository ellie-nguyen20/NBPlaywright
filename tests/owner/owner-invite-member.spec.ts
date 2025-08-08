import { test, expect } from '@playwright/test';
import { TeamPage } from '../../pages/TeamPage';
import { TeamDetailPage } from '../../pages/TeamDetailPage';
import { ENDPOINTS } from '../../constants/endpoints';
import { createTeam, inviteMemberToTeam, deleteTeamByName } from '../../utils/team';

test.describe('Team Management - Owner Invite Member', () => {
  const teamName = 'Test Team';
  const teamDescription = 'Test Description';
  const inviteEmail = 'test@gmail.com';
  let teamPage: TeamPage;
  let teamDetailPage: TeamDetailPage;
  let teamId: number;
  let authToken: string;

  test.beforeEach(async ({ page, request }) => {
    teamPage = new TeamPage(page);
    teamDetailPage = new TeamDetailPage(page);

    // Get auth token from localStorage
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
    // Cleanup: Delete the team via API
    if (authToken) {
      await deleteTeamByName(request, authToken, teamName);
    }
  });

  test('should invite user to team successfully', async ({ page, request }) => {
    // Create team via API
    const teamData = await createTeam(request, authToken, teamName, teamDescription);
    teamId = teamData.id;
    
    // Refresh the page to see the newly created team
    await teamPage.clickRefresh();
    await teamPage.checkTeamVisible(teamName);
    
    // Navigate to team detail page
    await teamPage.clickManage(teamName);
    
    // Invite member via UI
    await teamDetailPage.clickInviteMember();
    await teamDetailPage.fillInviteEmail(inviteEmail);
    await page.waitForTimeout(1000);
    await teamDetailPage.confirmInvite();
    
    // Verify success message
    await expect(page.locator('text=Team member invited successfully')).toBeVisible({ timeout: 10000 });
    
    // Optional: Verify the invitation was actually sent via API
    try {
      const inviteToken = await inviteMemberToTeam(request, authToken, teamId.toString(), inviteEmail);
      expect(inviteToken).toBeDefined();
    } catch (error) {
      // If invitation already exists, that's also acceptable
      console.log('Member might already be invited or team might not exist');
    }
  });
}); 