/**
 * SSH Key Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';

export class SSHKeyPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors
  private sshKeyMenuItem = '.el-menu-item:has-text("SSH Public Key")';
  private createButton = 'div.refresh.refresh-active.ml-16.text-center.pointer:has-text("Create")';
  private keyNameInput = 'input[placeholder="Name"]';
  private publicKeyTextarea = 'textarea[placeholder="SSH Public Key"]';
  private confirmButton = 'div.button.btn.border-radius-10:has-text("Confirm")';
  private duplicateErrorText = 'text=You already have an SSH key with the same public key content.';
  private viewButton = 'text=View';
  private copyIcon = '.icon-copy';
  private deleteButton = 'text=Delete';

  async visit() {
    await this.page.locator(this.sshKeyMenuItem).click({ force: true });
  }

  async navigateTo() {
    await this.page.goto(ENDPOINTS.SSH_KEY);
  }

  async openCreateModal() {
    await this.page.locator(this.createButton).click({ force: true });
    await this.page.waitForTimeout(2000);
    await this.page.locator(this.keyNameInput).waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillKeyName(name: string) {
    const input = this.page.locator(this.keyNameInput);
    await input.clear({ force: true });
    await input.fill(name);
  }

  async fillPublicKey(key: string) {
    const textarea = this.page.locator(this.publicKeyTextarea);
    await textarea.clear({ force: true });
    await textarea.fill(key);
  }

  async confirmCreate() {
    await this.page.locator(this.confirmButton).click({ force: true });
  }

  async checkDuplicateKeyError() {
    await expect(this.page.locator(this.duplicateErrorText)).toBeVisible();
  }

  async createKey(name: string, key: string) {
    await this.openCreateModal();
    await this.fillKeyName(name);
    await this.fillPublicKey(key);
    await this.confirmCreate();
  }

  async checkKeyInTable(name: string) {
    await expect(this.page.locator(`tr:has-text("${name}")`)).toBeVisible();
  }

  async viewKey(name: string) {
    await expect(async () => {
      const row = this.page.locator(`tr:has-text("${name}")`);
      await row.locator(this.viewButton).click({ force: true });
      await expect(this.page.locator('h4:has-text("Key Details")')).toBeVisible();
    }).toPass({timeout: 20000});
  }

  async checkViewModal(key: string) {
    await expect(async () => {
      const title = this.page.locator('h4:has-text("Key Details")');
      await expect(title).toBeVisible();
      const keyElement = this.page.getByText(key).nth(1);
      await expect(keyElement).toBeVisible();
    }).toPass({timeout: 10000});
  }

  async copyKeyInTable(name: string) {
    const row = this.page.locator(`tr:has-text("${name}")`);
    await row.locator(this.copyIcon).first().click({ force: true });
  }

  async copyKeyInModal() {
    await this.page.locator(this.copyIcon).first().click({ force: true });
  }

  async deleteKeyInModal() {
    await this.page.locator('div.delete:has-text("Delete")').click({ force: true });
  }

  async checkKeyNotInTable(name: string) {
    await expect(this.page.locator(`tr:has-text("${name}")`)).not.toBeVisible();
  }

  async checkCreateModalUI() {
    await expect(this.page.locator('text=Key Name:')).toBeVisible();
    await expect(this.page.locator('input[placeholder="Key Name"],input[placeholder="Name"]')).toBeVisible();
    await expect(this.page.locator('text=SSH Public Key:')).toBeVisible();
    await expect(this.page.locator('textarea[placeholder="SSH Public Key"]')).toBeVisible();
    await expect(this.page.locator(this.confirmButton)).toBeVisible();
  }

  async checkUI() {
    await expect(this.page.locator('h1:has-text("SSH Public Key")')).toBeVisible();
    await expect(this.page.getByText('Create', { exact: true })).toBeVisible();
    await expect(this.page.locator('text=Refresh')).toBeVisible();
    await expect(this.page.locator('text=Name')).toBeVisible();
    await expect(this.page.locator('text=Key Data')).toBeVisible();
    await expect(this.page.locator('text=Create Time')).toBeVisible();
  }
} 