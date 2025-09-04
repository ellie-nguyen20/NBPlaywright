import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { InstancesPage } from '../../pages/InstancesPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Instances Page - Instance Actions', () => {
  let instancesPage: InstancesPage;

  test.beforeEach(async ({ page }) => {
    instancesPage = new InstancesPage(page);
    
    await expect(async () => {
      await instancesPage.navigateTo();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.INSTANCES), { timeout: 10000 });
    }).toPass({ timeout: 20000 });
  });

  test.describe('When user is Engineer Tier 3 or higher, he can deploy instance, power on, power off, delete instance', () => {
    test('should deploy RTX-A6000 instance successfully (UI real data)', async ({ page }) => {
      await instancesPage.clickDeploy();
      await instancesPage.selectGpuOption('$0.433/hr');
      await instancesPage.fillInstanceName('testInstance');
      await instancesPage.clickDeployConfirm();
      await instancesPage.checkInstanceRowDeploying({
        name: 'testInstance',
        region: 'CANADA',
        gpu: 'RTX-A6000',
        price: '$0.433/hr'
      });
    });

    test('should terminate instance successfully', async ({ page }) => {
      await page.waitForTimeout(180000); // 3 minutes wait
      await instancesPage.clickRefresh();
      const viewButton = await instancesPage.getViewButtonByInstanceName('testInstance');
      await viewButton.click();
      await instancesPage.terminateInstance();
      await instancesPage.checkTerminatedStatus();
    });
  });
});
