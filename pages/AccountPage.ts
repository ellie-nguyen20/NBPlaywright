/**
 * Account Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';

export class AccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors
  private accountMenuItem = '.el-menu-item:has-text("Account")';
  private editProfileButton = 'text=Edit Profile';
  private changePasswordButton = 'text=Change Password';
  private editPersonalInfoTitle = 'text=Edit Personal Information';
  private saveButton = 'text=Save';
  private userInfoUpdatedMessage = 'text=User info updated successfully';
  private passwordUpdatedMessage = 'text=Password updated successfully.';
  private wrongPasswordMessage = 'text=Current password is incorrect.';
  private duplicatePasswordMessage = 'text=Current and new passwords must be different.';

  async visit() {
    await this.page.locator(this.accountMenuItem).click({ force: true });
  }

  async navigateTo() {
    await this.page.goto(ENDPOINTS.ACCOUNT);
  }

  async checkUI() {
    await expect(this.page.locator('text=Account').first()).toBeVisible();
    await expect(this.page.locator('text=Edit Profile').first()).toBeVisible();
    await expect(this.page.locator('text=Change Password').first()).toBeVisible();
    await expect(this.page.locator('text=Personal Information').first()).toBeVisible();
    await expect(this.page.locator('text=Engineer Tier').first()).toBeVisible();
    await expect(this.page.locator('text=Address').first()).toBeVisible();
  }

  async clickEditProfile() {
    await this.page.locator('text=Edit Profile').click({ force: true });
    await expect(this.page.locator('text=Edit Personal Information')).toBeVisible();
  }

  async clickChangePassword() {
    await this.page.locator('text=Change Password').first().click({ force: true });
    await expect(this.page.locator('text=Change Password').first()).toBeVisible();
  }

  async fillPassword(currentPassword: string, newPassword: string) {
    await this.page.locator('label:has-text("Old Password")').locator('xpath=..').locator('input').fill(currentPassword);
    await this.page.locator('label:has-text("New Password")').locator('xpath=..').locator('input').fill(newPassword);
    await this.page.locator('label:has-text("Confirm Password")').locator('xpath=..').locator('input').fill(newPassword);
    await this.page.locator('text=Save').click({ force: true });
  }

  async updateUsername(username: string) {
    await this.page.locator('label:has-text("Name:")').locator('xpath=..').locator('input').first().clear();
    await this.page.locator('label:has-text("Name:")').locator('xpath=..').locator('input').first().fill(username);
    await this.page.locator('text=Save').click({ force: true });
  }

  async updateProfile(name: string) {
    await this.clickEditProfile();
    await this.updateUsername(name);
    await expect(this.page.locator(this.userInfoUpdatedMessage)).toBeVisible();
  }

  async changePassword(currentPassword: string, newPassword: string) {
    await this.clickChangePassword();
    await this.fillPassword(currentPassword, newPassword);
    await expect(this.page.locator(this.passwordUpdatedMessage)).toBeVisible();
    await this.page.waitForTimeout(1000);
  }

  async changeWithWrongPassword(currentPassword: string, newPassword: string) {
    await this.clickChangePassword();
    await this.fillPassword(currentPassword, newPassword);
    await expect(this.page.locator(this.wrongPasswordMessage)).toBeVisible();
  }

  async changeWithDuplicatePassword(currentPassword: string, newPassword: string) {
    await this.clickChangePassword();
    await this.fillPassword(currentPassword, newPassword);
    await expect(this.page.locator(this.duplicatePasswordMessage)).toBeVisible();
  }
} 