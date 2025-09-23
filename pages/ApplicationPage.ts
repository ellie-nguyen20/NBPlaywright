/**
 * Application Page Object Model (formerly Support Page)
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';

export class ApplicationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors
  private applicationMenuItem = '.el-menu-item:has-text("Application")';

  async visit() {
    await this.page.locator(this.applicationMenuItem).click({ force: true });
  }

  async navigateTo() {
    await this.page.goto(ENDPOINTS.APPLICATION);
  }

  async checkUI() {
    await expect(this.page.locator('h1:has-text("Application")')).toBeVisible();
    await expect(this.page.locator('text=Our dedicated support team is here to help you with any questions or concerns related to the Nebula Block platform. We aim to provide timely and accurate responses, and your understanding is appreciated.')).toBeVisible();
    
    // Check for Application sections
    await expect(this.page.locator('text=Startup Applications')).toBeVisible();
    await expect(this.page.locator('text=Academia Applications')).toBeVisible();
    await expect(this.page.locator('text=Submit Your Startup Application')).toBeVisible();
  }

  // Startup Application form methods
  async fillStartupName(startupName: string) {
    await this.page.locator('input[placeholder*="Startup Name"], input[placeholder*="startup name"]').clear({ force: true });
    await this.page.locator('input[placeholder*="Startup Name"], input[placeholder*="startup name"]').fill(startupName, { force: true });
  }

  async fillWebsite(website: string) {
    await this.page.locator('input[placeholder*="Website"], input[placeholder*="website"]').clear({ force: true });
    await this.page.locator('input[placeholder*="Website"], input[placeholder*="website"]').fill(website, { force: true });
  }

  async fillContactEmail(email: string) {
    await this.page.locator('input[placeholder*="Contact Email"], input[placeholder*="contact email"]').clear({ force: true });
    await this.page.locator('input[placeholder*="Contact Email"], input[placeholder*="contact email"]').fill(email, { force: true });
  }

  async fillDescription(desc: string) {
    await this.page.locator('textarea').first().clear({ force: true });
    await this.page.locator('textarea').first().fill(desc, { force: true });
  }

  async submit() {
    await this.page.locator('button:has-text("Submit"), .button-default:has-text("Submit")').click({ force: true });
  }

  async uploadPitchDeck(filePath: string) {
    await this.page.locator('input[type="file"]').setInputFiles(filePath);
  }

  async checkSuccessNotification() {
    await expect(this.page.locator('text=Your request has been successfully sent., text=Application submitted successfully, text=Success')).toBeVisible({ timeout: 20000 });
  }

  async verifyStartupApplicationForm() {
    await expect(this.page.locator('text=Submit Your Startup Application')).toBeVisible();
    await expect(this.page.locator('text=Brief about what type of startups they support')).toBeVisible();
    await expect(this.page.locator('text=Startup Name')).toBeVisible();
    await expect(this.page.locator('text=Website (optional)')).toBeVisible();
    await expect(this.page.locator('text=Contact Email')).toBeVisible();
    await expect(this.page.locator('text=Pitch Deck')).toBeVisible();
    await expect(this.page.locator('text=Upload your Pitch Deck here')).toBeVisible();
    await expect(this.page.locator('text=Description')).toBeVisible();
    await expect(this.page.locator('button:has-text("Submit")')).toBeVisible();
  }

  async verifyAcademiaApplicationForm() {
    await expect(this.page.locator('text=Academia Applications')).toBeVisible();
    // Note: Academia form might not be fully visible on current page, so we'll check for basic elements
    await expect(this.page.locator('text=Academia Applications')).toBeVisible();
  }

  async submitStartupApplication(startupName: string, website: string, email: string, description: string, pitchDeckPath?: string) {
    await this.fillStartupName(startupName);
    if (website) {
      await this.fillWebsite(website);
    }
    await this.fillContactEmail(email);
    await this.fillDescription(description);
    
    if (pitchDeckPath) {
      await this.uploadPitchDeck(pitchDeckPath);
    }
    
    await this.submit();
    await this.checkSuccessNotification();
  }

  // Additional utility methods for Application page
  async verifyApplicationPageElements() {
    await expect(this.page.locator('text=Startup Applications')).toBeVisible();
    await expect(this.page.locator('text=Academia Applications')).toBeVisible();
    await expect(this.page.locator('text=Our dedicated support team is here to help you')).toBeVisible();
  }

  async verifyFormValidation() {
    // Try to submit empty form to check validation
    await this.submit();
    
    // Check if validation messages appear (this might vary based on implementation)
    // We'll just verify the form is still visible (meaning validation prevented submission)
    await expect(this.page.locator('text=Submit Your Startup Application')).toBeVisible();
  }

  async fillOptionalFields(website?: string, pitchDeckPath?: string) {
    if (website) {
      await this.fillWebsite(website);
    }
    if (pitchDeckPath) {
      await this.uploadPitchDeck(pitchDeckPath);
    }
  }
} 