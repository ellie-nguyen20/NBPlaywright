/**
 * Object Storage Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';

export class ObjectStoragePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors
  private objectStorageMenuItem = '.el-menu-item:has-text("Object Storage")';

  async visit() {
    await this.page.locator(this.objectStorageMenuItem).click({ force: true });
  }

  async navigateTo() {
    await this.page.goto(ENDPOINTS.OBJECT_STORAGE);
  }

  async fillLabel(label: string) {
    await this.page.locator('input[placeholder="Please enter a label to create your object storage"]').clear({ force: true });
    await this.page.locator('input[placeholder="Please enter a label to create your object storage"]').fill(label, { force: true });
  }

  async selectCanada() {
    await this.page.locator('.region-style:has-text("Canada"):not(.is-disabled)').click({ force: true });
  }

  async clickCreate() {
    await this.page.locator('div.create-btn:has-text("Create")').click({ force: true });
  }

  async createObjectStorage(label: string) {
    await expect(async () => {
      await expect(this.page.locator('.cont:has-text("Standard"):not(.is-disabled)')).toBeVisible({ timeout: 10000 });
      await this.selectCanada();
      await this.fillLabel(label);
      await this.clickCreate();
    }).toPass({timeout: 20000});
  }

  async viewObjectStorage(label: string) {
    await this.page.locator(`tr:has-text("${label}")`).locator('text=View').click({ force: true });
  }

  async regenerateKey() {
    await this.page.locator('text=regenerate key').click({ force: true });
  }

  async checkObjectStorageTable(label: string) {
    await expect(this.page.locator(`tr:has-text("${label}")`)).toBeAttached();
    await expect(this.page.locator(`tr:has-text("${label}")`).locator('text=Canada')).toBeAttached();
    await expect(this.page.locator(`tr:has-text("${label}")`).locator('text=Standard')).toBeAttached();
    await expect(this.page.locator(`tr:has-text("${label}")`).locator('text=Ready')).toBeAttached();
    await expect(this.page.locator(`tr:has-text("${label}")`).locator('text=View')).toBeAttached();
    await expect(this.page.locator(`tr:has-text("${label}")`).locator('text=Delete')).toBeAttached();
  }

  async checkCreateModal() {
    await expect(this.page.locator('text=Standard')).toBeVisible();
    await expect(this.page.locator('text=Canada')).toBeVisible();
    await expect(this.page.locator('input[type="text"]').last()).toBeVisible();
    await expect(this.page.locator('text=Create')).toBeVisible();
  }

  async checkViewModal(label: string) {
    await expect(this.page.locator('text=Label:').locator('xpath=..').locator('text=' + label)).toBeAttached();
    await expect(this.page.locator('text=Location:').locator('xpath=..').locator('text=Canada')).toBeAttached();
    await expect(this.page.locator('text=Tier:').locator('xpath=..').locator('text=Standard')).toBeAttached();
    await expect(this.page.locator('text=S3 Credentials')).toBeVisible();
    await expect(this.page.locator('text=regenerate key')).toBeVisible();
  }

  async checkUI() {
    await expect(this.page.locator('h1:has-text("Object Storage")')).toBeVisible();
    await expect(this.page.locator('text=Start Using Object Storage Service')).toBeVisible();
    await expect(this.page.locator('text=Store, access, and scale effortlessly with Object Storage.')).toBeVisible();
    await expect(this.page.locator('text=Continue Creating Object Storage')).toBeVisible();
  }

  async clickContinueCreatingObjectStorage() {
    await this.page.locator('div.pointer').filter({ hasText: 'Continue Creating Object Storage' }).click({ force: true });
    await this.page.waitForTimeout(2000);
  }

  async checkDetailCreatingObjectStorage() {
    await this.page.locator('div.pointer').filter({ hasText: 'Continue Creating Object Storage' }).click({ force: true });
    await expect(this.page.locator('text=Object Storage')).toBeVisible({ timeout: 10000 });
    await expect(this.page.locator('text=Back')).toBeVisible({ timeout: 10000 });
    await expect(this.page.locator('text=Ownership')).toBeVisible();
    await expect(this.page.locator('text=Personal')).toBeVisible();
    await expect(this.page.locator('text=Label')).toBeVisible();
    await expect(this.page.locator('text=Storage Type')).toBeVisible();
    await expect(this.page.locator('text=Standard')).toBeVisible();
    await expect(this.page.locator('text=Free')).toBeVisible();
    await expect(this.page.locator('text=Reliable and durable storage for businesses requiring high-capacity solutions.')).toBeVisible();
    await expect(this.page.locator('text=Performance')).toBeVisible();
    await expect(this.page.locator('text=$0.015/GB/month')).toBeVisible();
    await expect(this.page.locator('text=Low-latency storage designed for demanding workloads and frequent access.')).toBeVisible();
    await expect(this.page.locator('text=Accelerated')).toBeVisible();
    await expect(this.page.locator('text=$0.02/GB/month')).toBeVisible();
    await expect(this.page.locator('text=Ultra-fast storage for high-performance and write-intensive applications.')).toBeVisible();
    await expect(this.page.locator('text=Location')).toBeVisible();
    await expect(this.page.locator('text=Canada')).toBeVisible();
    await expect(this.page.locator('text=US')).toBeVisible();
    await expect(this.page.locator('text=Pricing details')).toBeVisible();
    await expect(this.page.locator('text=Data storage')).toBeVisible();
    await expect(this.page.locator('text=Outgoing traffic')).toBeVisible();
    await expect(this.page.locator('text=Incoming traffic')).toBeVisible();
    await expect(this.page.locator('text=After creating the object storage, you will be able to create buckets and manage your storage.')).toBeVisible();
    await expect(this.page.locator('text=Create')).toBeVisible();
  }

  async createObjectStorageWithLabel(label: string) {
    await this.fillLabel(label);
    await this.page.locator('text=Create').click();
    await expect(this.page.locator('text=Object storage successfully created')).toBeVisible();
  }

  async selectTeam(teamName: string) {
    await this.page.locator('.el-select-dropdown__item').filter({ hasText: teamName }).click({ force: true, timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }
} 