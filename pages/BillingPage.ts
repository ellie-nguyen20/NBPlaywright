/**
 * Billing Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';

export class BillingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors
  private billingMenuItem = '.el-menu-item:has-text("Billing")';

  async visit() {
    await this.page.locator(this.billingMenuItem).click({ force: true });
  }

  async checkUI() {
    // Wait for the element to be visible, not just present
    await expect(this.page.locator('h1:has-text("Available Credits")').first()).toHaveCount(1);
    await expect(this.page.locator('text=Configure Auto-Pay').first()).toBeVisible();
    await expect(this.page.locator('h1:has-text("Payment Method")')).toBeVisible();
    await expect(this.page.locator('text=Add Promotion Code').first()).toBeVisible();
    await this.page.locator('text=Transactions').scrollIntoViewIfNeeded();
    await expect(this.page.locator('text=Transactions').first()).toBeVisible();
    await this.page.locator('text=Usages').scrollIntoViewIfNeeded();
    await expect(this.page.locator('text=Usages').first()).toBeVisible();
  }

  async clickAddCredits() {
    await this.page.locator('text=Add Credits').click({ force: true });
  }

  async selectCreditAmount(amount: string) {
    await this.page.locator(`text=$${amount}`).click({ force: true });
  }

  async payWithCard() {
    await this.page.locator('text=Pay with Card').click({ force: true });
  }

  async payWithCrypto() {
    await this.page.locator('text=Pay with Crypto').click({ force: true });
  }

  async configureAutoPay() {
    await this.page.locator('text=Configure Auto-Pay').click({ force: true });
  }

  async saveAutoPaySettings() {
    await this.page.locator('text=Save Autopay Settings').click({ force: true });
  }

  async addPaymentMethod() {
    await this.page.locator('text=Add a New Card').click({ force: true, timeout: 10000 });
  }

  async addPromotionCode() {
    await this.page.locator('text=Add Promotion Code').click({ force: true });
  }

  async redeemCode() {
    await this.page.locator('text=Redeem').click({ force: true });
  }

  async refreshTransactions() {
    await this.page.locator('text=Transactions').locator('xpath=..').locator('text=Refresh').click({ force: true });
  }

  async downloadInvoice() {
    await this.page.locator('text=Download PDF').first().click({ force: true });
  }

  async filterUsages(type: string) {
    await this.page.locator(`label:has-text("${type}")`).click({ force: true });
  }
} 