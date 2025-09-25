/**
 * Billing Page Object Model
 */
import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { ENDPOINTS } from '../constants/endpoints';

export class BillingPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Selectors
  private billingMenuItem = '.el-menu-item:has-text("Billing")';

  async visit() {
    await this.page.locator(this.billingMenuItem).click({ force: true });
    await this.page.waitForURL(new RegExp(ENDPOINTS.BILLING), { timeout: 30000 });
  }

  async navigateTo() {
    await this.page.goto(ENDPOINTS.BILLING, { timeout: 30000 });
  }

  async checkUI() {
    // Wait for the element to be visible, not just present
    await expect(this.page.locator('h1:has-text("Available Credits")').first()).toHaveCount(1);
    await expect(this.page.locator('text=Configure Auto-Pay').first()).toBeVisible();
    await expect(this.page.locator('h1:has-text("Payment Method")')).toBeVisible();
    await expect(this.page.locator('text=Add Promotion Code').first()).toBeVisible();
    await this.page.locator('text=Transactions').scrollIntoViewIfNeeded();
    await expect(this.page.locator('text=Transactions').first()).toBeVisible();
    await this.page.locator('text=Usages').scrollIntoViewIfNeeded();
    await expect(this.page.locator('text=Usages').first()).toBeVisible();
  }

  async clickAddCredits() {
    await this.page.locator('text=Add Credits').click({ force: true });
  }

  async selectCreditAmount(amount: string) {
    await this.page.locator(`text=$${amount}`).click({ force: true });
  }

  async payWithCard() {
    await this.page.locator('text=Pay with Card').click({ force: true });
  }

  async payWithCrypto() {
    await expect(async () => {
      await this.page.locator('text=Pay with Crypto').click({ force: true });
      await expect(this.page.getByText('Payment Details')).toBeVisible({ timeout: 1000 });
    }).toPass({timeout: 10000});
  }

  async configureAutoPay() {
    await this.page.locator('text=Configure Auto-Pay').click({ force: true });
  }

  async saveAutoPaySettings() {
    await this.page.locator('text=Save Autopay Settings').click({ force: true });
  }

  async addPaymentMethod() {
    await this.page.locator('text=Add a New Card').click({ force: true, timeout: 10000 });
  }

  async addPromotionCode() {
    await this.page.locator('text=Add Promotion Code').click({ force: true });
  }

  async redeemCode() {
    await this.page.locator('text=Redeem').click({ force: true });
  }

  async refreshTransactions() {
    await this.page.locator('text=Transactions').locator('xpath=..').locator('text=Refresh').click({ force: true });
  }

  async downloadInvoice() {
    await this.page.locator('text=Download PDF').first().click({ force: true });
  }

  async filterUsages(type: string) {
    await this.page.locator(`label:has-text("${type}")`).click({ force: true });
  }

  // New methods for adding payment method
  async clickAddNewCard() {
    await expect(async () => {
      await expect(this.page.locator('button.el-button.add-method:has-text("Add a New Card")')).toBeVisible();
      await this.page.locator('button.el-button.add-method:has-text("Add a New Card")').click({ force: true });
      
      // Wait for modal to appear and be visible
      await this.page.waitForTimeout(2000); // Wait for modal animation
      
      // Check if modal is visible, if not wait longer
      const modal = this.page.locator('h2:has-text("Add Payment Method")');
      await modal.waitFor({ state: 'visible', timeout: 5000 });
      
      // Verify modal is actually visible
      await expect(modal).toBeVisible({ timeout: 5000 });
    }).toPass({timeout: 20000});
  }

  async fillBillingAddress(addressInfo: {
    fullName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    // province: string;
    postalCode: string;
  }) {
    // Wait for address iframe to be ready
    await this.page.waitForSelector('iframe[title="Secure address input frame"]', { timeout: 25000 });
    
    // Wait for modal to be fully visible
    await this.page.waitForSelector('h2:has-text("Add Payment Method")', { state: 'visible', timeout: 25000 });
    
    // Wait additional time for iframe content to fully load
    await this.page.waitForTimeout(3000);
    
    // Fill in the address iframe
    const addressIframe = this.page.frameLocator('iframe[title="Secure address input frame"]');
    
    // Wait for each field to be ready before filling
    const fullNameField = addressIframe.locator('input[placeholder*="name"], input[name*="name"], input[autocomplete*="name"]').first();
    await fullNameField.waitFor({ state: 'visible', timeout: 25000 });
    await fullNameField.fill(addressInfo.fullName);

    const countryField = addressIframe.locator('#Field-countryInput');
    await countryField.waitFor({ state: 'visible', timeout: 25000 });
    await countryField.selectOption({ value: 'VN' });
    
    const address1Field = addressIframe.locator('input[placeholder*="address"], input[name*="address"], input[placeholder*="street"], input[name*="street"]').first();
    await address1Field.waitFor({ state: 'visible', timeout: 25000 });
    await address1Field.fill(addressInfo.addressLine1);
    
    const address2Field = addressIframe.locator('input[placeholder*="address"], input[name*="address"], input[placeholder*="street"], input[name*="street"]').nth(1);
    await address2Field.waitFor({ state: 'visible', timeout: 25000 });
    await address2Field.fill(addressInfo.addressLine2);
    
    // Try multiple selectors for city field with better waiting strategy
    let cityField;
    try {
      // First try: use specific ID for city field
      cityField = addressIframe.locator('#Field-localityInput');
      await cityField.waitFor({ state: 'visible', timeout: 30000 });
    } catch (error) {
      // If specific ID fails, try alternative selectors
      console.log('City field not found with specific ID, trying alternatives...');
      cityField = addressIframe.locator('input[placeholder*="city"], input[name*="city"], input[autocomplete*="city"]').first();
      await cityField.waitFor({ state: 'visible', timeout: 30000 });
    }
    await cityField.fill(addressInfo.city);
    
    const provinceField = addressIframe.locator('#Field-administrativeAreaInput');
    await provinceField.waitFor({ state: 'visible', timeout: 25000 });
    await provinceField.selectOption({ value: 'An Giang Province' });

    const postalField = addressIframe.locator('input[placeholder*="postal"], input[name*="postal"], input[placeholder*="zip"], input[name*="zip"]').first();
    await postalField.waitFor({ state: 'visible', timeout: 25000 });
    await postalField.fill(addressInfo.postalCode);
  }

  async fillCreditCardInfo(cardInfo: {
    // cardNumber: string;
    expirationDate: string;
    securityCode: string;
  }, cardNumber?: string) {
    // Wait for Stripe iframe to be ready first
    await this.page.waitForSelector('iframe[title*="payment"]', { timeout: 25000 });
    
    // Wait additional time for iframe content to fully load
    await this.page.waitForTimeout(2000);
    
    // Get all payment iframes and use the first one
    const iframes = this.page.locator('iframe[title*="payment"]');
    const iframeCount = await iframes.count();
    
    if (iframeCount === 0) {
      throw new Error('No payment iframe found');
    }
    
    // Get the first iframe
    const firstIframe = iframes.first();
    const frame = await firstIframe.elementHandle();
    
    if (!frame) {
      throw new Error('Failed to get iframe element');
    }
    
    const paymentFrame = await frame.contentFrame();
    
    if (!paymentFrame) {
      throw new Error('Failed to get iframe content frame');
    }
    
    // Wait for each field to be ready before filling
    const cardNumberField = paymentFrame.locator('input[name="cardnumber"]');
    await cardNumberField.waitFor({ state: 'visible', timeout: 25000 });
    if (cardNumber) {
      await cardNumberField.fill(cardNumber);
    }
    
    const expiryField = paymentFrame.locator('input[name="exp-date"]');
    await expiryField.waitFor({ state: 'visible', timeout: 25000 });
    await expiryField.fill(cardInfo.expirationDate);
    
    const cvcField = paymentFrame.locator('input[name="cvc"]');
    await cvcField.waitFor({ state: 'visible', timeout: 25000 });
    await cvcField.fill(cardInfo.securityCode);
  }

  async submitAddCard() {
    await this.page.locator('button:has-text("Add Card"), button.el-button:has-text("Add Card"), button.add-card').click({ force: true });
  }

  async verifyCardAddedSuccessfully() {
    // Wait for success message to appear
    await expect(this.page.getByText('Card Added Successfully')).toBeVisible({ timeout: 30000 });
    
    // Click outside to close the success popup
    await this.closeSuccessPopup();
  }

  async closeSuccessPopup() {
    // Method 1: Click outside the popup using very small coordinates
    await this.page.locator('body').click({ position: { x: 10, y: 10 } });
    
    // Method 2: Try clicking on the backdrop/overlay if available
    try {
      await this.page.locator('.el-overlay').click({ force: true, timeout: 2000 });
    } catch (error) {
      // If backdrop not found, continue with other methods
    }
    
    // Method 3: Press Escape key to close modal (most reliable)
    await this.page.keyboard.press('Escape');
    
    // Method 4: Try clicking on the close button if available
    try {
      await this.page.locator('.el-dialog__headerbtn').click({ force: true, timeout: 2000 });
    } catch (error) {
      // If close button not found, continue
    }
    
    // Wait a bit for the popup to close completely
    await this.page.waitForTimeout(500);
  }

  async verifyDuplicateCardErrorMessage() {
    await expect(this.page.locator('#message')).toContainText('This payment method is already in use. Please use a different method.', { timeout: 30000 });
  }

  // async verifyCardErrorTypeMessage() {
  //   await expect(this.page.locator('#message')).toHaveText('Currently only credit cards are allowed.');
  // }

  // New methods for deleting specific card
  async openCardDropdownMenu(cardLastDigits: string) {
    // Click on the three-dot menu (⋮) for the specific card
    await this.page.locator(`label.el-radio:has-text(".... .... .... ${cardLastDigits}") .el-dropdown-link`).click({ force: true });
  }

  async clickDeleteFromDropdown(cardLastDigits: string) {
    // Wait for dropdown menu to appear
    await this.page.waitForTimeout(1000);
    
    // Use direct selector based on actual HTML structure
    try {
      console.log('Attempting to click Delete button with direct selector...');
      
      // Direct selector for the Delete span inside the dropdown
      const deleteButton = this.page.locator('.el-dropdown-menu__item .color-danger span:has-text("Delete")');
      await deleteButton.waitFor({ state: 'visible', timeout: 5000 });
      await deleteButton.click({ force: true });
      
      console.log('Successfully clicked Delete button');
    } catch (error) {
      console.log('Direct selector failed:', error.message);
      
      // Fallback: Try the parent li element
      try {
        console.log('Trying parent li element...');
        const deleteLi = this.page.locator('.el-dropdown-menu__item:has(.color-danger span:has-text("Delete"))');
        await deleteLi.waitFor({ state: 'visible', timeout: 3000 });
        await deleteLi.click({ force: true });
        
        console.log('Successfully clicked Delete li element');
      } catch (error2) {
        console.log('Parent li approach failed:', error2.message);
        
        // Final fallback: Use the exact structure from HTML
        try {
          console.log('Trying exact HTML structure selector...');
          const deleteDiv = this.page.locator('div.flex.font-16.font-bold.is-disabled.color-danger span:has-text("Delete")');
          await deleteDiv.waitFor({ state: 'visible', timeout: 3000 });
          await deleteDiv.click({ force: true });
          
          console.log('Successfully clicked Delete div element');
        } catch (error3) {
          console.log('All approaches failed:', error3.message);
          
          // Last resort: Click anywhere on the dropdown item containing Delete
          console.log('Last resort: clicking dropdown item...');
          await this.page.locator('.el-dropdown-menu__item:has-text("Delete")').first().click({ force: true });
        }
      }
    }
  }

  async confirmDeleteInDialog() {
    // Click Confirm button in the delete confirmation dialog
    await this.page.locator('.el-dialog .btn.btn-stop:has-text("Confirm")').click({ force: true });
  }

  async deleteSpecificCard(cardLastDigits: string) {
    // Complete flow to delete a specific card
    await this.openCardDropdownMenu(cardLastDigits);
    await this.clickDeleteFromDropdown(cardLastDigits);
    await this.confirmDeleteInDialog();
  }

  async clickSetAsDefaultFromDropdown(cardLastDigits: string) {
    const setAsDefaultButton = this.page.locator('.el-dropdown-menu__item:has-text("Set as Default")');
    await setAsDefaultButton.waitFor({ state: 'visible', timeout: 5000 });
    await setAsDefaultButton.click({ force: true });
  }

  async setCardAsDefault(cardLastDigits: string) {
    // Complete flow to set a specific card as default
    await this.openCardDropdownMenu(cardLastDigits);
    await this.clickSetAsDefaultFromDropdown(cardLastDigits);
  }

  async verifyCardSetAsDefault(cardLastDigits: string) {
    // Find the card with specific last digits and verify it has "Default" text
    const cardContainer = this.page.locator(`label.el-radio:has-text(".... .... .... ${cardLastDigits}")`);
    await expect(cardContainer.locator('span.default-text:has-text("Default")')).toBeVisible();
  }

  async verifyCardDeleted(cardLastDigits: string) {
    // Verify that the card with specific last digits is no longer visible
    await expect(this.page.locator(`text=.... .... .... ${cardLastDigits}`)).not.toBeVisible();
  }

  // New methods for adding credit by card
  async clickPayWithCard() {
    // Click on "Pay with Card" button
    await this.page.locator('text=Pay with Card').click();
  }

  async fillPaymentForm(paymentData: {
    email: string;
    cardNumber: string;
    expiration: string;
    cvc: string;
    cardholderName: string;
    country: string;
  }) {
    // Fill email field
    await this.page.locator('input[name="email"]').fill(paymentData.email);
    
    // Fill card number
    await this.page.locator('input[id="cardNumber"]').fill(paymentData.cardNumber);
    
    // Fill expiration date
    await this.page.locator('input[id="cardExpiry"]').fill(paymentData.expiration);
    
    // Fill CVC
    await this.page.locator('input[id="cardCvc"]').fill(paymentData.cvc);
    
    // Fill cardholder name
    await this.page.locator('input[id="billingName"]').fill(paymentData.cardholderName);
    
    // Select country
    await this.page.locator('select[id="billingCountry"]').selectOption(paymentData.country);
  }

  async clickPayButton() {
    // Click the Pay button to submit the payment
    await this.page.locator('button:has-text("Pay")').click();
  }

  async waitForPaymentProcessing() {
    // Wait for payment processing to complete
    await this.page.locator('text=Processing...').waitFor({ state: 'visible' });
    // Wait for processing to finish (you might need to adjust this based on actual behavior)
    await this.page.waitForTimeout(5000);
  }

  async verifyPaymentSuccess() {
    // Verify that payment was successful (adjust selectors based on actual success page)
    // This might need to be updated based on what actually appears after successful payment
    await expect(this.page.getByText('Your funds are on the way and are usually available within the minute!')).toBeVisible();
    await this.page.locator('div.button.btn-transparent:has-text("Billing")').click();
  }

  async addCreditByCard(paymentData: {
    email: string;
    cardNumber: string;
    expiration: string;
    cvc: string;
    cardholderName: string;
    country: string;
  }) {
    // Complete flow to add credit by card
    await this.clickPayWithCard();
    await this.fillPaymentForm(paymentData);
    await this.clickPayButton();
    await this.waitForPaymentProcessing();
    await this.verifyPaymentSuccess();
  }

  // Error handling methods
  async verifyPaymentError(errorMessage: string) {
    // Generic method to verify any payment error message
    await expect(this.page.locator(`text=${errorMessage}`)).toBeVisible();
  }

  // Reusable function to add a new card
  async addNewCard(cardData: {
    fullName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    postalCode: string;
    // cardNumber: string;
    expirationDate: string;
    securityCode: string;
  }, cardNumber?: string) {
    // Click on "Add a New Card" button to open the form
    await this.clickAddNewCard();
    
    // Fill in the billing address information
    await this.fillBillingAddress({
      fullName: cardData.fullName,
      addressLine1: cardData.addressLine1,
      addressLine2: cardData.addressLine2,
      city: cardData.city,
      postalCode: cardData.postalCode
    });
    
    // Fill in the credit card information
    await this.fillCreditCardInfo({
      expirationDate: cardData.expirationDate,
      securityCode: cardData.securityCode
    }, cardNumber);
    
    // Submit the form by clicking "Add Card" button
    await this.submitAddCard();
    
    // // Wait for success message and close popup
    // await this.verifyCardAddedSuccessfully();
  }

  /**
   * Verify error message is displayed for declined cards
   * Uses #message id selector to avoid strict mode violation
   */
  async verifyDeclinedCardError(expectedError: string) {
    // Use #message id selector to target the specific error element
    await expect(this.page.locator('#message')).toContainText(expectedError, { timeout: 30000 });
  }

  /**
   * Verify specific error messages for different decline types
   */
  async verifyInsufficientFundsError() {
    return await this.verifyDeclinedCardError('Payment validation failed. Your card has insufficient funds.');
  }

  async verifyGenericDeclineError() {
    return await this.verifyDeclinedCardError('Payment validation failed. Your card was declined.');
  }

  async verifyExpiredCardError() {
    return await this.verifyDeclinedCardError('Payment validation failed. Your card has expired.');
  }

  async verifyIncorrectCVCError() {
    return await this.verifyDeclinedCardError('Payment validation failed. Your card\'s security code is incorrect.');
  }

  async verifyProcessingError() {
    return await this.verifyDeclinedCardError('Payment validation failed. An error occurred while processing your card. Try again in a little bit.');
  }

  async verifyIncorrectNumberError() {
    return await this.verifyDeclinedCardError('Your card number is incorrect.');
  }
} 