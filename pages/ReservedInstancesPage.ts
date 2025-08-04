/**
 * Reserved Instances Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ReservedInstancesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async visit() {
    await this.page.locator('.el-menu-item:has-text("Reserved Instances")').click({ force: true });
  }

  async checkUI() {
    await expect(this.page.locator('text=Reserved Instances')).toBeVisible();
    await expect(this.page.locator('text=Reserve Your AI Compute. Save More. Perform Better')).toBeVisible();
    await expect(this.page.locator('text=40% savings')).toBeVisible();
    await expect(this.page.locator('text=bare metal performance')).toBeVisible();
    await expect(this.page.locator('text=30+ global locations')).toBeVisible();
    await expect(this.page.locator('text=guaranteed availability')).toBeVisible();
    await expect(this.page.locator('text=Contact Us')).toBeVisible();
  }

  async checkInstanceListUI() {
    await expect(this.page.locator('tbody')).toBeVisible();
    const rows = this.page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThanOrEqual(1);
  }

  async checkStatus(status: string) {
    await expect(this.page.locator(`tbody tr td:has-text("${status}")`)).toBeVisible();
  }

  async checkInstanceName(name: string) {
    await expect(this.page.locator(`tbody:has-text("${name}")`)).toBeVisible();
  }

  async scrollToInstance(name: string) {
    const instanceCell = this.page.locator(`td:has-text("${name}")`);
    await instanceCell.scrollIntoViewIfNeeded();
  }

  async getViewButtonByInstanceName(name: string) {
    return this.page.locator(`tr:has-text("${name}")`).locator('text=View');
  }

  async checkInstanceDetailStatus(expectedStatus: string) {
    await expect(this.page.locator('text=Instance Details')).toBeVisible();
    const statusElement = this.page.locator('text=Status:').locator('xpath=following-sibling::*[1]');
    await expect(statusElement).toHaveText(expectedStatus);
  }

  async checkInstanceDetailUI() {
    await expect(this.page.locator('text=Instance Details')).toBeVisible();
    await expect(this.page.locator('text=Status:')).toBeVisible();
  }

  async checkTableColumns() {
    const columns = [
      'Name',
      'GPU',
      'Location',
      'CPU',
      'Memory',
      'Storage',
      'Price',
      'Expires',
      'Status'
    ];
    
    for (const col of columns) {
      await expect(this.page.locator(`th:has-text("${col}")`)).toBeVisible();
    }
  }

  async checkInstanceDefaultFields() {
    await expect(this.page.locator('text=Instance Details')).toBeVisible();
    await expect(this.page.locator('text=Status:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Location:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Expires:')).toBeVisible();
    await expect(this.page.locator('text=Total Cost:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Instance Started:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=OS/Image:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Public IP Address:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=GPU:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=CPU:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Memory:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Disk:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Bandwidth:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Username:').locator('xpath=following-sibling::*[1]')).toBeVisible();
    await expect(this.page.locator('text=Password:').locator('xpath=following-sibling::*[1]')).toBeVisible();
  }

  async checkInstanceDetailFields(detail: any) {
    await expect(this.page.locator('text=Instance Details')).toBeVisible();
    
    const statusElement = this.page.locator('text=Status:').locator('xpath=following-sibling::*[1]');
    await expect(statusElement).toHaveText(detail.status);
    
    const regionElement = this.page.locator('text=Location:').locator('xpath=following-sibling::*[1]');
    await expect(regionElement).toHaveText(detail.region);
    
    const gpuElement = this.page.locator('text=GPU:').locator('xpath=following-sibling::*[1]');
    await expect(gpuElement).toContainText(detail.gpu);
    
    const cpuElement = this.page.locator('text=CPU:').locator('xpath=following-sibling::*[1]');
    await expect(cpuElement).toContainText(detail.cpu_model);
    
    const memoryElement = this.page.locator('text=Memory:').locator('xpath=following-sibling::*[1]');
    await expect(memoryElement).toContainText('2 TB');
    
    const diskElement = this.page.locator('text=Disk:').locator('xpath=following-sibling::*[1]');
    await expect(diskElement).toContainText('14 TB');
    
    await expect(this.page.locator('text=Expires:')).toBeVisible();
    
    const ipElement = this.page.locator('text=Public IP Address:').locator('xpath=following-sibling::*[1]');
    await expect(ipElement).toContainText(detail.public_ipv4);
    
    const bandwidthElement = this.page.locator('text=Bandwidth:').locator('xpath=following-sibling::*[1]');
    await expect(bandwidthElement).toContainText(detail.bandwidth);
    
    const usernameElement = this.page.locator('text=Username:').locator('xpath=following-sibling::*[1]');
    await expect(usernameElement).toContainText(detail.username);
  }

  async checkInstanceRowFields(instance: any) {
    await expect(this.page.locator(`td:has-text("${instance.name}")`)).toBeVisible();
    await expect(this.page.locator(`td:has-text("${instance.gpu_count} * ${instance.gpu}")`)).toBeVisible();
    await expect(this.page.locator(`td:has-text("${instance.region}")`)).toBeVisible();
    await expect(this.page.locator(`td:has-text("${instance.cpu_count} * ${instance.cpu_model}")`)).toBeVisible();
    await expect(this.page.locator(`td:has-text("${instance.ram / 1024} TB")`)).toBeVisible();
    await expect(this.page.locator(`td:has-text("${instance.disk_size / 1024} TB")`)).toBeVisible();
    await expect(this.page.locator(`td:has-text("$${instance.price_per_hour}/hr")`)).toBeVisible();
    await expect(this.page.locator(`td:has-text("${instance.status}")`)).toBeVisible();
    await expect(this.page.locator(`tr:has-text("${instance.name}")`).locator('text=View')).toBeVisible();
  }
} 