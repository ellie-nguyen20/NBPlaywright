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

// Payment test data for credit card tests
export const PAYMENT_TEST_DATA = {
  validCard: {
    email: 'ellie.nguyen@example.com',
    cardNumber: '4242424242424242', // Stripe test card - successful payment
    expiration: '1230', // December 2030
    cvc: '123',
    cardholderName: 'Ellie Nguyen',
    country: 'VN' // Vietnam
  },
  declinedCard: {
    email: 'ellie.nguyen@example.com',
    cardNumber: '4000000000000002', // Stripe test card - declined
    expiration: '1230',
    cvc: '123',
    cardholderName: 'Ellie Nguyen',
    country: 'VN'
  },
  insufficientFundsCard: {
    email: 'ellie.nguyen@example.com',
    cardNumber: '4000000000009995', // Stripe test card - insufficient funds
    expiration: '1230',
    cvc: '123',
    cardholderName: 'Ellie Nguyen',
    country: 'VN'
  }
}; 