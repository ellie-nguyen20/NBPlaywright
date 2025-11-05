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

// Declined payment cards based on Stripe test cards for error simulation
export const DECLINED_CARDS = {
  genericDecline: {
    email: 'ellie.nguyen@example.com',
    cardNumber: '4000000000000002', // Generic decline
    expiration: '1230',
    cvc: '123',
    cardholderName: 'Ellie Nguyen',
    country: 'VN',
    expectedError: 'Payment validation failed. Your card was declined.',
    declineCode: 'generic_decline'
  },
  insufficientFunds: {
    email: 'ellie.nguyen@example.com',
    cardNumber: '4000000000009995', // Insufficient funds
    expiration: '1230',
    cvc: '123',
    cardholderName: 'Ellie Nguyen',
    country: 'VN',
    expectedError: 'Payment validation failed. Your card has insufficient funds.',
    declineCode: 'insufficient_funds'
  },
  lostCard: {
    email: 'ellie.nguyen@example.com',
    cardNumber: '4000000000009987', // Lost card
    expiration: '1230',
    cvc: '123',
    cardholderName: 'Ellie Nguyen',
    country: 'VN',
    expectedError: 'Your card was declined.',
    declineCode: 'lost_card'
  },
  stolenCard: {
    email: 'ellie.nguyen@example.com',
    cardNumber: '4000000000009979', // Stolen card
    expiration: '1230',
    cvc: '123',
    cardholderName: 'Ellie Nguyen',
    country: 'VN',
    expectedError: 'Your card was declined.',
    declineCode: 'stolen_card'
  },
  expiredCard: {
    email: 'ellie.nguyen@example.com',
    cardNumber: '4000000000000069', // Expired card
    expiration: '1230',
    cvc: '123',
    cardholderName: 'Ellie Nguyen',
    country: 'VN',
    expectedError: 'Your card has expired.',
    declineCode: 'n/a'
  },
  incorrectCVC: {
    email: 'ellie.nguyen@example.com',
    cardNumber: '4000000000000127', // Incorrect CVC
    expiration: '1230',
    cvc: '999', // Wrong CVC
    cardholderName: 'Ellie Nguyen',
    country: 'VN',
    expectedError: 'Your card\'s security code is incorrect.',
    declineCode: 'n/a'
  },
  processingError: {
    email: 'ellie.nguyen@example.com',
    cardNumber: '4000000000000119', // Processing error
    expiration: '1230',
    cvc: '123',
    cardholderName: 'Ellie Nguyen',
    country: 'VN',
    expectedError: 'An error occurred while processing your card.',
    declineCode: 'n/a'
  },
  incorrectNumber: {
    email: 'ellie.nguyen@example.com',
    cardNumber: '4242424242424241', // Incorrect number
    expiration: '1230',
    cvc: '123',
    cardholderName: 'Ellie Nguyen',
    country: 'VN',
    expectedError: 'Your card number is incorrect.',
    declineCode: 'n/a'
  },
  velocityExceeded: {
    email: 'ellie.nguyen@example.com',
    cardNumber: '4000000000006975', // Exceeding velocity limit
    expiration: '1230',
    cvc: '123',
    cardholderName: 'Ellie Nguyen',
    country: 'VN',
    expectedError: 'Your card was declined.',
    declineCode: 'card_velocity_exceeded'
  }
};

// PayPal test data for payment tests - Updated based on actual sandbox testing
export const PAYPAL_TEST_DATA = {
  validPayPal: {
    email: 'ellie.nguyen@example.com',
    amount: '50',
    paypalEmail: 'sb-kv5q946998418@personal.example.com',
    paypalPassword: '(h!zg68J',
    expectedSuccessMessage: 'Your funds are on the way and are usually available within the minute!',
    successUrl: '/payment-success',
    merchantName: 'Nebula Block'
  },
  invalidCredentials: {
    email: 'ellie.nguyen@example.com',
    amount: '25',
    paypalEmail: 'invalid@email.com',
    paypalPassword: 'wrongpassword',
    expectedError: 'Some of your info didn\'t match. Try again, change the email address, or get help if you forgot your password.'
  },
  cancelledPayment: {
    email: 'ellie.nguyen@example.com',
    amount: '100',
    paypalEmail: 'sb-kv5q946998418@personal.example.com',
    paypalPassword: 'h!zg68J',
    expectedMessage: 'Payment cancelled',
    cancelButtonText: 'Cancel and return to Nebula Block'
  },
  timeoutPayment: {
    email: 'ellie.nguyen@example.com',
    amount: '75',
    paypalEmail: 'sb-kv5q946998418@personal.example.com',
    paypalPassword: 'h!zg68J',
    expectedError: 'Payment timeout'
  },
  // Additional test scenarios based on real PayPal flow
  paypalLoginFlow: {
    loginPageTitle: 'Log in to your PayPal account',
    loginFormEmail: 'Email or mobile number',
    loginFormPassword: 'Password',
    nextButtonText: 'Next',
    loginButtonText: 'Log In'
  },
  paypalPaymentFlow: {
    paymentPageTitle: 'Pay with PayPal',
    merchantInfo: 'Nebula Block',
    completePurchaseButton: 'Complete Purchase',
    cancelButton: 'Cancel and return to Nebula Block',
    currencyConversion: 'PayPal\'s conversion rate:',
    paymentMethods: ['PayPal balance', 'BMO - ONLINE BANKING', 'Visa']
  }
}; 