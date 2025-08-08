/**
 * Contact Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';

export class ContactPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors
  private contactMenuItem = '.el-menu-item:has-text("Contact")';

  async visit() {
    await this.page.locator(this.contactMenuItem).click({ force: true });
  }

  async navigateTo() {
    await this.page.goto(ENDPOINTS.CONTACT);
  }

  async checkUI() {
    await expect(this.page.locator('h1:has-text("Contact")')).toBeVisible();
    await expect(this.page.locator('text=Our dedicated support team is here to help you with any questions or concerns related to the Nebula Block platform. We aim to provide timely and accurate responses, and your understanding is appreciated.')).toBeVisible();
    await expect(this.page.locator('text=Subject')).toBeVisible();
    await expect(this.page.locator('text=Description')).toBeVisible();
    await expect(this.page.locator('text=Attachment')).toBeVisible();
    await expect(this.page.locator('text=Submit')).toBeVisible();
  }

  async fillSubject(subject: string) {
    await this.page.locator('input[placeholder="Main subject about your issue"]').clear({ force: true });
    await this.page.locator('input[placeholder="Main subject about your issue"]').fill(subject, { force: true });
  }

  async fillDescription(desc: string) {
    await this.page.locator('textarea').first().clear({ force: true });
    await this.page.locator('textarea').first().fill(desc, { force: true });
  }

  async submit() {
    await this.page.locator('.button-default:has-text("Submit")').click({ force: true });
  }

  async checkSuccessNotification() {
    await expect(this.page.locator('text=Your request has been successfully sent.')).toBeVisible({ timeout: 20000 });
  }

  async checkTabs() {
    await expect(this.page.locator('text=User Problems')).toBeVisible();
    await expect(this.page.locator('text=Startup Applications')).toBeVisible();
    await expect(this.page.locator('text=Academia Application')).toBeVisible();
  }

  async switchToTab(tabName: string) {
    await this.page.locator(`text=${tabName}`).click({ force: true });
  }

  async uploadAttachment(filePath: string) {
    await this.page.locator('input[type="file"]').setInputFiles(filePath);
  }

  async submitFormOnTab(tabName: string, subject: string, description: string) {
    await this.switchToTab(tabName);
    await this.fillSubject(subject);
    await this.fillDescription(description);
    await this.submit();
    await this.checkSuccessNotification();
  }

  async checkUserProblemsTabUI() {
    await expect(this.page.locator('text=Subject')).toBeVisible();
    await expect(this.page.locator('text=Description')).toBeVisible();
    await expect(this.page.locator('text=Attachment')).toBeVisible();
    await expect(this.page.locator('text=Upload your ScreenShot here')).toBeVisible();
    await expect(this.page.locator('text=Submit')).toBeVisible();
  }

  async checkStartupApplicationsTabUI() {
    await expect(this.page.locator('text=Submit Your Startup Application')).toBeVisible();
    await expect(this.page.locator('text=Brief about what type of startups they support')).toBeVisible();
    await expect(this.page.locator('text=Startup Name')).toBeVisible();
    await expect(this.page.locator('text=Website (optional)')).toBeVisible();
    await expect(this.page.locator('text=Contact Email')).toBeVisible();
    await expect(this.page.locator('div.el-form-item__label')).toHaveCount(2);
    await expect(this.page.locator('text=Upload your Pitch Deck here')).toBeVisible();
    await expect(this.page.locator('text=Description')).toBeVisible();
    await expect(this.page.locator('div.submit', { hasText: 'Submit' })).toBeVisible();
  }

  async checkAcademiaApplicationTabUI() {
    await expect(this.page.locator('text=Submit Your Academic Proposal')).toBeVisible();
    await expect(this.page.locator('text=Description of supported academic initiatives')).toBeVisible();
    await expect(this.page.locator('text=Project Title')).toBeVisible();
    await expect(this.page.locator('text=Institution')).toBeVisible();
    await expect(this.page.locator('text=Contact Email')).toBeVisible();
    await expect(this.page.locator('text=Proposal Document')).toHaveCount(2);
    await expect(this.page.locator('text=Upload your Proposal Document here')).toBeVisible();
    await expect(this.page.locator('label:has-text("Description")')).toBeVisible();
    await expect(this.page.locator('div.submit', { hasText: 'Submit' })).toBeVisible();
  }

  async submitUserProblemsForm(subject: string, description: string, filePath?: string) {
    await this.switchToTab('User Problems');
    await this.fillSubject(subject);
    await this.fillDescription(description);
    if (filePath) {
      await this.page.locator('input[type="file"]').setInputFiles(filePath);
    }
    await this.submit();
    await this.checkSuccessNotification();
  }

  async submitStartupApplicationsForm(startupName: string, website: string, email: string, description: string, filePath?: string) {
    await this.switchToTab('Startup Applications');
    await this.page.locator('input[placeholder="Your startup name"]').clear({ force: true });
    await this.page.locator('input[placeholder="Your startup name"]').fill(startupName, { force: true });
    await this.page.locator('input[placeholder="Your website"]').clear({ force: true });
    await this.page.locator('input[placeholder="Your website"]').fill(website, { force: true });
    await this.page.locator('input[placeholder="Your contact email"]').clear({ force: true });
    await this.page.locator('input[placeholder="Your contact email"]').fill(email, { force: true });
    await this.page.locator('textarea').first().clear({ force: true });
    await this.page.locator('textarea').first().fill(description, { force: true });
    if (filePath) {
      await this.page.locator('input[type="file"]').setInputFiles(filePath);
    }
    await this.submit();
    await this.checkSuccessNotification();
  }

  async submitAcademiaApplicationForm(projectTitle: string, institution: string, email: string, description: string, filePath?: string) {
    await this.switchToTab('Academia Application');
    await this.page.locator('input[placeholder="Your project title"]').clear({ force: true });
    await this.page.locator('input[placeholder="Your project title"]').fill(projectTitle, { force: true });
    await this.page.locator('input[placeholder="Your Institution"]').clear({ force: true });
    await this.page.locator('input[placeholder="Your Institution"]').fill(institution, { force: true });
    await this.page.locator('input[placeholder="Your contact email"]').clear({ force: true });
    await this.page.locator('input[placeholder="Your contact email"]').fill(email, { force: true });
    await this.page.locator('textarea').first().clear({ force: true });
    await this.page.locator('textarea').first().fill(description, { force: true });
    if (filePath) {
      await this.page.locator('input[type="file"]').setInputFiles(filePath);
    }
    await this.submit();
    await this.checkSuccessNotification();
  }
} 