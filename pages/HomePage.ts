/**
 * Home Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async visit() {
    await this.page.goto('https://dev-portal-v2.nebulablock.com/');
  }

  async checkUI() {
    const visibleTexts = [
      'Rent',
      'Compute Power',
      'On Demand',
      'Access high-performance GPUs and CPUs instantly',
      'Trusted by the Best',
      'Our Mission',
      'Empowering innovation',
      'Proud NVIDIA Partner Network (NPN)',
      'Our Service',
      'Serverless AI',
      'Compute',
      "Canada's First Sovereign AI Cloud",
      'How Nebula Block Works',
      'Advantage',
      'AI Pioneers Since 2020',
      'Cost-Effective Solutions',
      'Tailored Expertise for You',
      'Start your AI journey',
      'Get in touch',
      'Services',
      'Contact Us',
      'GitHub',
      'API',
      'Docs',
      'Newsletter',
      'Subscribe to our newsletter'
    ];

    for (const text of visibleTexts) {
      const el = this.page.getByText(text, { exact: false }).first();
      await expect(el).toBeVisible();
    }
  }

  async checkMenu() {
    const mainMenuItems = [
      'Compute', 'Pricing', 'Blog', 'Company', 'FAQs', 'Docs'
    ];

    const topRightItems = [
      'Launch', 'Sign up', 'EN', 'FR'
    ];

    const mainMenu = this.page.locator('ul.menu-ul');

    for (const item of mainMenuItems) {
      const locator = mainMenu.getByText(item, { exact: false }).first();
      await expect(locator, `Main menu item '${item}' not visible`).toBeVisible();
      await locator.scrollIntoViewIfNeeded();
    }

    const topRightMenu = this.page.locator('nav.flex-wrap');

    for (const item of topRightItems) {
      const locator = topRightMenu.getByText(item, { exact: false }).first();
      await expect(locator, `Top-right item '${item}' not visible`).toBeVisible();
      await locator.scrollIntoViewIfNeeded();
    }
  }

  async clickChatBot() {
    await this.page.getByText('Search for GPU resources', { exact: false }).click();
    await expect(this.page.getByRole('heading', { name: 'Search for GPU resources' })).toBeVisible();
  }

  async sendChatMessage(message: string) {
    const iframe = this.page.frameLocator('iframe[src*="chat.nebulablock.com"]');
    const textarea = iframe.locator('textarea[placeholder="Ask our AI expert now"]');
    const sendButton = iframe.locator('button.btn-primary.btn-medium.ml-3.w-8.px-0');

    await expect(textarea).toBeVisible({ timeout: 10000 });
    await textarea.fill(message);

    await expect(sendButton).toBeVisible({ timeout: 10000 });
    await sendButton.click();
  }
} 