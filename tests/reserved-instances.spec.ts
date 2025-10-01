import { test } from '../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { ReservedInstancesPage } from '../pages/ReservedInstancesPage';
import { ENDPOINTS } from '../constants/endpoints';

test.describe.skip('Reserved Instances Page', () => {
  const statuses = ['Booked', 'Canceled', 'Provisioning', 'Completed', 'Running'];
  let reservedInstancesPage: ReservedInstancesPage;

  test.beforeEach(async ({ page }) => {
    reservedInstancesPage = new ReservedInstancesPage(page);
    await reservedInstancesPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.RESERVED_INSTANCES));
  });

  test.describe('when user have 5 GPUs with various statuses', () => {
    const instances = statuses.map((status, index) => ({
      name: `GPU-${status}`,
      id: `mock-id-${index}`,
      dc_id: 3,
      region: 'Montreal',
      product_type: 'Baremetal',
      host_name: `gpu-${status.toLowerCase()}`,
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
      user: {
        id: 123,
        name: 'Ellie Nguyen',
        email: 'thivunguyen1506@gmail.com'
      }
    }));

    test.beforeEach(async ({ page }) => {
      // Mock reserved instances list API
      await page.route('**/api/v1/computing/instances?limit=10&offset=1&type=1', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: instances,
            total_instance: instances.length,
            message: 'All instances retrieved successfully',
            status: 'success',
          })
        });
      });

      await reservedInstancesPage.visit();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.RESERVED_INSTANCES));
    });

    test('should display all UI fields for instance correctly', async ({ page }) => {
      await reservedInstancesPage.checkTableColumns();
      await reservedInstancesPage.checkInstanceRowFields(instances[0]);
    });

    test('should display correct instance detail after clicking View', async ({ page }) => {
      const instanceId = instances[0].id;
      const instanceName = instances[0].name;
      const detailData = {
        id: instanceId,
        dc_id: 3,
        region: 'Montreal',
        product_type: 'Baremetal',
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

      // Mock instance detail API
      await page.route(`**/api/v1/computing/instance/${instanceId}`, async route => {
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

      const viewButton = await reservedInstancesPage.getViewButtonByInstanceName(instanceName);
      await viewButton.click();

      await reservedInstancesPage.checkInstanceDefaultFields();
      await reservedInstancesPage.checkInstanceDetailFields(detailData);
    });

    for (const status of statuses) {
      test(`should display instance with status "${status}"`, async ({ page }) => {
        await reservedInstancesPage.checkInstanceListUI();
        await reservedInstancesPage.checkStatus(status);
      });
    }
  });

  test.describe('when user have no reserved instance', () => {
    test.beforeEach(async ({ page }) => {
      // Mock empty reserved instances list API
      await page.route('**/api/v1/computing/instances?limit=10&offset=1&type=1', async route => {
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

      await reservedInstancesPage.visit();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.RESERVED_INSTANCES));
    });

    test('should display empty state UI', async ({ page }) => {
      await reservedInstancesPage.checkUI();
    });
  });
}); 