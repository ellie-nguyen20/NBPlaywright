import { test } from '../../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { BillingPage } from '../../../pages/BillingPage';
import { ENDPOINTS } from '../../../constants/endpoints';

test.describe('Billing Page, Mastercard', () => {
  let billingPage: BillingPage;
  const testData = {
      fullName: 'Ellie nguyen',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'HCM',
      postalCode: '90000',
      expirationDate: '0327',
      securityCode: '111'
  }
  const cards = {
    mastercard: '5555555555554444',
    mastercard2Series: '2223003122003222',
    mastercardDebit: '5200828282828210',
    mastercardPrepaid: '5105105105105100',
  }

  test.beforeAll(async ({ browser }) => {
    test.setTimeout(60000); // Set 1 minute timeout for beforeAll
    // Create a new context for cleanup
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      // Navigate to billing page first
      const billingPage = new BillingPage(page);
      await billingPage.navigateTo();
      await page.waitForTimeout(2000); // Wait for page to load
      
      // Clean up test cards before all tests
      const token = await page.evaluate(() => 
        localStorage.getItem('nebulablock_newlook_token')
      );
    
      console.log('=== BEFORE ALL CLEANUP (MASTERCARD) ===');
      console.log('JWT Token:', token ? token.substring(0, 50) + '...' : 'No token found');
      
      if (!token) {
        console.log('No JWT token found in localStorage');
        return;
      }
      
      const getPaymentMethods = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', getPaymentMethods.status());
      
      const paymentJson = await getPaymentMethods.json();
      
      if (getPaymentMethods.status() !== 200 || !paymentJson.data) {
        console.log('API call failed or no data returned. Status:', getPaymentMethods.status());
        return;
      }
      
      // Find Mastercard cards with last4 digits that need to be deleted
      const cardsToDelete = paymentJson.data.filter((card: any) => 
        card.last4 === '4444' || card.last4 === '3222' || card.last4 === '8210' || card.last4 === '5100'
      );
      
      console.log('Mastercard cards to delete:', cardsToDelete);
      
      // Delete each found card using stripe_id
      for (const card of cardsToDelete) {
        const deleteResponse = await context.request.post('https://dev-portal-api.nebulablock.com/api/v1/payment/delete', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            payment_method_id: card.stripe_id
          }
        });
        console.log(`🗑️ Deleted Mastercard ${card.last4}, status:`, deleteResponse.status());
      }
      
      console.log('=== BEFORE ALL CLEANUP COMPLETED (MASTERCARD) ===');
    } catch (error) {
      console.log('Error in beforeAll cleanup:', error);
    } finally {
      await context.close();
    }
  });

  test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);
    await billingPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.BILLING), {timeout: 60000});
  });

  test.afterAll(async ({ browser }) => {
    test.setTimeout(60000); // Set 1 minute timeout for afterAll
    // Create a new context for final cleanup
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      // Navigate to billing page first
      const billingPage = new BillingPage(page);
      await billingPage.navigateTo();
      await page.waitForTimeout(2000); // Wait for page to load
      
      // Final cleanup after all tests
      const token = await page.evaluate(() => 
        localStorage.getItem('nebulablock_newlook_token')
      );
    
      console.log('=== AFTER ALL CLEANUP (MASTERCARD) ===');
      console.log('JWT Token:', token ? token.substring(0, 50) + '...' : 'No token found');
      
      if (!token) {
        console.log('No JWT token found in localStorage');
        return;
      }
      
      const getPaymentMethods = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', getPaymentMethods.status());
      
      const paymentJson = await getPaymentMethods.json();
      
      if (getPaymentMethods.status() !== 200 || !paymentJson.data) {
        console.log('API call failed or no data returned. Status:', getPaymentMethods.status());
        return;
      }
      
      // Find Mastercard cards with last4 digits that need to be deleted
      const cardsToDelete = paymentJson.data.filter((card: any) => 
        card.last4 === '4444' || card.last4 === '3222' || card.last4 === '8210' || card.last4 === '5100'
      );
      
      console.log('🧹 Final cleanup - Mastercard cards to delete:', cardsToDelete);
      console.log('📊 Total cards found before final cleanup:', paymentJson.data.length);
      
      // Delete each found card using stripe_id
      for (const card of cardsToDelete) {
        console.log(`🗑️ Final cleanup - Attempting to delete Mastercard ${card.last4} with ID: ${card.stripe_id}`);
        const deleteResponse = await context.request.post('https://dev-portal-api.nebulablock.com/api/v1/payment/delete', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            payment_method_id: card.stripe_id
          }
        });
        console.log(`✅ Final cleanup - Deleted Mastercard ${card.last4}, status:`, deleteResponse.status());
      }
      
      // Final verification - check if cards still exist
      console.log('🔍 Final verification...');
      const finalCheck = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const finalData = await finalCheck.json();
      const remainingTestCards = finalData.data?.filter((card: any) => 
        card.last4 === '4444' || card.last4 === '3222' || card.last4 === '8210' || card.last4 === '5100'
      ) || [];
      
      console.log('📊 Total cards after final cleanup:', finalData.data?.length || 0);
      console.log('🚨 Remaining Mastercard test cards:', remainingTestCards);
      
      if (remainingTestCards.length > 0) {
        console.log('⚠️ WARNING: Some Mastercard test cards were not deleted in final cleanup!');
      } else {
        console.log('✅ All Mastercard test cards successfully cleaned up in final cleanup!');
      }
      
      console.log('=== AFTER ALL CLEANUP COMPLETED (MASTERCARD) ===');
    } catch (error) {
      console.log('Error in afterAll cleanup:', error);
    } finally {
      await context.close();
    }
  });

  test('should accept Mastercard - 5555555555554444', async () => {
    test.setTimeout(90000);
    await billingPage.addNewCard(testData, cards.mastercard);
    await billingPage.verifyCardAddedSuccessfully();
  });

  test('should accept Mastercard (2-series) - 2223003122003222', async () => {
    test.setTimeout(90000);
    await billingPage.addNewCard(testData, cards.mastercard2Series);
    await billingPage.verifyCardAddedSuccessfully();
  });

  test('should accept Mastercard debit - 5200828282828210', async () => {
    test.setTimeout(90000);
    await billingPage.addNewCard(testData, cards.mastercardDebit);
    await billingPage.verifyCardAddedSuccessfully();
  });

  test('should accept Mastercard (prepaid) - 5105105105105100', async () => {
    test.setTimeout(90000);
    await billingPage.addNewCard(testData, cards.mastercardPrepaid);
    await billingPage.verifyCardAddedSuccessfully();
  });

});
