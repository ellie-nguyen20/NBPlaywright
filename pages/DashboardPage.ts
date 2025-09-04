/**
 * Dashboard Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  get past7DaysButton() {
    return this.page.locator('label.el-segmented__item:has-text("Past 7 days")');
  }

  get past24HoursButton() {
    return this.page.locator('label.el-segmented__item:has-text("Past 24 hours")');
  }

  async visit() {
    await this.page.locator('.el-menu-item:has-text("Home")').click({ force: true });
  }

  async navigateTo() {
    await this.page.goto(ENDPOINTS.DASHBOARD);
  }

  async checkUI() {
    // Check if dialog exists and close it
    const dialogButton = this.page.locator('button.el-dialog__headerbtn');
    const dialogExists = await dialogButton.count() > 0;
    if (dialogExists) {
      await dialogButton.click({ force: true });
      await this.page.waitForTimeout(500);
    }

    // Use Playwright's built-in scroll methods
    const homeSection = this.page.locator('h1:has-text("Home")');
    await homeSection.scrollIntoViewIfNeeded();
    
    const inferenceUsageSection = this.page.locator('text=Inference Usage');
    await inferenceUsageSection.scrollIntoViewIfNeeded();
    
    const instancesUsageSection = this.page.locator('text=Instances Usage');
    await instancesUsageSection.scrollIntoViewIfNeeded();
  }

  async checkTimeFilterButton() {
    await this.checkDefaultTimeFilter();
    await this.checkToggleTimeFilter();
  }

  async checkDefaultTimeFilter() {
    const segmentedItems = this.page.locator('text=Inference Usage').locator('xpath=..').locator('.el-segmented .el-segmented__item');
    const count = await segmentedItems.count();
    expect(count).toBe(2);

    const firstItem = segmentedItems.nth(0);
    await expect(firstItem).toHaveClass(/is-selected/);
    await expect(firstItem.locator('.el-segmented__item-label')).toHaveText('Past 7 days');

    const secondItem = segmentedItems.nth(1);
    await expect(secondItem).not.toHaveClass(/is-selected/);
    await expect(secondItem.locator('.el-segmented__item-label')).toHaveText('Past 24 hours');
  }

  async checkToggleTimeFilter() {
    await this.past24HoursButton.click();
    
    const segmentedItems = this.page.locator('text=Inference Usage').locator('xpath=..').locator('.el-segmented .el-segmented__item');
    const count = await segmentedItems.count();
    expect(count).toBe(2);

    const firstItem = segmentedItems.nth(0);
    await expect(firstItem).not.toHaveClass(/is-selected/);

    const secondItem = segmentedItems.nth(1);
    await expect(secondItem).toHaveClass(/is-selected/);

    await this.past7DaysButton.click();
    await expect(firstItem).toHaveClass(/is-selected/);
    await expect(secondItem).not.toHaveClass(/is-selected/);
  }

  async choosePast7Days() {
    await this.past7DaysButton.click();
    await expect(this.past7DaysButton).toHaveClass(/is-selected/);
  }

  async choosePast24Hours() {
    await this.past24HoursButton.click();
    await expect(this.past24HoursButton).toHaveClass(/is-selected/);
  }

  async checkTimeFilterOption() {
    await expect(this.page.locator('text=Last 7 days')).toBeVisible();
    await expect(this.page.locator('text=Last 24 hours')).toBeVisible();
  }

  async checkTablesHaveData() {
    const tables = this.page.locator('.el-table__body');
    const count = await tables.count();
    
    for (let i = 0; i < count; i++) {
      const table = tables.nth(i);
      const rows = table.locator('tr');
      const rowCount = await rows.count();
      expect(rowCount).toBeGreaterThan(0);
    }
  }

  async checkResourceSummary() {
    const resourceSection = this.page.locator('text=Resource');
    await resourceSection.scrollIntoViewIfNeeded();
    
    const monitorSection = this.page.locator('text=Monitor your GPU, vCPU, ');
    await monitorSection.scrollIntoViewIfNeeded();
    
    const memorySection = this.page.locator('text= Memory and storage usage.');
    await memorySection.scrollIntoViewIfNeeded();
    
    const gpuSection = this.page.locator('text=GPU Amount');
    await gpuSection.scrollIntoViewIfNeeded();
    
    const vcpuSection = this.page.getByText('VCPU', { exact: true });
    await vcpuSection.scrollIntoViewIfNeeded();
    
    const memoryAmountSection = this.page.getByText('Memory', { exact: true });
    await memoryAmountSection.scrollIntoViewIfNeeded();
    
    const storageSection = this.page.getByText('Storage', { exact: true });
    await storageSection.scrollIntoViewIfNeeded();
  }

  async checkUsageStats() {
    const usageSection = this.page.getByText('Usage', { exact: true });
    await usageSection.scrollIntoViewIfNeeded();
    
    const spendRateSection = this.page.getByText('Current spend rate',{exact: true});
    await spendRateSection.scrollIntoViewIfNeeded();
    
    const insightsSection = this.page.locator('text=Keep an eye on your daily spend ');
    await insightsSection.scrollIntoViewIfNeeded();
    
    const realTimeSection = this.page.locator('text=with real-time insights');
    await realTimeSection.scrollIntoViewIfNeeded();
    
    const chart = this.page.locator('#chart-Resource');
    await chart.scrollIntoViewIfNeeded();
    await expect(chart).toBeVisible();
  }

  async checkUserInfo() {
    await expect(this.page.locator('.name-width')).toBeVisible();
    // await expect(this.page.locator('text=$')).toBeVisible();
    await this.page.locator('.el-dropdown-link').click({ force: true });
    // await expect(this.page.getBy('span:has-text("Account")')).toBeVisible(); add later
    await expect(this.page.locator('span:has-text("Logout")')).toBeVisible();
  }

  async checkSidebarMenu() {
    const menus = [
      // 'Instances', 'Reserved Instances' add later
      'Home', 'Object Storage', 'Serverless Models', 'SSH Public Key', 'API Keys', 'Billing',
      'Account', 'Team', 'Support', 'Referral'
    ];
    
    for (const menu of menus) {
      await expect(this.page.locator('.el-menu-item:has-text("' + menu + '")')).toBeVisible();
    }
    
    await expect(this.page.locator('.el-menu-item.is-active:has-text("Home")')).toBeVisible();
  }

  async checkDashboardLinks() {
    const links = [
      { text: 'Deploy', expectedUrl: '/instance\\?type=deploy' },
      { text: 'My instance', expectedUrl: '/instance' },
      // { text: 'Billing', expectedUrl: '/billing' }, add later
      { text: 'Create SSH Key', expectedUrl: '/sshkey' },
      { text: 'Pricing', expectedUrl: '/pricing' },
      { text: 'Referral', expectedUrl: '/referral' },
      { text: '$', expectedUrl: '/billing' },
    ];

    for (const link of links) {
      if (link.text === 'Upgrade') {
        await expect(this.page.locator(`text=${link.text}`)).toBeVisible();
        await this.page.locator(`text=${link.text}`).click();
        // AddPaymentMethod.checkUIModal(); // This would need to be implemented
      } else {
        await expect(this.page.locator(`text=${link.text}`)).toBeVisible();
        await this.page.locator(`text=${link.text}`).click();
        await expect(this.page).toHaveURL(new RegExp(link.expectedUrl), { timeout: 10000 });
        await this.page.goto('/home');
      }
    }
  }

  async checkDocsLink() {
    // Mock window.open
    await this.page.addInitScript(() => {
      window.open = (url?: string | URL, target?: string, features?: string) => {
        expect(url).toBe('https://docs.nebulablock.com/');
        return null;
      };
    });

    await expect(this.page.locator('text=Docs')).toBeVisible();
    await this.page.locator('text=Docs').click();
  }

  async checkSwitchLanguageButtons() {
    // Check the existence of EN and FR buttons
    await expect(this.page.getByText('EN', { exact: true })).toBeVisible();
    await expect(this.page.getByText('FR', { exact: true })).toBeVisible();

    // Check initial state (assume default is EN, menu Home should be in English)
    await expect(this.page.locator('h1:has-text("Home")')).toBeVisible();

    // Click FR and check menu switches to French
    await this.page.getByText('FR', { exact: true }).click();
    await expect(this.page.locator('h1:has-text("Accueil")')).toBeVisible(); // Home -> Accueil

    // Click back to EN and check menu switches back to English
    await this.page.getByText('EN', { exact: true }).click();
    await expect(this.page.locator('h1:has-text("Home")')).toBeVisible();
  }

  async checkHelpButton() {
    // Check for the launcher frame (Help button) in the bottom right corner
    await expect(this.page.locator('#launcher-frame')).toBeVisible();
    
    // Verify it's positioned in the bottom right area
    const launcherFrame = this.page.locator('#launcher-frame');
    const boundingBox = await launcherFrame.boundingBox();
    
    if (boundingBox) {
      // Check that it's in the bottom right quadrant (right 25% and bottom 25% of viewport)
      const viewport = this.page.viewportSize();
      if (viewport) {
        expect(boundingBox.x).toBeGreaterThan(viewport.width * 0.75);
        expect(boundingBox.y).toBeGreaterThan(viewport.height * 0.75);
      }
    }
  }

  async clickHelpButton() {
    await this.page.locator('#launcher-frame').click();
  }

  async checkFeedbackModal() {
    // Check if the help widget iframe is visible
    await expect(this.page.locator('#widget-frame')).toBeVisible();
    
    // Check form elements inside the iframe
    const iframe = this.page.frameLocator('#widget-frame');
    
    // Check form header/title
    await expect(iframe.locator('h2:has-text("Contact us")')).toBeVisible();
    
    // Check all form input fields
    await expect(iframe.locator('#name')).toBeVisible();
    await expect(iframe.locator('#email')).toBeVisible();
    await expect(iframe.locator('#subject')).toBeVisible();
    await expect(iframe.locator('#description')).toBeVisible();
    
    // Check dropdown elements (Type, Priority, Module)
    await expect(iframe.locator('button:has-text("--Dropdown arrow")').first()).toBeVisible();
    await expect(iframe.locator('button:has-text("LowDropdown arrow")')).toBeVisible();
    await expect(iframe.locator('button:has-text("--Dropdown arrow")').last()).toBeVisible();
    
    // Check file upload area
    await expect(iframe.locator('text=Upload files (max 5)')).toBeVisible();
    await expect(iframe.locator('text=Click to add or dra')).toBeVisible();
    
    // Check Send button
    await expect(iframe.locator('#form-button:has-text("Send")')).toBeVisible();
    
    // Verify form structure
    await expect(iframe.locator('form')).toBeVisible();
    
    // Check that email field is marked as required
    await expect(iframe.locator('text=Email *')).toBeVisible();
    await expect(iframe.locator('text=Description *')).toBeVisible();
  }

  async submitFeedbackViaHelpButton() {
    await this.page.locator('h1:has-text("Feedback")').locator('xpath=..').locator('button:has-text("Submit")').click();
  }
} 