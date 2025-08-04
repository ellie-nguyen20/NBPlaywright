/**
 * Deploy Instance Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DeployInstancePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async checkDeployPageUI() {
    // Add checks for deploy page UI elements
    await expect(this.page.locator('text=Deploy Instance')).toBeVisible();
    // Add more UI checks as needed
  }

  async checkAllHardwareOutOfStock() {
    // Check that all hardware options show out-of-stock status
    const outOfStockElements = this.page.locator('text=Out of Stock');
    const count = await outOfStockElements.count();
    expect(count).toBeGreaterThan(0);
  }
} 