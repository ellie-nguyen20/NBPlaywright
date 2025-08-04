/**
 * API Keys Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ApiKeysPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async visit() {
    // Wait for the menu item to be visible
    const apiKeysMenuItem = this.page.locator('.el-menu-item:has-text("API Keys")');
    await apiKeysMenuItem.waitFor({ state: 'visible', timeout: 10000 });
    
    await apiKeysMenuItem.click({ force: true });
  }

  async checkUI() {
    await expect(this.page.locator('h1:has-text("API Keys")')).toBeVisible();
    await expect(this.page.locator('text=Generate New API Key')).toBeVisible();
    await expect(this.page.locator('text=Refresh')).toBeVisible();
  }

  async getApiKey() {
    const apiKeyElement = this.page.locator('div:has-text("sk-")');
    return await apiKeyElement.textContent();
  }

  async clickCopy(name: string) {
    const row = this.page.locator(`tr:has-text("${name}")`);
    await row.waitFor({ state: 'visible', timeout: 10000 });
    await row.locator('.icon-copy').nth(1).waitFor({ state: 'visible' });
    await row.locator('.icon-copy').nth(1).click({ force: true });
  }

  async copyApiKey(name: string) {
    await this.clickCopy(name);
    await expect(this.page.locator('text=Copied')).toBeVisible();
  }

  async clickDelete(name: string) {
    const row = this.page.locator(`tr:has-text("${name}")`);
    await row.waitFor({ state: 'visible', timeout: 10000 });
    await row.locator('text=Delete').click({ force: true });
  }

  async deleteApikey(name: string) {
    await this.clickDelete(name);
    await this.page.locator('.button:has-text("Delete")').click({ force: true });
    await expect(this.page.locator('text=API key deleted successfully')).toBeVisible();
  }

  async clickRegenerate() {
    // Click on the Regenerate button for Personal keys
    const personalRow = this.page.locator('tr:has-text("Personal")');
    await personalRow.locator('text=Regenerate').click({ force: true });
  }

  async createApiKey(keyname: string) {
    await this.clickRegenerate();
    
    // Wait for the modal dialog to appear
    const inputField = this.page.locator('input[placeholder="API Key Name"]');
    await inputField.waitFor({ state: 'visible', timeout: 10000 });
    
    await inputField.fill(keyname);
    await this.page.locator('text=Ok').click({ force: true });
    await expect(this.page.locator('text=API key updated successfully')).toBeVisible();
  }

  async clickCreateApiKey() {
    await this.page.locator('text=Generate New API Key').click({ force: true });
  }

  async createNewApiKey(keyname: string, teamname: string) {
    await this.page.locator('input[placeholder="API Key Name"]').fill(keyname);
    
    // Click on the team dropdown to open it
    const teamDropdown = this.page.locator('.el-select');
    await teamDropdown.waitFor({ state: 'visible', timeout: 10000});
    await teamDropdown.click();
    
    // Wait for dropdown to be visible and select the team
    const dropdownItem = this.page.locator('.el-select-dropdown__item')
      .filter({ hasText: teamname });
    await dropdownItem.waitFor({ state: 'visible'});
    await dropdownItem.click({ force: true });
    await this.page.waitForSelector('.el-select-dropdown', { state: 'hidden', timeout: 10000 });
    
    await this.page.locator('text=Ok').click({ force: true });
    await expect(this.page.locator('text=New API key generated successfully')).toBeVisible();
  }
} 