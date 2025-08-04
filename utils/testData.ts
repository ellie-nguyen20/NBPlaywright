/**
 * Test data management
 */
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Load test data from fixtures
 */
export function loadTestData(filename: string): any {
  const filePath = join(process.cwd(), 'fixtures', filename);
  const fileContent = readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

/**
 * Get credentials for testing
 */
export function getCredentials() {
  return loadTestData('credential.json');
}

/**
 * Get valid user credentials
 */
export function getValidCredentials() {
  const credentials = getCredentials();
  return credentials.valid;
}

/**
 * Get invalid user credentials
 */
export function getInvalidCredentials() {
  const credentials = getCredentials();
  return credentials.invalid;
}

/**
 * Get account credentials
 */
export function getAccountCredentials() {
  const credentials = getCredentials();
  return credentials.account;
} 