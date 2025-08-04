/**
 * Team Detail Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TeamDetailPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Check UI elements for a user with 'Owner' role
  async checkOwnerUI() {
    await expect(this.page.locator('[data-cy=invite-member-button]')).toBeVisible();
    await expect(this.page.locator('[data-cy=team-settings-tab]')).toBeVisible();
    await expect(this.page.locator('[data-cy=disband-team-button]')).toBeVisible();
  }

  // Check UI elements for a user with 'Member' role
  async checkMemberUI() {
    await expect(this.page.locator('[data-cy=invite-member-button]')).not.toBeVisible();
    await expect(this.page.locator('[data-cy=team-settings-tab]')).not.toBeVisible();
    await expect(this.page.locator('[data-cy=leave-team-button]')).toBeVisible();
  }

  // Action methods
  async clickInviteMember() {
    await this.page.locator('text=Invite Member').click({ force: true });
  }

  async fillInviteEmail(email: string) {
    const input = this.page.locator('input[placeholder="Email Address"]');
    await expect(input).toBeVisible();
    await input.clear({ force: true });
    await input.fill(email);
  }

  async confirmInvite() {
    const sendInvitationButton = this.page.locator('div:has-text("send invitation")');
    await sendInvitationButton.scrollIntoViewIfNeeded();
    await expect(sendInvitationButton).toBeVisible({ timeout: 10000 });
    await sendInvitationButton.click({ force: true });
  }

  async clickCancelPendingButton() {
    await this.page.locator('text=Cancel').click({ force: true });
  }

  async clickConfirmCancel() {
    await this.page.locator('text=Cancel Invitation').click({ force: true });
  }

  async clickDeleteTeam() {
    const deleteTeamButton = this.page.locator('div:has-text("Delete Team")');
    await deleteTeamButton.scrollIntoViewIfNeeded();
    await expect(deleteTeamButton).toBeVisible({ timeout: 10000 });
    await deleteTeamButton.click({ force: true });
  }

  async clickConfirmDelete() {
    await this.page.locator('.el-dialog__body').locator('text=Delete Team').click({ force: true });
  }

  async clickTransferOwnership() {
    const transferOwnershipButton = this.page.locator('div:has-text("Transfer Ownership")');
    await transferOwnershipButton.scrollIntoViewIfNeeded();
    await transferOwnershipButton.click({ force: true });
  }

  async clickDropdownChoice(choiceText: string) {
    const dropdownItem = this.page.locator('.el-select-dropdown__item').filter({ hasText: choiceText });
    await dropdownItem.waitFor({ state: 'visible', timeout: 10000 });
    await dropdownItem.click({ force: true });
  }
  
  async clickConfirmTransferOwnership() {
    await this.page.locator('.el-dialog__body').locator('text=Transfer Ownership').click({ force: true });
  }

  async removeMemberByEmail(email: string) {
    const memberRow = this.page.locator(`tr:has-text("${email}")`);
    await memberRow.locator('text=Remove').click({ force: true });
  }

  async clickConfirmRemoveMember() {
    const cancelButton = this.page.locator('text=Cancel');
    const parentElement = cancelButton.locator('xpath=..');
    await parentElement.locator('text=Remove').waitFor({ state: 'visible' });
    await parentElement.locator('text=Remove').click({ force: true });
    
    // Uncomment these lines if you want to check for success message and member removal
    // await expect(this.page.locator('text=Team member removed successfully')).toBeVisible({ timeout: 10000 });
    // await expect(this.page.locator(`tr:has-text("${email}")`)).not.toBeVisible();
  }
} 