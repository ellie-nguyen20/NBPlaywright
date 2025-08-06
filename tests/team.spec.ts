import { test, expect } from '@playwright/test';
import { TeamPage } from '../pages/TeamPage';
import { LoginPage } from '../pages/LoginPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Team Page', () => {
  let teamPage: TeamPage;
  let loginPage: LoginPage;

  test.describe('when user has no teams', () => {
    test.beforeEach(async ({ page }) => {
      teamPage = new TeamPage(page);
      loginPage = new LoginPage(page);

      // Load credentials and login
      const creds = require('../fixtures/credential.json');
      
      await loginPage.visit();
      await loginPage.login(creds.valid.email, creds.valid.password);
      await loginPage.isLoggedIn(creds.valid.username);
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
      
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

      await teamPage.visit();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.TEAM));
    });

    test('should display empty state UI', async ({ page }) => {
      await teamPage.checkEmptyStateUI();
    });

    test('should click create team button', async ({ page }) => {
      await teamPage.clickCreateTeam();
    });
  });

  test.describe('when user has 100 teams', () => {
    test.beforeEach(async ({ page }) => {
      teamPage = new TeamPage(page);
      loginPage = new LoginPage(page);

      // Load credentials and login
      const creds = require('../fixtures/credential.json');
      
      await loginPage.visit();
      await loginPage.login(creds.valid.email, creds.valid.password);
      await loginPage.isLoggedIn(creds.valid.username);
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
      
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

      await teamPage.visit();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.TEAM));
    });

    test('should click create team button', async ({ page }) => {
      await teamPage.clickCreateTeam();
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
  });

  // Test different user roles
  const roleTests = [
    { role: 0, name: 'Owner Team', roleText: 'Owner', showManage: true, showDelete: true, showView: false },
    { role: 1, name: 'Admin Team', roleText: 'Admin', showManage: true, showDelete: false, showView: false },
    { role: 2, name: 'Member Team', roleText: 'Member', showManage: false, showDelete: false, showView: true },
  ];

  for (const { role, name, roleText, showManage, showDelete, showView } of roleTests) {
    test.describe(`when user is ${roleText.toLowerCase()} of the team`, () => {
      test.beforeEach(async ({ page }) => {
        teamPage = new TeamPage(page);
        loginPage = new LoginPage(page);

        // Load credentials and login
        const creds = require('../fixtures/credential.json');
        
        await loginPage.visit();
        await loginPage.login(creds.valid.email, creds.valid.password);
        await loginPage.isLoggedIn(creds.valid.username);
        await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
        
        const team = [{
          id: Math.floor(Math.random() * 1000),
          name,
          description: `This is your team as ${name}`,
          role,
          permissions: [],
          members: Math.floor(Math.random() * 20) + 1,
          created_at: Math.floor(Date.now() / 1000),
          owner: {
            id: 999,
            name: "Team Owner",
            tier: "OWNER_TIER"
          }
        }];

        await page.route('**/api/v1/teams?*', async route => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: team,
              message: "Teams retrieved successfully",
              status: "success"
            })
          });
        });

        await teamPage.visit();
        await expect(page).toHaveURL(new RegExp(ENDPOINTS.TEAM));
      });

      test(`should display the team list table with 1 team and correct buttons for ${roleText}`, async ({ page }) => {
        await teamPage.checkTeamListUI();
        await teamPage.checkTeamCount(1);
        await teamPage.checkTeamVisible(name);
        await teamPage.checkRoleText(name, roleText);
        
        if (showManage) {
          await teamPage.manageButtonVisible(roleText);
        } else {
          await teamPage.checkManageButtonNotExist();
        }
        
        if (showDelete) {
          await teamPage.deleteButtonVisible(roleText);
        } else {
          await teamPage.checkDeleteButtonNotExist();
        }
        
        if (showView) {
          await teamPage.viewButtonVisible(roleText);
        } else {
          await teamPage.checkViewButtonNotExist();
        }
      });
    });
  }
}); 