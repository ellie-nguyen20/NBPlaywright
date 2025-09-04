import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { InstancesPage } from '../../pages/InstancesPage';
import { DeployInstancePage } from '../../pages/DeployInstancePage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Deploy Instance Page - Check UI Deploy Instance Page', () => {
  let instancesPage: InstancesPage;
  let deployInstancePage: DeployInstancePage;

  test.beforeEach(async ({ page }) => {
    instancesPage = new InstancesPage(page);
    deployInstancePage = new DeployInstancePage(page);
    
    await expect(async () => {
      await instancesPage.navigateTo();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.INSTANCES), { timeout: 10000 });
    }).toPass({ timeout: 20000 });
  });

    test('should show instance table when there are deployed instances', async ({ page }) => {
      await instancesPage.checkInstanceTable();
    });

    test('should show deploy instance page and all required fields after clicking Deploy', async ({ page }) => {
      await instancesPage.clickDeploy();
      await deployInstancePage.checkDeployPageUI();
    });

});

