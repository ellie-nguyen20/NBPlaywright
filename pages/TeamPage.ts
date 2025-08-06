/**
 * Team Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TeamPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors
  private teamMenuItem = '.el-menu-item:has-text("Team")';
  private createTeamButton = 'text=Create Team';
  private refreshButton = 'text=Refresh';
  private teamNameInput = 'input[placeholder="Team Name"]';
  private teamDescriptionTextarea = 'textarea[placeholder="Team Description"]';
  private confirmCreateButton = 'div.button:has-text("Create Team")';
  private confirmDeleteButton = 'div.button:has-text("Delete Team")';

  async visit() {
    await this.page.locator(this.teamMenuItem).click({ force: true });
  }

  async manageButtonVisible(roleText: string) {
    const row = this.page.locator(`tr:has-text("${roleText}")`);
    const manageButtonInRow = row.locator('div.font-16.ml-8:has-text("Manage")');
    await expect(manageButtonInRow).toBeVisible();
  }

  async deleteButtonVisible(roleText: string) {
    const row = this.page.locator(`tr:has-text("${roleText}")`);
    const deleteButtonInRow = row.locator('div.font-16.ml-8:has-text("Delete")');
    await expect(deleteButtonInRow).toBeVisible();
  }

  async viewButtonVisible(roleText: string) {
    const row = this.page.locator(`tr:has-text("${roleText}")`);
    const viewButtonInRow = row.locator('div.font-16.ml-8:has-text("View")');
    await expect(viewButtonInRow).toBeVisible();
  }

  // Use this when you expect the user to have no teams
  async checkEmptyStateUI() {
    await expect(this.page.locator('text=Team Management')).toBeVisible();
    await expect(this.page.locator('text=You don\'t have any teams')).toBeVisible();
    await expect(this.page.locator('text=Create a team to invite and manage members.')).toBeVisible();
    await expect(this.page.locator('text=Create Team')).toBeVisible();
    await expect(this.page.locator('[data-cy=team-table]')).not.toBeVisible();
  }

  // Use this when you expect a list of teams to be present
  async checkTeamListUI() {
    const teamSection = this.page.locator('h1:has-text("Team")');
    await teamSection.scrollIntoViewIfNeeded();
    await expect(this.page.locator('text=Create Team')).toBeVisible();
    await expect(this.page.locator('text=Refresh')).toBeVisible();
    await expect(this.page.locator('text=Team Name')).toBeVisible();
    await expect(this.page.locator('text=Your Role')).toBeVisible();
    await expect(this.page.locator('text=Members')).toBeVisible();
    await expect(this.page.locator('text=Created At')).toBeVisible();
    await expect(this.page.locator('text=Actions')).toBeVisible();
  }

  async clickCreateTeam() {
    await this.page.locator(this.createTeamButton).click({ force: true });
    await this.page.waitForTimeout(2000);
    await this.page.locator(this.teamNameInput).waitFor({ state: 'visible', timeout: 10000 });
  }

  async clickRefresh() {
    await this.page.locator(this.refreshButton).click();
  }

  async fillTeamName(name: string) {
    const input = this.page.locator(this.teamNameInput);
    await input.clear({ force: true });
    await input.fill(name);
  }

  async fillTeamDescription(description: string) {
    const textarea = this.page.locator(this.teamDescriptionTextarea);
    await textarea.clear({ force: true });
    await textarea.fill(description);
  }

  async confirmCreate() {
    await this.page.locator(this.confirmCreateButton).click({ force: true });
  }

  // This action navigates to the team detail page
  async clickManage(teamName: string) {
    const row = this.page.locator(`tr:has-text("${teamName}")`);
    await row.locator('div.instance-btn.btn-transparent.border-radius-10.font-22.flex.flex-ai-center.color-border.pointer.mr-8.mt-4.mb-4').click();

  }

  async clickDelete(teamName: string) {
    const row = this.page.locator(`tr:has-text("${teamName}")`);
    await row.locator('div.instance-btn.btn-transparent.delete.border-radius-10.font-22.flex.flex-ai-center.color-border.pointer.mt-4.mb-4').click();
  }

  async confirmDelete() {
    await this.page.locator(this.confirmDeleteButton).click({ force: true });
  }

  async checkTeamCount(expectedCount: number) {
    const rows = this.page.locator('tbody tr');
    await expect(rows).toHaveCount(expectedCount);
  }

  async checkTeamVisible(teamName: string) {
    await expect(this.page.getByText(teamName, { exact: true })).toBeVisible();
  }  

  async checkRoleText(teamName: string, roleText: string) {
    const row = this.page.locator(`tr:has-text("${teamName}")`);
    await expect(row.locator('.owner-style')).toHaveText(roleText);
  }

  async checkManageButtonNotExist() {
    await expect(this.page.locator('div:has-text("Manage")')).not.toBeVisible();
  }

  async checkDeleteButtonNotExist() {
    await expect(this.page.locator('div:has-text("Delete")')).not.toBeVisible();
  }

  async checkViewButtonNotExist() {
    await expect(this.page.locator('div:has-text("View")')).not.toBeVisible();
  }
} 