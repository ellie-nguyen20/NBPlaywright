import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { InstancesPage } from '../../pages/InstancesPage';
import { ENDPOINTS } from '../../constants/endpoints';

test.describe('Instances Page - Instance Status - When user have 4 GPUs with various statuses', () => {
  let instancesPage: InstancesPage;

  test.beforeEach(async ({ page }) => {
    instancesPage = new InstancesPage(page);
  });

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
          email: 'thivunguyen1506@gmail.com',
        },
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
          }),
        });
      });

      await instancesPage.navigateTo();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.INSTANCES));

      await instancesPage.checkInstanceListUI();
      await instancesPage.checkStatus(status);
    });
  }

  test('should display all UI fields for instance correctly', async ({ page }) => {
    const instance = {
      name: 'gpu-Running',
      id: 'mock-id',
      dc_id: 3,
      region: 'Montreal',
      product_type: 'Virtual Machine',
      host_name: 'gpu-Running',
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
        email: 'thivunguyen1506@gmail.com',
      },
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
        }),
      });
    });

    await instancesPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.INSTANCES));

    await instancesPage.checkTableColumns();
    await instancesPage.checkInstanceRowFields(instance);
  });

  test('should display correct instance detail after clicking View', async ({ page }) => {
    const instance = {
      name: 'gpu-Running',
      id: 'mock-id',
      dc_id: 3,
      region: 'Montreal',
      product_type: 'Virtual Machine',
      host_name: 'gpu-Running',
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
        email: 'thivunguyen1506@gmail.com',
      },
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
        }),
      });
    });

    await instancesPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.INSTANCES));

    // Mock instance detail API
    const detailData = {
      id: 'mock-id',
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
      image: null,
    };

    await page.route('**/api/v1/computing/instance/mock-id', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [detailData],
          message: 'Get instance detail successfully',
          status: 'success',
        }),
      });
    });

    const viewButton = await instancesPage.getViewButtonByInstanceName(instance.name);
    await viewButton.click();

    await instancesPage.checkInstanceDefaultFields();
    await instancesPage.checkInstanceDetailFields(detailData);
  });

  test('should verify page responsiveness on different screen sizes', async ({ page }) => {
    const instance = {
      name: 'gpu-Running',
      id: 'mock-id',
      dc_id: 3,
      region: 'Montreal',
      product_type: 'Virtual Machine',
      host_name: 'gpu-Running',
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
        email: 'thivunguyen1506@gmail.com',
      },
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
        }),
      });
    });

    await instancesPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.INSTANCES));

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await instancesPage.checkInstanceListUI();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await instancesPage.checkInstanceListUI();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await instancesPage.checkInstanceListUI();
  });
});
