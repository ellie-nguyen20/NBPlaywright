import { test, expect } from '@playwright/test';
import { InstancesPage } from '../pages/InstancesPage';
import { DeployInstancePage } from '../pages/DeployInstancePage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe('Instances Page', () => {
  let instancesPage: InstancesPage;
  let deployInstancePage: DeployInstancePage;

  test.beforeEach(async ({ page }) => {
    instancesPage = new InstancesPage(page);
    deployInstancePage = new DeployInstancePage(page);
    
    await instancesPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.INSTANCES));
  });

  test.describe('Check UI when user have no instance', () => {
    test.beforeEach(async ({ page }) => {
      // Mock empty instances list API
      await page.route('**/api/v1/computing/instances?limit=10&offset=1&type=0', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [],
            total_instance: 0,
            message: 'All instances retrieved successfully',
            status: 'success',
          })
        });
      });

      await instancesPage.visit();
    });

    test('should display empty state UI', async ({ page }) => {
      await instancesPage.checkUI();
    });
  });

  test.describe('Check UI Deploy Instance Page', () => {
    test('should show instance table when there are deployed instances', async ({ page }) => {
      await instancesPage.checkInstanceTable();
    });

    test('should show deploy instance page and all required fields after clicking Deploy', async ({ page }) => {
      await instancesPage.clickDeploy();
      await deployInstancePage.checkDeployPageUI();
    });

    test('should show out-of-stock status for all hardware', async ({ page }) => {
      await instancesPage.clickDeploy();
      await deployInstancePage.checkAllHardwareOutOfStock();
    });
  });

  test.describe('When user have 4 GPUs with various statuses', () => {
    const statuses = ['Deploying', 'Running', 'Deleted', 'Deleting'];
    
    for (const status of statuses) {
      test(`should display instance with status "${status}"`, async ({ page }) => {
        const instance = {
          name: `gpu-${status}`,
          id: `mock-id-${statuses.indexOf(status)}`,
          dc_id: 3,
          region: 'Montreal',
          product_type: 'Virtual Machine',
          host_name: `gpu-${status}`,
          cpu_cores: 96,
          cpu_model: 'INTEL(R) XEON(R) PLATINUM 8558',
          cpu_count: '2',
          ram: 2048,
          gpu: 'H100-80G-SXM',
          gpu_type: 'H100',
          gpu_count: 8,
          disk_size: 14336,
          ephemeral: 0,
          public_ipv4: '127.0.0.1',
          price_per_hour: 14.4,
          os: '',
          status: status,
          team_id: null,
          created_at: Date.now() / 1000,
          type: 1,
          started_at: Date.now() / 1000 + 600,
          ended_at: Date.now() / 1000 + 3600,
          team: null,
          user: {
            id: 123,
            name: 'Ellie Nguyen',
            email: 'thivunguyen1506@gmail.com'
          }
        };

        // Mock instances list API
        await page.route('**/api/v1/computing/instances?limit=10&offset=1&type=0', async route => {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              data: [instance],
              total_instance: 1,
              message: 'All instances retrieved successfully',
              status: 'success',
            })
          });
        });

        await instancesPage.visit();
        await expect(page).toHaveURL(new RegExp(ENDPOINTS.INSTANCES));
        await instancesPage.checkInstanceListUI();
        await instancesPage.checkStatus(status);
      });
    }

    test('should display all UI fields for instance correctly', async ({ page }) => {
      const instance = {
        name: `gpu-Running`,
        id: `mock-id`,
        dc_id: 3,
        region: 'Montreal',
        product_type: 'Virtual Machine',
        host_name: `gpu-Running`,
        cpu_cores: 96,
        cpu_model: 'INTEL(R) XEON(R) PLATINUM 8558',
        cpu_count: '2',
        ram: 2048,
        gpu: 'H100-80G-SXM',
        gpu_type: 'H100',
        gpu_count: 8,
        disk_size: 14336,
        ephemeral: 0,
        public_ipv4: '127.0.0.1',
        price_per_hour: 14.4,
        os: '',
        status: 'Running',
        team_id: null,
        created_at: Date.now() / 1000,
        type: 1,
        started_at: Date.now() / 1000 + 600,
        ended_at: Date.now() / 1000 + 3600,
        team: null,
        user: {
          id: 123,
          name: 'Ellie Nguyen',
          email: 'thivunguyen1506@gmail.com'
        }
      };

      // Mock instances list API
      await page.route('**/api/v1/computing/instances?limit=10&offset=1&type=0', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [instance],
            total_instance: 1,
            message: 'All instances retrieved successfully',
            status: 'success',
          })
        });
      });

      await instancesPage.visit();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.INSTANCES));
      await instancesPage.checkTableColumns();
      await instancesPage.checkInstanceRowFields(instance);
    });

    test('should display correct instance detail after clicking View', async ({ page }) => {
      const instance = {
        name: `gpu-Running`,
        id: `mock-id`,
        dc_id: 3,
        region: 'Montreal',
        product_type: 'Virtual Machine',
        host_name: `gpu-Running`,
        cpu_cores: 96,
        cpu_model: 'INTEL(R) XEON(R) PLATINUM 8558',
        cpu_count: '2',
        ram: 2048,
        gpu: 'H100-80G-SXM',
        gpu_type: 'H100',
        gpu_count: 8,
        disk_size: 14336,
        ephemeral: 0,
        public_ipv4: '127.0.0.1',
        price_per_hour: 14.4,
        os: '',
        status: 'Running',
        team_id: null,
        created_at: Date.now() / 1000,
        type: 1,
        started_at: Date.now() / 1000 + 600,
        ended_at: Date.now() / 1000 + 3600,
        team: null,
        user: {
          id: 123,
          name: 'Ellie Nguyen',
          email: 'thivunguyen1506@gmail.com'
        }
      };

      // Mock instances list API
      await page.route('**/api/v1/computing/instances?limit=10&offset=1&type=0', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [instance],
            total_instance: 1,
            message: 'All instances retrieved successfully',
            status: 'success',
          })
        });
      });

      await instancesPage.visit();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.INSTANCES));

      // Mock instance detail API
      const detailData = {
        id: `mock-id`,
        dc_id: 3,
        region: 'Montreal',
        product_type: 'Virtual Machine',
        host_name: 'testRI04',
        cpu_cores: 96,
        cpu_model: 'INTEL(R) XEON(R) PLATINUM 8558',
        cpu_count: '2',
        ram: 2048,
        gpu: 'H100-80G-SXM',
        gpu_type: 'H100',
        gpu_count: 8,
        disk_size: 14336,
        ephemeral: 0,
        public_ipv4: 't',
        lan_ipv4: null,
        login_method: '',
        os: '',
        exposed_ports: '',
        user_name: 't',
        password: 't',
        status: 'Completed',
        start_time: '2025-07-04 05:13:11 EST',
        running_time: '66.9070 hours',
        total_cost: '$961.5400',
        team_id: null,
        created_at: 1751620391,
        type: 1,
        started_at: 1751623200,
        ended_at: 1751626800,
        username: 't',
        bandwidth: 1024,
        image: null
      };

      await page.route(`**/api/v1/computing/instance/mock-id`, async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [detailData],
            message: 'Get instance detail successfully',
            status: 'success'
          })
        });
      });

      const viewButton = await instancesPage.getViewButtonByInstanceName(instance.name);
      await viewButton.click();

      await instancesPage.checkInstanceDefaultFields();
      await instancesPage.checkInstanceDetailFields(detailData);
    });
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