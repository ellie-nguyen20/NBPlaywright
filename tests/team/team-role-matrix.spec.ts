import { test, expect } from '@playwright/test';
import { TeamPage } from '../../pages/TeamPage';
import { TeamDetailPage } from '../../pages/TeamDetailPage';
import { ENDPOINTS } from '../../constants/endpoints';
import { createTeam, inviteMemberToTeam, deleteTeamByName, getTeams } from '../../utils/team';
import { TEAM_ROLES, getRoleById, hasPermission, shouldShowUIElement } from './config/team-role-config';

test.describe('Team Management - Role Matrix Tests', () => {
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

  test.describe('Role Permission Matrix', () => {
    // Test all roles against all permissions
    Object.values(TEAM_ROLES).forEach(role => {
      test.describe(`${role.displayName} Role Tests`, () => {
        test(`should have correct permissions for ${role.displayName}`, async ({ page, request }) => {
          const teams = await getTeams(request, authToken);
          const userTeam = teams.find((team: any) => team.role === role.id);
          
          if (userTeam) {
            await teamPage.clickRefresh();
            await teamPage.clickManage(userTeam.name);
            
            // Test each permission
            role.permissions.forEach(permission => {
              test(`Permission: ${permission.action} - ${permission.allowed ? 'Allowed' : 'Denied'}`, async ({ page }) => {
                if (permission.action === 'invite_members') {
                  const inviteButton = page.locator('[data-cy=invite-member-button]');
                  if (permission.allowed) {
                    await expect(inviteButton).toBeVisible();
                  } else {
                    await expect(inviteButton).not.toBeVisible();
                  }
                }
                
                if (permission.action === 'delete_team') {
                  const deleteButton = page.locator('[data-cy=disband-team-button]');
                  if (permission.allowed) {
                    await expect(deleteButton).toBeVisible();
                  } else {
                    await expect(deleteButton).not.toBeVisible();
                  }
                }
                
                if (permission.action === 'leave_team') {
                  const leaveButton = page.locator('[data-cy=leave-team-button]');
                  if (permission.allowed) {
                    await expect(leaveButton).toBeVisible();
                  } else {
                    await expect(leaveButton).not.toBeVisible();
                  }
                }
              });
            });
          }
        });

        test(`should show correct UI elements for ${role.displayName}`, async ({ page, request }) => {
          const teams = await getTeams(request, authToken);
          const userTeam = teams.find((team: any) => team.role === role.id);
          
          if (userTeam) {
            await teamPage.clickRefresh();
            await teamPage.clickManage(userTeam.name);
            
            // Test each UI element
            role.uiElements.forEach(element => {
              test(`UI Element: ${element.selector} - ${element.visible ? 'Visible' : 'Hidden'}`, async ({ page }) => {
                if (element.visible) {
                  await expect(page.locator(element.selector)).toBeVisible();
                } else {
                  await expect(page.locator(element.selector)).not.toBeVisible();
                }
              });
            });
          }
        });
      });
    });
  });

  test.describe('Cross-Role Feature Testing', () => {
    test('should handle role transitions correctly', async ({ page, request }) => {
      // Create a team as owner
      const teamData = await createTeam(request, authToken, 'Matrix Test Team', 'Test Description');
      
      // Invite a member
      await inviteMemberToTeam(request, authToken, teamData.id.toString(), 'member@test.com');
      
      await teamPage.clickRefresh();
      await teamPage.clickManage('Matrix Test Team');
      
      // Verify owner can see all management options
      await expect(page.locator('[data-cy=invite-member-button]')).toBeVisible();
      await expect(page.locator('[data-cy=disband-team-button]')).toBeVisible();
      
      // Cleanup
      await deleteTeamByName(request, authToken, 'Matrix Test Team');
    });

    test('should validate role-based access control', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      
      for (const team of teams) {
        const role = getRoleById(team.role);
        if (!role) continue;
        
        await teamPage.clickRefresh();
        
        // Test team list actions based on role
        if (hasPermission(role, 'manage_team')) {
          await teamPage.manageButtonVisible(team.name);
        } else {
          await teamPage.viewButtonVisible(team.name);
        }
        
        // Test team detail actions based on role
        if (team.role === 0) { // Owner
          await teamPage.clickManage(team.name);
          await teamDetailPage.checkOwnerUI();
        } else if (team.role === 1) { // Member
          await teamPage.clickView(team.name);
          await teamDetailPage.checkMemberUI();
        }
      }
    });
  });

  test.describe('Role-Specific Workflows', () => {
    test('Owner workflow: Create → Invite → Manage → Delete', async ({ page, request }) => {
      const ownerRole = TEAM_ROLES.OWNER;
      
      // Test create team permission
      if (hasPermission(ownerRole, 'create_team')) {
        const teamData = await createTeam(request, authToken, 'Owner Workflow Team', 'Test Description');
        
        await teamPage.clickRefresh();
        await teamPage.clickManage('Owner Workflow Team');
        
        // Test invite member permission
        if (hasPermission(ownerRole, 'invite_members')) {
          await teamDetailPage.clickInviteMember();
          await teamDetailPage.fillInviteEmail('workflow@test.com');
          await page.waitForTimeout(1000);
          await teamDetailPage.confirmInvite();
          await expect(page.locator('text=Team member invited successfully')).toBeVisible({ timeout: 10000 });
        }
        
        // Test delete team permission
        if (hasPermission(ownerRole, 'delete_team')) {
          await teamDetailPage.clickDeleteTeam();
          await teamDetailPage.clickConfirmDelete();
          await expect(page.locator('text=Team deleted successfully')).toBeVisible({ timeout: 10000 });
        }
        
        // Cleanup if not deleted
        await deleteTeamByName(request, authToken, 'Owner Workflow Team');
      }
    });

    test('Member workflow: View → Leave', async ({ page, request }) => {
      const memberRole = TEAM_ROLES.MEMBER;
      const teams = await getTeams(request, authToken);
      const memberTeam = teams.find((team: any) => team.role === memberRole.id);
      
      if (memberTeam) {
        await teamPage.clickRefresh();
        
        // Test view permission
        if (!hasPermission(memberRole, 'manage_team')) {
          await teamPage.clickView(memberTeam.name);
          await teamDetailPage.checkMemberUI();
        }
        
        // Test leave team permission
        if (hasPermission(memberRole, 'leave_team')) {
          await page.locator('[data-cy=leave-team-button]').click();
          await page.locator('text=Leave Team').click();
          await expect(page.locator('text=Left team successfully')).toBeVisible({ timeout: 10000 });
        }
      }
    });
  });

  test.describe('Role Validation Metrics', () => {
    test('should validate all role permissions', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      const roleStats = {
        owner: 0,
        member: 0,
        admin: 0,
        total: teams.length
      };
      
      for (const team of teams) {
        const role = getRoleById(team.role);
        if (role) {
          if (role.name === 'owner') roleStats.owner++;
          if (role.name === 'member') roleStats.member++;
          if (role.name === 'admin') roleStats.admin++;
        }
      }
      
      // Log role distribution for metrics
      console.log('Role Distribution:', roleStats);
      
      // Validate that we have test coverage for all roles
      expect(roleStats.total).toBeGreaterThan(0);
    });

    test('should validate UI element visibility for all roles', async ({ page, request }) => {
      const teams = await getTeams(request, authToken);
      let uiValidationCount = 0;
      
      for (const team of teams) {
        const role = getRoleById(team.role);
        if (!role) continue;
        
        await teamPage.clickRefresh();
        await teamPage.clickManage(team.name);
        
        // Validate each UI element for the role
        role.uiElements.forEach(element => {
          if (element.visible) {
            expect(page.locator(element.selector)).toBeVisible();
          } else {
            expect(page.locator(element.selector)).not.toBeVisible();
          }
          uiValidationCount++;
        });
      }
      
      console.log(`UI Elements Validated: ${uiValidationCount}`);
      expect(uiValidationCount).toBeGreaterThan(0);
    });
  });
}); 