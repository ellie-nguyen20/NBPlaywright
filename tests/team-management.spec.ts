import { test, expect } from '@playwright/test';
import { TeamPage } from '../pages/TeamPage';
import { TeamDetailPage } from '../pages/TeamDetailPage';
import { LoginPage } from '../pages/LoginPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Team Management', () => {
  const teamName = 'Test Team';
  let teamPage: TeamPage;
  let teamDetailPage: TeamDetailPage;
  let loginPage: LoginPage;

  test.describe('when user is Owner, he can create, delete team', () => {
    test.beforeEach(async ({ page }) => {
      teamPage = new TeamPage(page);
      teamDetailPage = new TeamDetailPage(page);
      loginPage = new LoginPage(page);

      // Load credentials and login
      const creds = require('../fixtures/credential.json');
      
      await loginPage.visit();
      await loginPage.login(creds.valid.email, creds.valid.password);
      await loginPage.isLoggedIn(creds.valid.username);
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
      
      await teamPage.visit();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.TEAM));
    });

    test('should create new team successfully', async ({ page }) => {
      await teamPage.clickCreateTeam();
      await teamPage.fillTeamName(teamName);
      await teamPage.fillTeamDescription('Test Description');
      await teamPage.confirmCreate();
      await expect(page.locator('text=Team created successfully')).toBeVisible();
    });

    test('should delete team successfully', async ({ page }) => {
      await teamPage.clickDelete(teamName);
      await teamPage.confirmDelete();
      await expect(page.locator('text=Team deleted successfully')).toBeVisible();
    });
  });

  test.describe('when user is Owner, he can invite member, cancel pending invitation, remove member, transfer ownership', () => {
    let teamId: number;

    test.beforeEach(async ({ page }) => {
      teamPage = new TeamPage(page);
      teamDetailPage = new TeamDetailPage(page);
      loginPage = new LoginPage(page);

      // Load credentials and login
      const creds = require('../fixtures/credential.json');
      
      await loginPage.visit();
      await loginPage.login(creds.valid.email, creds.valid.password);
      await loginPage.isLoggedIn(creds.valid.username);
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
      
      await teamPage.visit();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.TEAM));
    });

    test('should invite user to team successfully', async ({ page }) => {
      // Mock team creation API
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

      // Mock team list API
      await page.route('**/api/v1/teams?*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [{ id: 123, name: teamName, role: 0 }],
            message: "Teams retrieved successfully",
            status: "success"
          })
        });
      });

      // Mock invite API
      await page.route('**/api/v1/teams/*/invite', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: "Team member invited successfully",
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
      await teamDetailPage.clickInviteMember();
      await teamDetailPage.fillInviteEmail('test@gmail.com');
      await page.waitForTimeout(1000);
      await teamDetailPage.confirmInvite();
      await expect(page.locator('text=Team member invited successfully')).toBeVisible({ timeout: 10000 });
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

    test('should remove member from the team successfully', async ({ page }) => {
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

      // Mock remove member API
      await page.route('**/api/v1/teams/*/members/*', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: "Member removed successfully",
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
      await teamDetailPage.removeMemberByEmail('thivunguyen1506+member1@gmail.com');
      await teamDetailPage.clickConfirmRemoveMember();
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

  // Commented out tests for future implementation
  /*
  test.describe('when user is Owner, he can edit roles and permissions of all team members', () => {
    test.beforeEach(async ({ page }) => {
      // Setup code
    });

    test('should edit roles successfully', async ({ page }) => {
      // Test implementation
    });

    test('should edit permissions successfully', async ({ page }) => {
      // Test implementation
    });
  });

  test.describe('when user is Admin', () => {
    test.beforeEach(async ({ page }) => {
      // Setup code
    });

    test('should delete team successfully', async ({ page }) => {
      // Test implementation
    });

    test('should invite user to team successfully', async ({ page }) => {
      // Test implementation
    });

    test('should Edit roles and permissions of the team member successfully', async ({ page }) => {
      // Test implementation
    });
  });
  */
}); 