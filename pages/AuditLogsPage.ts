/**
 * Audit Logs Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';

export class AuditLogsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors
  private auditLogsMenuItem = '.el-menu-item:has-text("Audit Logs")';
  private searchInput = '.search-input';
  private filterDropdown = '.el-select__wrapper';
  private dateRangePicker = '.el-date-editor';
  private resetButton = 'text=Reset';
  private auditLogCards = '.el-card.is-hover-shadow';
  private auditLogEntries = '.el-card.is-hover-shadow';
  private paginationContainer = '.el-pagination';
  private paginationNumbers = '.el-pagination .number';
  private totalRecords = 'text=Total';
  private auditLogTime = '.time.color-info';
  private auditLogUser = '.font-bold.color-light';
  private auditLogAction = '.color-border-80.ml-8.mr-8';
  private auditLogDetails = '.color-border-80.ml-8:not(.mr-8)';

  async visit() {
    await this.page.locator(this.auditLogsMenuItem).click({ force: true });
    await this.page.waitForURL(new RegExp(ENDPOINTS.AUDIT_LOGS), { timeout: 30000 });
  }

  async navigateTo() {
    await this.page.goto(ENDPOINTS.AUDIT_LOGS, { timeout: 30000 });
  }

  async checkUI() {
    // Wait for the main elements to be visible with 20 second timeout
    await expect(this.page.locator('h1:has-text("Audit Logs")').first()).toHaveCount(1, { timeout: 20000 });
    
    // Check search functionality
    await expect(this.page.locator(this.searchInput)).toBeVisible({ timeout: 20000 });
    
    // Check filter dropdown
    await expect(this.page.locator(this.filterDropdown)).toBeVisible({ timeout: 20000 });
    
    // Check date range picker
    await expect(this.page.locator(this.dateRangePicker)).toBeVisible({ timeout: 20000 });
    
    // Check reset button
    await expect(this.page.locator(this.resetButton)).toBeVisible({ timeout: 20000 });
    
    // Check pagination
    await expect(this.page.locator(this.paginationContainer)).toBeVisible({ timeout: 20000 });
    
    // Check total records display
    await expect(this.page.locator(this.totalRecords)).toBeVisible({ timeout: 20000 });
    
    // Check audit log entries are displayed
    await expect(this.page.locator(this.auditLogCards).first()).toBeVisible({ timeout: 20000 });
  }

  async searchLogs(searchTerm: string) {
    await this.page.locator(this.searchInput).fill(searchTerm);
    await this.page.waitForTimeout(1000); // Wait for search to process
  }

  async clearSearch() {
    await this.page.locator(this.searchInput).clear();
  }

  async openFilterDropdown() {
    await this.page.locator(this.filterDropdown).click({ timeout: 20000 });
  }

  async selectFilterOption(option: string) {
    // Wait for dropdown to open
    await this.page.waitForTimeout(500);
    await this.page.locator(`text=${option}`).click({ timeout: 20000 });
  }

  async openDateRangePicker() {
    await this.page.locator(this.dateRangePicker).click({ timeout: 20000 });
  }

  async selectDateRange(startDate: string, endDate: string) {
    // This would need to be implemented based on the actual date picker component
    // For now, just clicking the date range picker
    await this.openDateRangePicker();
    // TODO: Implement actual date selection based on the calendar component
  }

  async resetFilters() {
    await this.page.locator(this.resetButton).click({ timeout: 20000 });
    await this.page.waitForTimeout(1000); // Wait for reset to process
  }

  async navigateToPage(pageNumber: number) {
    // Find and click the specific page number
    const paginationNumbers = await this.page.locator(this.paginationNumbers).all();
    
    for (const pageBtn of paginationNumbers) {
      const text = await pageBtn.textContent();
      if (text && text.trim() === pageNumber.toString()) {
        await pageBtn.click({ timeout: 20000 });
        await this.page.waitForTimeout(1000); // Wait for page to load
        break;
      }
    }
  }

  async getCurrentPage(): Promise<number> {
    const activePage = this.page.locator('.el-pagination .number.is-active');
    const pageText = await activePage.textContent();
    return pageText ? parseInt(pageText.trim()) : 1;
  }

  async getTotalRecords(): Promise<number> {
    const totalText = await this.page.locator(this.totalRecords).textContent();
    if (totalText) {
      const match = totalText.match(/Total (\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  }

  async getRecordsCount(): Promise<number> {
    // Wait for audit log entries to be visible before counting
    await this.page.waitForSelector(this.auditLogEntries, { timeout: 20000 });
    const entries = await this.page.locator(this.auditLogEntries).count();
    return entries;
  }

  async verifyRecordsPerPage(expectedCount: number = 20) {
    const actualCount = await this.getRecordsCount();
    expect(actualCount).toBe(expectedCount);
  }

  async getAuditLogDetails() {
    const logs: Array<{
      user?: string;
      action?: string;
      details?: string;
      time?: string;
    }> = [];
    
    // Debug: Check if we can find log entries
    const entriesCount = await this.page.locator(this.auditLogEntries).count();
    console.log(`Found ${entriesCount} log entries with selector: ${this.auditLogEntries}`);
    
    // Try alternative selectors if main one doesn't work
    if (entriesCount === 0) {
      console.log('Trying alternative selectors...');
      const altSelectors = [
        '.el-card.is-hover-shadow',
        '.audit-log-entry',
        '.log-entry',
        '.el-card',
        '.logs-body .el-card'
      ];
      
      for (const selector of altSelectors) {
        const count = await this.page.locator(selector).count();
        console.log(`Alternative selector "${selector}": ${count} elements`);
      }
    }
    
    const entries = await this.page.locator(this.auditLogEntries).all();
    console.log(`Entries array length: ${entries.length}`);
    
    for (const entry of entries) {
      const user = await entry.locator(this.auditLogUser).textContent();
      
      // Get action - use nth(0) for the first .color-border-80.ml-8.mr-8
      const action = await entry.locator('.color-border-80.ml-8.mr-8').first().textContent();
      
      // Get details - use nth(1) for the second .color-border-80.ml-8 (without mr-8)
      const details = await entry.locator('.color-border-80.ml-8').nth(1).textContent();
      
      const time = await entry.locator(this.auditLogTime).textContent();
      
      logs.push({
        user: user?.trim(),
        action: action?.trim(),
        details: details?.trim(),
        time: time?.trim()
      });
    }
    
    return logs;
  }

  // New method: Get audit logs data from API with authentication
  async getAuditLogsFromAPI(page: number = 1, pageSize: number = 20) {
    const apiUrl = `https://dev-portal-api.nebulablock.com/api/v1/users/user-activity?page_size=${pageSize}&page=${page}`;
    
    // Get JWT token from localStorage
    const token = await this.page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    console.log(`Fetching audit logs from API: ${apiUrl}`);
    console.log('JWT Token:', token ? token.substring(0, 50) + '...' : 'No token found');
    
    if (!token) {
      throw new Error('No JWT token found in localStorage. Please ensure user is logged in.');
    }
    
    const response = await this.page.request.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    console.log(`API Response status: ${response.status()}`);
    console.log(`API Response data:`, JSON.stringify(data, null, 2));
    
    return {
      status: response.status(),
      data: data,
      logs: data.data || [], // API response has 'data' array
      total: data.pagination?.total_records || 0,
      totalPages: data.pagination?.total_pages || 0,
      currentPage: data.pagination?.current_page || page,
      pageSize: data.pagination?.page_size || pageSize,
      hasNext: data.pagination?.has_next || false,
      message: data.message || '',
      statusMessage: data.status || ''
    };
  }

  // Method to verify authentication status
  async verifyAuthenticationStatus() {
    const token = await this.page.evaluate(() => 
      localStorage.getItem('nebulablock_newlook_token')
    );
    
    if (!token) {
      console.log('❌ No JWT token found in localStorage');
      throw new Error('User is not authenticated. Please ensure login setup is complete.');
    }
    
    console.log('✅ JWT token found in localStorage:', token.substring(0, 50) + '...');
    return true;
  }

  // New method: Compare API data with UI data
  async compareAPIDataWithUI(page: number = 1, pageSize: number = 20) {
    console.log('=== Comparing API data with UI data ===');
    
    // Verify authentication first
    await this.verifyAuthenticationStatus();
    
    // Get data from API
    const apiResponse = await this.getAuditLogsFromAPI(page, pageSize);
    
    // Get data from UI
    const uiLogs = await this.getAuditLogDetails();
    
    console.log(`API returned ${apiResponse.logs.length} logs`);
    console.log(`UI shows ${uiLogs.length} logs`);
    
    // Compare counts
    const countMatch = apiResponse.logs.length === uiLogs.length;
    console.log(`Count match: ${countMatch}`);
    
    // Compare individual log entries
    const comparisons: Array<{
      index: number;
      apiLog: { user: any; action: any; details: any; time: any };
      uiLog: { user?: string; action?: string; details?: string; time?: string };
      matches: { user: boolean; action: boolean; details: boolean; time: boolean };
    }> = [];
    
    for (let i = 0; i < Math.min(apiResponse.logs.length, uiLogs.length); i++) {
      const apiLog = apiResponse.logs[i];
      const uiLog = uiLogs[i];
      
      const comparison = {
        index: i,
        apiLog: {
          user: apiLog.user_email,
          action: apiLog.action,
          details: `${apiLog.resource}: ${apiLog.resource_name}`,
          time: apiLog.activity_time,
          eventId: apiLog.event_id,
          resource: apiLog.resource,
          resourceName: apiLog.resource_name
        },
        uiLog: uiLog,
        matches: {
          user: apiLog.user_email === uiLog.user,
          action: apiLog.action === uiLog.action,
          details: `${apiLog.resource}: ${apiLog.resource_name}` === uiLog.details,
          time: apiLog.activity_time === uiLog.time
        }
      };
      
      comparisons.push(comparison);
      console.log(`Log ${i + 1} comparison:`, comparison);
    }
    
    return {
      apiResponse,
      uiLogs,
      countMatch,
      comparisons,
      totalMatch: comparisons.every(c => Object.values(c.matches).every(m => m))
    };
  }

  async verifyAuditLogEntry(expectedEntry: {
    user?: string;
    action?: string;
    details?: string;
    time?: string;
  }) {
    const logs = await this.getAuditLogDetails();
    
    if (expectedEntry.user) {
      expect(logs.some(log => log.user?.includes(expectedEntry.user!))).toBeTruthy();
    }
    
    if (expectedEntry.action) {
      expect(logs.some(log => log.action?.includes(expectedEntry.action!))).toBeTruthy();
    }
    
    if (expectedEntry.details) {
      expect(logs.some(log => log.details?.includes(expectedEntry.details!))).toBeTruthy();
    }
  }

  async verifyPaginationExists() {
    await expect(this.page.locator(this.paginationContainer)).toBeVisible({ timeout: 20000 });
  }

  async verifyPaginationNumbers(expectedNumbers: number[]) {
    const paginationNumbers = await this.page.locator(this.paginationNumbers).all();
    const actualNumbers: number[] = [];
    
    for (const pageBtn of paginationNumbers) {
      const text = await pageBtn.textContent();
      if (text && text.trim().match(/^\d+$/)) {
        actualNumbers.push(parseInt(text.trim()));
      }
    }
    
    console.log('Expected numbers:', expectedNumbers);
    console.log('Actual numbers:', actualNumbers);
    
    // Verify that we have at least 2 pages
    expect(actualNumbers.length).toBeGreaterThanOrEqual(2);
    
    // Verify that page 1 is always visible
    expect(actualNumbers).toContain(1);
    
    // Verify that the last page is visible (this is common in pagination patterns)
    const lastPage = Math.max(...expectedNumbers);
    expect(actualNumbers).toContain(lastPage);
    
    // Verify that all visible numbers are within valid range
    for (const num of actualNumbers) {
      expect(num).toBeGreaterThanOrEqual(1);
      expect(num).toBeLessThanOrEqual(lastPage);
    }
    
    // Verify that we don't have more pages than expected
    expect(Math.max(...actualNumbers)).toBeLessThanOrEqual(lastPage);
  }

  async verifySearchFunctionality(searchTerm: string) {
    await this.searchLogs(searchTerm);
    
    // Wait a bit for search results to load
    await this.page.waitForTimeout(2000);
    
    // Verify that search results contain the search term OR no results are shown
    const logs = await this.getAuditLogDetails();
    console.log(`Search term: "${searchTerm}"`);
    console.log(`Found ${logs.length} logs after search`);
    
    // Debug: Print all logs to see what we extracted
    console.log('=== DEBUG: Extracted logs ===');
    logs.forEach((log, index) => {
      console.log(`Log ${index + 1}:`, {
        user: log.user,
        action: log.action,
        details: log.details,
        time: log.time
      });
    });
    
    // Also check the full text of each log entry as fallback
    let hasMatchingResults = logs.some(log => 
      log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // If no match in extracted fields, check full text of log entries
    if (!hasMatchingResults) {
      const entries = await this.page.locator(this.auditLogEntries).all();
      for (const entry of entries) {
        const fullText = await entry.textContent();
        if (fullText?.toLowerCase().includes(searchTerm.toLowerCase())) {
          hasMatchingResults = true;
          console.log(`Found match in full text: "${fullText}"`);
          break;
        }
      }
    }
    
    console.log(`Search term: "${searchTerm}"`);
    console.log(`Has matching results: ${hasMatchingResults}`);
    
    // If no matching results, check if UI properly shows "no results" state
    if (!hasMatchingResults) {
      const noResultsText = await this.page.locator('text=No results').isVisible().catch(() => false);
      const emptyState = logs.length === 0;
      console.log(`No results text visible: ${noResultsText}, Empty state: ${emptyState}`);
      
      // When search has no matches, UI should show either:
      // 1. "No results" message, OR
      // 2. Empty list (no logs displayed)
      // If neither happens, search functionality is broken
      const searchWorkedCorrectly = noResultsText || emptyState;
      
      if (!searchWorkedCorrectly) {
        console.log('❌ Search failed: No matches found but UI still shows all logs');
        console.log('This indicates search functionality is not working properly');
      }
      
      expect(searchWorkedCorrectly).toBeTruthy();
    } else {
      // If we have matching results, that's good
      console.log('✅ Search worked: Found matching results');
      expect(hasMatchingResults).toBeTruthy();
    }
  }

  async verifyFilterOptions() {
    const expectedOptions = ['Create', 'Update', 'Delete', 'Add', 'Remove', 'Start', 'Stop', 'Reboot'];
    
    await this.openFilterDropdown();
    
    for (const option of expectedOptions) {
      // Use more specific selector to only match options in dropdown, not in log entries
      await expect(this.page.locator(`.el-select-dropdown .el-select-dropdown__item:has-text("${option}")`)).toBeVisible({ timeout: 20000 });
    }
    
    // Close dropdown by clicking outside
    await this.page.locator('body').click({ position: { x: 10, y: 10 } });
  }

  async verifyDateRangePickerExists() {
    await expect(this.page.locator(this.dateRangePicker)).toBeVisible({ timeout: 20000 });
    
    // Verify placeholder text
    const startDatePlaceholder = this.page.locator('.el-range-input').nth(0);
    const endDatePlaceholder = this.page.locator('.el-range-input').nth(1);
    
    await expect(startDatePlaceholder).toHaveAttribute('placeholder', 'Start date', { timeout: 20000 });
    await expect(endDatePlaceholder).toHaveAttribute('placeholder', 'End date', { timeout: 20000 });
  }

  async verifyResetFunctionality() {
    // First, make some changes
    await this.searchLogs('test');
    
    // Then reset
    await this.resetFilters();
    
    // Verify search is cleared
    const searchValue = await this.page.locator(this.searchInput).inputValue();
    expect(searchValue).toBe('');
  }

  async verifyAuditLogIcons() {
    const entries = await this.page.locator(this.auditLogEntries).all();
    
    for (const entry of entries) {
      // Check for action icons (success/error icons)
      const icon = entry.locator('.xy-icon');
      await expect(icon).toBeVisible({ timeout: 20000 });
    }
  }

  async verifyAuditLogTimestamps() {
    const logs = await this.getAuditLogDetails();
    
    // Verify all logs have timestamps
    for (const log of logs) {
      expect(log.time).toBeTruthy();
      expect(log.time).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} \w{3}/);
    }
  }

  async verifyAuditLogUsers() {
    const logs = await this.getAuditLogDetails();
    
    // Verify all logs have users
    for (const log of logs) {
      expect(log.user).toBeTruthy();
      expect(log.user).toContain('@'); // Email format
    }
  }

  // Public method to access page for test assertions
  getPage() {
    return this.page;
  }
}
