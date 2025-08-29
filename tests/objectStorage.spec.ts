import { test } from '../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { ObjectStoragePage } from '../pages/ObjectStoragePage';
import { ENDPOINTS } from '../constants/endpoints';
import { loginAndGetToken, loginByApiAndSetLocalStorage } from '../utils/auth';
import { createTeam, deleteTeam, createApiTeamKey } from '../utils/team';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Object Storage Page', () => {
  let objectStoragePage: ObjectStoragePage;
  let teamId: string;

  test.beforeEach(async ({ page }) => {
    objectStoragePage = new ObjectStoragePage(page);

    // Navigate to Object Storage page
    await objectStoragePage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.OBJECT_STORAGE));
  });

  test.describe('Check UI when user have no object storage', () => {
    test.beforeEach(async ({ page }) => {
      await mockObjectStorageList(page, [], "No object storage found.");
      await objectStoragePage.visit();
      await page.waitForResponse('**/api/v1/object-storage/**');
    });

    test('should display empty state UI and detail creating object storage modal', async ({ page }) => {
      await expect(async () => {
        await objectStoragePage.checkUI();
      }).toPass({ timeout: 10000 });
    });
  });

  test.describe('Check UI when user have 1 personal object storage, 1 team object storage', () => {
    test.skip('should display personal object storage', async ({ page }) => {
      await mockObjectStorageList(page, [
        {
          object_storage_name: 'personal',
          charges: 0.0,
          active: true,
          status: 'Ready',
          type: 1,
          location: 'canada',
          team: null,
          user: {
            id: 371,
            name: 'Ellie Nguyen',
            email: 'thivunguyen1506@gmail.com'
          }
        }
      ]);
      await objectStoragePage.visit();
      await page.waitForResponse('**/api/v1/object-storage/**');
      await objectStoragePage.checkObjectStorageTable('personal');
    });

    test.skip('should display team object storage', async ({ page }) => {
      await mockObjectStorageList(page, [
        {
          object_storage_name: 'team',
          charges: 0.0,
          active: true,
          status: 'Ready',
          type: 1,
          location: 'canada',
          team: {
            id: 8,
            name: 'my team',
            role: 0,
            permission: []
          },
          user: {
            id: 374,
            name: 'Ellie Nguyen',
            email: 'thivunguyen1506@gmail.com'
          }
        }
      ]);
      await objectStoragePage.visit();
      await page.waitForResponse('**/api/v1/object-storage/**');
      await objectStoragePage.checkObjectStorageTable('team');
    });
  });

  test.describe('Check functionalities of object storage', () => {
    const teamName = 'Test team apikey';
    const teamDesc = 'Test Description';

    test.beforeAll(async ({ request }) => {
      // Load credentials first
      const fixturePath = path.join(__dirname, '../fixtures/credential.json');
      const fixtureData = fs.readFileSync(fixturePath, 'utf8');
      const credentials = JSON.parse(fixtureData);

      // Login by API and get token
      const token = await loginAndGetToken(request, credentials.valid.email, credentials.valid.password);
      
      // Create team
      const team = await createTeam(request, token, teamName, teamDesc);
      teamId = team.id;

      // Create API key for team
      await createApiTeamKey(request, token, 'API Key for team', 'Test Description', teamId);
    });

    test.afterAll(async ({ request }) => {
      if (teamId) {
        // Load credentials for cleanup
        const fixturePath = path.join(__dirname, '../fixtures/credential.json');
        const fixtureData = fs.readFileSync(fixturePath, 'utf8');
        const credentials = JSON.parse(fixtureData);
        
        const token = await loginAndGetToken(request, credentials.valid.email, credentials.valid.password);
        await deleteTeam(request, token, teamId);
      }
    });

    test('should create personal object storage successfully', async ({ page }) => {
        await objectStoragePage.clickContinueCreatingObjectStorage();
    //   await page.waitForTimeout(2000);
    //   await objectStoragePage.checkDetailCreatingObjectStorage();
      await objectStoragePage.createObjectStorage('personal');
    });

    test('should create team object storage successfully', async ({ page }) => {
      await page.waitForTimeout(2000);
      await objectStoragePage.checkDetailCreatingObjectStorage();
      await objectStoragePage.selectTeam(teamName);
      await objectStoragePage.createObjectStorage('team');
    });

    test.skip('should create bucket successfully', async () => {});
    test.skip('should delete bucket successfully', async () => {});
    test.skip('should delete personal object storage successfully', async () => {});
    test.skip('should delete team object storage successfully', async () => {});
  });

  async function mockObjectStorageList(page: any, data: any[], message = "user object storage successfully retrieved") {
    await page.route('**/api/v1/object-storage/?limit=10&page=1&space_status=Ready', async (route: any) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data,
          meta: {
            total_count: data.length,
            page: 1,
            limit: 10,
            total_pages: data.length === 0 ? 0 : 1
          },
          message,
          status: 'success'
        })
      });
    });
  }
}); 