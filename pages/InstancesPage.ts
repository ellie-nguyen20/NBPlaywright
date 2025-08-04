/**
 * Instances Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

const SELECTOR_ACTIVE_CHECKBOX = 'label.el-checkbox';
const SELECTOR_DEPLOY_BUTTON = 'div.refresh.refresh-active.text-center.pointer';
const SELECTOR_INSTANCE_TABLE = '.el-table__body';

export class InstancesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Navigate to the Instances page
  async visit() {
    await this.page.locator('.el-menu-item:has-text("Instances")').click({ force: true });
  }

  // Check UI when there are no instances
  async checkUI() {
    await expect(this.page.locator('text=Start Using GPU Instances')).toBeVisible();
    await expect(this.page.locator('text=Launch your first GPU instance for ML, training, or rendering tasks.')).toBeVisible();
    await expect(this.page.locator('text=Continue')).toBeVisible();
  }

  // Check the instance table is present and has at least one row
  async checkInstanceTable() {
    await expect(this.page.locator(SELECTOR_INSTANCE_TABLE)).toBeVisible();
    const rows = this.page.locator(SELECTOR_INSTANCE_TABLE + ' tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  }

  // Click the Deploy button
  async clickDeploy() {
    await this.page.locator(SELECTOR_DEPLOY_BUTTON).click();
  }

  async checkInstanceListUI() {
    await expect(this.page.locator('tbody')).toBeVisible();
    const rows = this.page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  }

  async checkTableColumns() {
    const columns = [
      'Instance Name',
      'Team/Personal',
      'Location',
      'Type',
      'vCPU',
      'Memory',
      'Storage',
      'Price',
      'Status'
    ];
    
    for (const col of columns) {
      await expect(this.page.locator(`th:has-text("${col}")`)).toBeVisible();
    }
  }

  async checkInstanceRowFields(instance: any) {
    await expect(this.page.locator(`td:has-text("${instance.name}")`)).toBeVisible();
    await expect(this.page.locator('td:has-text("Personal")')).toBeVisible();
    await expect(this.page.locator(`td:has-text("${instance.region}")`)).toBeVisible();
    await expect(this.page.locator(`td:has-text("${instance.gpu}")`)).toBeVisible();
    await expect(this.page.locator(`td:has-text("${instance.cpu_cores}")`)).toBeVisible();
    await expect(this.page.locator(`td:has-text("${instance.ram / 1024} TB")`)).toBeVisible();
    await expect(this.page.locator(`td:has-text("${instance.disk_size / 1024} TB")`)).toBeVisible();
    await expect(this.page.locator(`td:has-text("$${instance.price_per_hour}/hr")`)).toBeVisible();
    await expect(this.page.locator(`td:has-text("${instance.status}")`)).toBeVisible();
    await expect(this.page.locator(`tr:has-text("${instance.name}")`).locator('text=View')).toBeVisible();
  }

  async getViewButtonByInstanceName(name: string) {
    return this.page.locator(`tr:has-text("${name}")`).locator('text=View');
  }

  async checkInstanceDefaultFields() {
    await expect(this.page.locator('text=Instance Details')).toBeVisible();
    await expect(this.page.locator('text=Virtual Machine')).toBeVisible();
    await expect(this.page.locator('text=Personal')).toBeVisible();
    await expect(this.page.locator('text=Name:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Status:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Location:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Served:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Total Cost:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Instance Started:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=OS/Image:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=LAN IP Address:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Public IP Address:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=GPU:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=vCPU:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Memory:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Disk/Ephemeral:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Username:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Password:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Terminate')).toBeVisible();
    await expect(this.page.locator('text=Connect to Your Instance')).toBeVisible();
    await expect(this.page.locator('text=Instructions')).toBeVisible();
  }

  async checkInstanceDetailFields(detail: any) {
    await expect(this.page.locator('text=Instance Details')).toBeVisible();
    
    const statusElement = this.page.locator('text=Status:').locator('xpath=following-sibling::*[1]');
    await expect(statusElement).toHaveText(detail.status);
    
    const locationElement = this.page.locator('text=Location:').locator('xpath=following-sibling::*[1]');
    await expect(locationElement).toHaveText(detail.region);
    
    const gpuElement = this.page.locator('text=GPU:').locator('xpath=following-sibling::*[1]');
    await expect(gpuElement).toContainText(detail.gpu);
    
    const cpuElement = this.page.locator('text=vCPU:').locator('xpath=following-sibling::*[1]');
    await expect(cpuElement).toContainText(detail.cpu_cores);
    
    const memoryElement = this.page.locator('text=Memory:').locator('xpath=following-sibling::*[1]');
    await expect(memoryElement).toContainText(`${detail.ram / 1024} TB`);
    
    const diskElement = this.page.locator('text=Disk/Ephemeral:').locator('xpath=following-sibling::*[1]');
    await expect(diskElement).toContainText(`${detail.disk_size / 1024} TB`);
    
    const usernameElement = this.page.locator('text=Username:').locator('xpath=following-sibling::*[1]');
    await expect(usernameElement).toContainText(detail.username);
    
    const ipElement = this.page.locator('text=Public IP Address:').locator('xpath=following-sibling::*[1]');
    await expect(ipElement).toContainText(detail.public_ipv4);
  }

  async checkStatus(status: string) {
    const rows = this.page.locator('tbody tr');
    const count = await rows.count();
    
    for (let i = 0; i < count; i++) {
      const statusCell = rows.nth(i).locator('td').nth(8);
      await expect(statusCell).toHaveText(status);
    }
  }

  async selectGpuOption(gpuText: string) {
    await this.page.locator(`div:has-text("${gpuText}")`).click({ force: true });
  }

  async fillInstanceName(name: string) {
    await this.page.locator('input[placeholder="Name"]').fill(name);
  }

  async clickDeployConfirm() {
    await this.page.locator('.anchor-btn:has-text("Deploy")').click({ timeout: 10000 });
  }

  async checkInstanceRowDeploying({ name, region, gpu, price }: any) {
    await expect(this.page.locator('text=Instance created successfully')).toBeVisible({ timeout: 10000 });
    await expect(this.page.locator(`td:has-text("${name}")`)).toBeVisible();
    
    const row = this.page.locator(`tbody tr:has-text("${name}")`);
    await expect(row.locator('td').nth(8)).toHaveText('Deploying');
    await expect(row.locator('td').nth(0)).toHaveText(name);
    await expect(row.locator('td').nth(2)).toHaveText(region);
    await expect(row.locator('td').nth(3)).toContainText(gpu);
    await expect(row.locator('td').nth(7)).toHaveText(price);
  }

  async terminateInstance() {
    await this.page.locator('text=Terminate').click();
    await this.page.locator('.button:has-text("Destroy Instance")').click({ timeout: 10000 });
  }

  async checkTerminatedStatus() {
    await expect(this.page.locator('text=Instance deleted successfully')).toBeVisible({ timeout: 10000 });
  }

  async clickRefresh() {
    await this.page.locator('text=Refresh').click();
  }
} 