import { test, expect } from '@playwright/test';
import { TeamPage } from '../pages/TeamPage';
import { LoginPage } from '../pages/LoginPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Team Page - User Roles UI', () => {
  let teamPage: TeamPage;

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

        await teamPage.navigateTo();
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