import { test } from '../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { SSHKeyPage } from '../pages/SSHKeyPage';
import { ENDPOINTS } from '../constants/endpoints';

const TEST_KEY = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCtestkey1234567890';
const HIDE_KEY = 'ssh-rsa A...234567890';

test.describe.serial('SSH Key Page', () => {
  let sshKeyPage: SSHKeyPage;

  test.beforeEach(async ({ page }) => {
    sshKeyPage = new SSHKeyPage(page);
    await sshKeyPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SSH_KEY));
  });

  test.afterEach(async ({ page }) => {
    
  });

  test('should display SSH Key UI', async ({ page }) => {
    await sshKeyPage.checkUI();
  });

  test('should open create modal and display UI', async ({ page }) => {
    await sshKeyPage.openCreateModal();
    await sshKeyPage.checkCreateModalUI();
  });

  test('should create a new SSH key', async ({ page }) => {
    await sshKeyPage.createKey('test-key', TEST_KEY);
    await sshKeyPage.checkKeyInTable('test-key');
  });

  test('should not allow creating duplicate SSH key', async ({ page }) => {
    await sshKeyPage.createKey('test-key-duplicate', TEST_KEY);
    await sshKeyPage.checkDuplicateKeyError();
  });

  test('should view SSH key details', async ({ page }) => {
    await sshKeyPage.checkKeyInTable('test-key');
    await sshKeyPage.viewKey('test-key');
    await sshKeyPage.checkViewModal(HIDE_KEY);
  });

  test('should copy SSH key in table', async ({ page }) => {
    await sshKeyPage.checkKeyInTable('test-key');
    await sshKeyPage.copyKeyInTable('test-key');
  });

  test('should copy SSH key in modal', async ({ page }) => {
    await sshKeyPage.checkKeyInTable('test-key');
    await sshKeyPage.viewKey('test-key');
    await sshKeyPage.copyKeyInModal();
  });

  test('should delete SSH key', async ({ page }) => {
      await sshKeyPage.viewKey('test-key');
      await sshKeyPage.deleteKeyInModal();
      await sshKeyPage.checkKeyNotInTable('test-key');
  });

  test('should verify page responsiveness on different screen sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await sshKeyPage.checkUI();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await sshKeyPage.checkUI();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await sshKeyPage.checkUI();
  });
}); 