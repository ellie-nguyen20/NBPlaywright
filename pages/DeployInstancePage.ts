/**
 * Deploy Instance Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DeployInstancePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async checkDeployPageUI() {
    // Check navigation buttons
    await expect(this.page.locator('div.refresh.refresh-active.mr-16.text-center.pointer:has-text("Deploy")')).toBeVisible();
    await expect(this.page.locator('div.refresh.ml-16.text-center.pointer:has-text("Refresh")')).toBeVisible();
    
    // Check left sidebar navigation tabs
    await expect(this.page.locator('#Location')).toBeVisible();
    await expect(this.page.locator('#Hardware')).toBeVisible();
    await expect(this.page.locator('#Image')).toBeVisible();
    await expect(this.page.locator('#sshKeyList')).toBeVisible();
    await expect(this.page.locator('#serverName')).toBeVisible();
    
    // Check location section (should be active by default)
    await expect(this.page.locator('.region-style.active:has-text("CANADA")')).toBeVisible();
    await expect(this.page.locator('.region-style:has-text("US")')).toBeVisible();
    await expect(this.page.locator('.region-style:has-text("FINLAND")')).toBeVisible();
    await expect(this.page.locator('.region-style:has-text("FRANCE")')).toBeVisible();
    await expect(this.page.locator('.region-style:has-text("NORWAY")')).toBeVisible();
    
    // Check hardware options (all showing out of stock)
    await expect(this.page.locator('.region-style:has-text("Currently out of stock")').first()).toBeVisible();
    
    // Check specific GPU types are displayed
    await expect(async () => {
      await expect(this.page.locator(':has-text("H100-80G-SXM")').first()).toBeVisible();
      await expect(this.page.locator(':has-text("H100-80G-PCIe")').first()).toBeVisible();
      await expect(this.page.locator(':has-text("A100-80G-PCIe")').first()).toBeVisible();
      await expect(this.page.locator(':has-text("L40")').first()).toBeVisible();
      await expect(this.page.locator(':has-text("RTX-A6000")').first()).toBeVisible();
    }).toPass({ timeout: 30000 });
    
    // Check More Options button
    // await expect(this.page.locator('.deploy-form-item-btn:has-text("More Options")').first()).toBeVisible();
    
    // Check Deploy button (should be disabled initially)
    await expect(this.page.locator('.anchor-btn.is-disabled:has-text("Deploy")')).toBeVisible();
  }

} 