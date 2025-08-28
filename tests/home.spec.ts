import { test } from '../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { loginByApi } from '../helpers/auth';

test.describe('Home Page', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.visit();
  });

  test.describe('check UI', () => {
    test('should display Home Page UI', async ({ page }) => {
      await homePage.checkUI();
    });

    test('should display main menu', async ({ page }) => {
      await homePage.checkMenu();
    });
  });

  test.describe('check chat bot function when user not login', () => {
    test('should chat with chat bot successfully', async ({ page }) => {
      await homePage.clickChatBot();
      await homePage.sendChatMessage('Hey, I need help');
      await page.waitForTimeout(10000);

      const lastMessage = page.frameLocator('iframe[src*="chat.nebulablock.com"]').locator('.chat-answer-container');

      await expect(lastMessage).toHaveCount(2);
    });

    test('should link successfully to the GPU that chat bot suggest', async ({ page, context }) => {
      await homePage.clickChatBot();
      await homePage.sendChatMessage("I'm finding the gpu H100");
      await page.waitForTimeout(10000);

      // Get chatbot iframe
      const chatFrame = page.frameLocator('iframe[src*="chat.nebulablock.com"]');
      // Get first link from the answer
      const firstLink = chatFrame.locator('.chat-answer-container a', { hasText: 'Rent' }).first();

      // Ensure link is visible
      await expect(firstLink).toBeVisible();

      // Open link in new tab (if link opens in new tab)
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        firstLink.click({ button: 'middle' })
      ]);

      // Wait for new page to load
      await newPage.waitForLoadState();
      await newPage.waitForTimeout(10000);

      // Check if URL contains '/instance'
      expect(newPage.url()).toContain('/instance');

      // Check if page content contains GPU H100 code
      await expect(newPage.locator('body')).toContainText('H100');

      await expect(newPage.locator('body')).toContainText('Log in');
    });
  });

  test.describe('check chat bot function when user logged in', () => {
    test.beforeEach(async ({ page }) => {
      // Load credentials
      const creds = require('../fixtures/credential.json');
      
      await loginByApi(page, creds.valid.email, creds.valid.password);
      await page.goto('https://dev-portal.nebulablock.com/');
    });

    test('should link successfully to the GPU that chat bot suggest', async ({ page, context }) => {
      await homePage.clickChatBot();
      await homePage.sendChatMessage("I'm finding the gpu H100");
      await page.waitForTimeout(10000);

      // Get chatbot iframe
      const chatFrame = page.frameLocator('iframe[src*="chat.nebulablock.com"]');
      // Get first link from the answer
      const firstLink = chatFrame.locator('.chat-answer-container a', { hasText: 'Rent' }).first();

      // Ensure link is visible
      await expect(firstLink).toBeVisible();

      // Open link in new tab (if link opens in new tab)
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        firstLink.click({ button: 'middle' })
      ]);

      // Wait for new page to load
      await newPage.waitForLoadState();
      await newPage.waitForTimeout(10000);

      // Check if URL contains '/instance'
      expect(newPage.url()).toContain('/instance');

      // Check if page content contains GPU H100 code
      await expect(newPage.locator('body')).toContainText('H100');

      const deploys = newPage.locator('*:text("Deploy")');
      await expect(deploys).toHaveCount(2);
    });
  });
}); 