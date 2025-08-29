/**
 * Serverless Models Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';

const allModels = [
  // Multimodal Models
  'Claude-Sonnet-4',
  'GPT-4o-mini',
  'Gemini-2.5-Pro',
  'Gemini-2.5-Flash',
  'Gemini-2.5-Flash-Lite',
  'Gemini-2.0-Flash',
  'Gemini-2.0-Flash-Lite',
  // Text Models
  'L3.3-MS-Nevoria-70b',
  'Mistral-Small-3.2-24B-Instruct-2506(beta)',
  'Midnight-Rose-70B-v2.0.3(beta)',
  'L3-70B-Euryale-v2.1(beta)',
  'L3-8B-Stheno-v3.2',
  'DeepSeek-R1-0528 (free)',
  'DeepSeek-V3-0324 (free)',
  'DeepSeek-R1 (free)',
  'Llama3.3-70B',
  'Qwen-QwQ-32B',
  'DeepSeek-V3-0324',
  'DeepSeek-R1-0528',
  // 'Bring your own model',
  // Image Models
  'Bytedance-Seedream-3.0',
  'SD-XL 1.0-base',
  'FLUX.1 [schnell]',
  'FLUX.1 [Kontext-dev]',
  // Embedding Models
  'UAE-Large-V1',
  'BGE-large-en-v1.5',
  // Vision Models
  'Qwen2.5-VL-7B-Instruct',
  // Video Models
  'Seedance-1-0-pro',
  'Seedance-1.0-lite-i2v',
  'Seedance-1.0-lite-t2v',
];

export class ServerlessModelsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors
  private serverlessModelsMenuItem = '.el-menu-item:has-text("Serverless Models")';

  async visit() {
    await this.page.locator(this.serverlessModelsMenuItem).click({ force: true });
  }

  async navigateTo() {
    await this.page.goto(ENDPOINTS.SERVERLESS);
  }

  async getModelDiv(modelName: string) {
    // Sử dụng selector chính xác hơn để tránh match với tên tương tự
    return this.page.locator(`span:has-text("${modelName}")`).filter({ hasText: new RegExp(`^${modelName}$`) });
  }

  async clickModel(modelName: string) {
    const modelDiv = await this.getModelDiv(modelName);
    await modelDiv.scrollIntoViewIfNeeded();
    await modelDiv.waitFor({ state: 'visible' });
    await modelDiv.click();
    await this.page.waitForSelector('div.el-page-header__title:has-text("Back")', { timeout: 40000 });
     // Back button
    await expect(this.page.locator('div.el-page-header__title:has-text("Back")')).toBeVisible({ timeout: 40000 });
  }

  async checkModelVisible(modelName: string) {
    const modelDiv = await this.getModelDiv(modelName);
    await modelDiv.scrollIntoViewIfNeeded();
    await expect(modelDiv).toBeVisible();
  }

  async checkModelDescription(modelName: string, description: string) {
    const modelDiv = await this.getModelDiv(modelName);
    await expect(modelDiv.locator('xpath=..')).toContainText(description);
  }

  async checkAllModelsVisible(modelList: string[]) {
    for (const model of modelList) {
      await this.checkModelVisible(model);
    }
  }

  async checkUI() {
    // Check main model groups
    await expect(this.page.locator('text=Multimodal Models')).toBeVisible();
    await expect(this.page.locator('text=Text Models')).toBeVisible();
    
    // Use Playwright's built-in scroll methods
    const imageModelsSection = this.page.locator('text=Image Models');
    await imageModelsSection.scrollIntoViewIfNeeded();
    await expect(imageModelsSection).toBeVisible();
    
    const embeddingModelsSection = this.page.locator('text=Embedding Models');
    await embeddingModelsSection.scrollIntoViewIfNeeded();
    await expect(embeddingModelsSection).toBeVisible();
    
    const visionModelsSection = this.page.locator('text=Vision Models');
    await visionModelsSection.scrollIntoViewIfNeeded();
    await expect(visionModelsSection).toBeVisible();
    
    const videoModelsSection = this.page.locator('text=Video Models');
    await videoModelsSection.scrollIntoViewIfNeeded();
    await expect(videoModelsSection).toBeVisible({ timeout: 10000 });

    // Check all models displayed on the page
    await this.checkAllModelsVisible(allModels);
  }

  async clickModelDropdown(modelName: string) {
    await this.page.locator('.el-tooltip__trigger').filter({ hasText: modelName }).click({ force: true });
  }

  async clickSystemPrompt() {
    await this.page.locator('.el-tooltip__trigger').filter({ hasText: 'Default' }).click({ force: true });
    // await this.page.waitForSelector('text=Default', { state: 'visible' });
    // await expect(this.page.locator('text=Default')).toHaveCount(2);
    // await expect(this.page.locator('span:has-text("Create new prompt")')).toBeVisible();
  }

  async checkModelDetailUI(modelName: string) {
    // Tabs/Sections
    await expect(this.page.locator('div.el-page-header__content:has-text("Serverless")')).toBeVisible();
    await expect(this.page.locator('text=Chat')).toBeVisible();
    await expect(this.page.locator('div.el-segmented__item-label:has-text("API")')).toBeVisible();

    // Model info
    await expect(this.page.locator('text=$15 / M tokens')).toBeVisible();
    await expect(this.page.locator('div.el-select__selected-item:has-text("Claude-Sonnet-4")')).toBeVisible();

    // Chat input area
    await expect(this.page.locator('text=What\'s on your mind?')).toBeVisible();

    // Model type sections
    await this.clickModelDropdown(modelName);
    await expect(this.page.locator('li.el-select-group__title:has-text("MULTIMODAL")')).toBeVisible({ timeout: 20000 });
    await expect(this.page.locator('li.el-select-group__title:has-text("TEXT")')).toBeVisible();
    
    // Use Playwright's built-in scroll methods
    const imageSection = this.page.locator('li.el-select-group__title:has-text("IMAGE")');
    await imageSection.scrollIntoViewIfNeeded();
    await expect(imageSection).toBeVisible();
    
    const embeddingSection = this.page.locator('li.el-select-group__title:has-text("EMBEDDING")');
    await embeddingSection.scrollIntoViewIfNeeded();
    await expect(embeddingSection).toBeVisible();
    
    const visionSection = this.page.locator('li.el-select-group__title:has-text("VISION")');
    await visionSection.scrollIntoViewIfNeeded();
    await expect(visionSection).toBeVisible();
    
    const videoSection = this.page.locator('li.el-select-group__title:has-text("VIDEO")');
    await videoSection.scrollIntoViewIfNeeded();
    await expect(videoSection).toBeVisible({ timeout: 10000 });
    
    for (const model of allModels) {
      // const modelElement = this.page.locator(`text=${model}`);
      const modelElement = this.page.getByRole('option', { name: model }).locator('span');
      await modelElement.scrollIntoViewIfNeeded();
      await expect(modelElement).toBeVisible();
    }
    // Click outside to close the dropdown
    await this.page.mouse.click(0, 0);

    // System Prompt
    await expect(this.page.locator('text=System Prompt')).toBeVisible();
    await this.clickSystemPrompt();

    // Switch to API tab
    await this.page.locator('.el-segmented__item-label').filter({ hasText: 'API' }).click({ force: true });
    
    // Check default (Python) tab is active
    await expect(this.page.locator('.el-tabs__item').filter({ hasText: 'Python' })).toHaveClass(/is-active/);
    
    // Switch to cURL tab and check active
    await this.page.locator('.el-tabs__item').filter({ hasText: 'cURL' }).click({ force: true });
    await expect(this.page.locator('.el-tabs__item').filter({ hasText: 'cURL' })).toHaveClass(/is-active/, { timeout: 10000 });
    
    // Switch to JavaScript tab and check active
    await this.page.locator('.el-tabs__item').filter({ hasText: 'JavaScript' }).click({ force: true });
    await expect(this.page.locator('.el-tabs__item').filter({ hasText: 'JavaScript' })).toHaveClass(/is-active/, { timeout: 10000 });
    
    // Switch back to Python tab and check active
    await this.page.locator('.el-tabs__item').filter({ hasText: 'Python' }).click({ force: true });
    await expect(this.page.locator('.el-tabs__item').filter({ hasText: 'Python' })).toHaveClass(/is-active/, { timeout: 10000 });
  }

  async clickSendButton() {
    const sendIcons = this.page.locator('.icon-send');
    const count = await sendIcons.count();
    const index = count === 2 ? 1 : 0;
    await sendIcons.nth(index).waitFor({ state: 'visible' });
    await expect(sendIcons.nth(index)).toBeVisible();
    await sendIcons.nth(index).click({ force: true });
  }
  async checkImageResult() {
    const img = this.page.locator('div.show-img img');
    await expect(img).toBeVisible({ timeout: 60000 });
    await expect(img).toHaveAttribute('src', /^data:image\/png;base64,/);
  }

  async checkBase64ImageResult() {
    await expect(this.page.locator('div.show-img img')).toHaveAttribute('src', /^data:image\/png;base64,/);
  }

  async checkVideoResult() {
    await expect(this.page.locator('div.video-action')).toBeVisible({ timeout: 120000 });
  }

  async checkActionButton(index: number) {
    const videoAction = this.page.locator('div.video-action');
    await expect(videoAction).toBeVisible({ timeout: 120000 });
    await videoAction.locator('div.el-tooltip__trigger').nth(index).click();
  }

  async checkVideoDownload() {
    await this.checkActionButton(0);
    await this.page.waitForTimeout(20000);
    // Note: File download checking would need custom implementation
  }

  async checkVideoPlay() {
    await this.checkActionButton(1);
    const video = this.page.locator('video.w-100');
    await expect(video).toBeVisible({ timeout: 10000 });
    await video.click();
    await this.page.waitForTimeout(100000);
    
    // Check if video is playing
    const isPaused = await video.evaluate((el: HTMLVideoElement) => el.paused);
    expect(isPaused).toBe(false);
    
    await this.page.locator('text=Close').click();
  }
} 