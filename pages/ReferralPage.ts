/**
 * Referral Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';

export class ReferralPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors
  private referralMenuItem = '.el-menu-item:has-text("Referral")';
  private referralCodeInput = 'input[placeholder="Paste referral code here..."]';
  private applyCodeButton = 'text=Apply the code';
  private copyLinkButton = 'text=Copy the link';
  private copyCodeIcon = '.icon-copy';

  async visit() {
    await this.page.locator(this.referralMenuItem).click({ force: true });
  }

  async navigateTo() {
    await this.page.goto(ENDPOINTS.REFERRAL);
  }

  async checkUI() {
    // Main referral content
    await expect(this.page.locator('h1:has-text("Referral")')).toBeVisible();
    await expect(this.page.locator('text=Earn up to 4.00%: 3.00% from serverless and 1.00% from compute')).toBeVisible();
    await expect(this.page.locator('text=Copy the link')).toBeVisible();
    await expect(this.page.locator('text=https://dev-console.nebulablock.com/register?referral')).toBeVisible();
    await expect(this.page.locator('text=Share the link or code with your friends')).toBeVisible();
    await expect(this.page.locator('text=Every penny the spend gets you closer to earning up to 4.00%!')).toBeVisible();
    await expect(this.page.locator('text=Learn More')).toBeVisible();

    // Apply Referral code section
    await expect(this.page.locator('text=Add referral code')).toBeVisible();
    await expect(this.page.locator('text=Apply a valid referral code to claim your extra welcome bonus!')).toBeVisible();
    await expect(this.page.locator('input[placeholder="Paste referral code here..."]')).toBeVisible();
    await expect(this.page.locator('text=Apply the code')).toBeVisible();

    // Referral history section
    await expect(this.page.locator('text=Referral Count')).toBeVisible();
    await expect(this.page.locator('text=Users you referred')).toBeVisible();

    // Referral Earning section
    await expect(this.page.locator('text=Referral Earning ($)')).toBeVisible();
    await expect(this.page.locator('text=Up to 4.00% earnings from your referrals')).toBeVisible();

    // Upgrade Threshold section
    await expect(this.page.locator('text=Upgrade Threshold')).toBeVisible();
    await expect(this.page.locator('text=Next level commission 5.00% from serverless and 1.00% from compute!')).toBeVisible();
    await expect(this.page.locator('text=Remained')).toBeVisible();
  }

  async copyLink() {
    await this.page.locator(this.copyLinkButton).click({ force: true });
  }

  async copyCode() {
    await this.page.locator(this.copyCodeIcon).last().click({ force: true });
  }

  async fillReferralCode(code: string) {
    const input = this.page.locator(this.referralCodeInput);
    await input.waitFor({ state: 'visible', timeout: 10000 });
    await input.clear({ force: true });
    await input.fill(code);
  }

  async applyReferralCode() {
    await this.page.locator(this.applyCodeButton).click({ force: true });
  }

  async checkApplySuccess() {
    await expect(this.page.locator('text=Success')).toBeVisible();
  }

  async checkApplyError() {
    await expect(this.page.locator('text=Invalid Referral Code.')).toBeVisible();
  }

  async checkHistory() {
    // Placeholder for referral history checking
    await expect(this.page.locator('text=Referral Count')).toBeVisible();
  }

  async checkRewards() {
    // Placeholder for referral rewards checking
    await expect(this.page.locator('text=Referral Earning ($)')).toBeVisible();
  }
} 