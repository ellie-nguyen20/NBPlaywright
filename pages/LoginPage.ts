/**
 * Login Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors
  private emailInput = 'input[placeholder="Your email address"]';
  private passwordInput = 'input[type="password"]';
  private signInButton = 'button.el-button--primary';
  private overlayCloseButton = 'button.el-dialog__headerbtn';
  private rememberMeCheckbox = 'text=Remember me';
  private signUpLink = 'text=Sign up';
  private forgotPasswordLink = 'text=Forgot password ?';
  private accountMenu = 'text=Account';
  private logoutButton = 'text=Logout';
  private errorMessage = 'text=The user is not registered yet, please sign up.';

  async visit() {
    await this.page.goto(ENDPOINTS.LOGIN);
    await expect(this.page).toHaveURL(new RegExp(ENDPOINTS.LOGIN), {timeout: 60000});
  }

  async closeOverlayIfVisible() {
    const overlay = this.page.locator(this.overlayCloseButton);
    if (await overlay.isVisible()) {
      await overlay.click();
      await this.page.waitForTimeout(500);
    }
  }

  async checkUI() {
    await expect(this.page.locator('button:has-text("Sign in")')).toBeVisible();
    await expect(this.page.locator(this.emailInput)).toBeVisible({ timeout: 10000 });
    await expect(this.page.locator(this.passwordInput)).toBeVisible({ timeout: 10000 });
    await expect(this.page.locator(this.rememberMeCheckbox)).toBeVisible({ timeout: 10000 });
    await expect(this.page.locator(this.signUpLink)).toBeVisible({ timeout: 10000 });
    await expect(this.page.locator(this.forgotPasswordLink)).toBeVisible({ timeout: 10000 });
  }

  async fillEmail(email: string) {
    await this.closeOverlayIfVisible();
    await this.page.locator(this.emailInput).fill(email);
  }

  async fillPassword(password: string) {
    await this.closeOverlayIfVisible();
    await this.page.locator(this.passwordInput).first().fill(password);
  }

  async clickSignIn() {
    await this.closeOverlayIfVisible();
    await this.page.locator(this.signInButton).first().click();
  }

  async login(email: string, password: string) {
    await this.visit();
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async logout() {
    await this.page.locator(this.accountMenu).click();
    await this.page.locator(this.logoutButton).click();
  }

  async isLoggedIn(username: string) {
    await expect(this.page.getByRole('button', { name: username })).toBeVisible({ timeout: 20000 });
  }

  async isLoginError() {
    await expect(this.page.locator(this.errorMessage)).toBeVisible();
  }
} 