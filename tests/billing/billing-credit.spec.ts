import { test } from '../../fixtures/testFixtures';
import { expect } from '@playwright/test';
import { BillingPage } from '../../pages/BillingPage';
import { ENDPOINTS } from '../../constants/endpoints';
import { loginAndGetToken } from '../../utils/auth';
import { PAYMENT_TEST_DATA } from '../../utils/testData';

test.describe('Billing Page, Add credit by card', () => {
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
  const  cards = {
    first: '371449635398431',
    second: '5200828282828210',
    third: '6011000990139424'
  }

  test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);
    await expect(async () => {
      await billingPage.navigateTo();
      await expect(page).toHaveURL(new RegExp(ENDPOINTS.BILLING));
    }).toPass({timeout: 20000});
  });
  // test.afterEach(async ({ context, page }) => {
  //   try {
  //     const token = await page.evaluate(() => 
  //       localStorage.getItem('nebulablock_newlook_token')
  //     );
    
  //     console.log('=== DEBUG AUTH ===');
  //     console.log('JWT Token:', token ? token.substring(0, 50) + '...' : 'No token found');
  //     console.log('==================');
      
  //     if (!token) {
  //       console.log('No JWT token found in localStorage');
  //       return;
  //     }
      
  //     const getPaymentMethods = await context.request.get('https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });
      
  //     console.log('Response status:', getPaymentMethods.status());
  //     console.log('Response headers:', getPaymentMethods.headers());
      
  //     // Debug response body
  //     const responseText = await getPaymentMethods.text();
  //     console.log('=== RESPONSE BODY ===');
  //     console.log('Response body (first 500 chars):', responseText.substring(0, 500));
  //     console.log('Response body length:', responseText.length);
  //     console.log('=====================');
      
  //     // const paymentMethods = await getPaymentMethods.json();
  //     console.log('Payment methods:', getPaymentMethods);
      
  //     // Parse response JSON once and store it
  //     const paymentJson = await getPaymentMethods.json();
  //     console.log('Payment methods:', paymentJson);
      
  //     // Check if response is successful and has data
  //     if (getPaymentMethods.status() !== 200 || !paymentJson.data) {
  //       console.log('API call failed or no data returned. Status:', getPaymentMethods.status());
  //       console.log('Response:', paymentJson);
  //       return; // Exit early if API failed
  //     }
      
  //     // Find cards with last4 digits that need to be deleted
  //     const cardsToDelete = paymentJson.data.filter((card: any) => 
  //       card.last4 === '9424' || card.last4 === '8431'
  //     );
      
  //     console.log('Cards to delete:', cardsToDelete);
      
  //     // Delete each found card using stripe_id
  //     for (const card of cardsToDelete) {
  //       console.log(card.stripe_id);
  //       const deleteResponse = await context.request.post('https://dev-portal-api.nebulablock.com/api/v1/payment/delete', {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json'
  //         },
  //         params: {
  //           payment_method_id: card.stripe_id
  //         }
  //       });
  //       console.log(card.stripe_id);
  //       console.log(`Deleted card ${card.last4}, status:`, deleteResponse.status());
  //     }
  //   } catch (error) {
  //     console.log('Error in afterEach:', error);
  //     console.log('This might be due to authentication or API endpoint issues');
  //   }
  // });

  test('should add payment method successfully', async () => {
    test.setTimeout(120000);
    await billingPage.addNewCard(testData, cards.first);

    await billingPage.verifyCardAddedSuccessfully();
  });

  test('should not allow adding duplicate card', async () => {
    test.setTimeout(120000);
    await billingPage.addNewCard(testData, cards.second);
    await billingPage.verifyCardErrorMessage();
  });

  test('should only accept credit card', async () => {
    test.setTimeout(60000);
    await billingPage.addNewCard(testData, cards.second);
    await billingPage.verifyCardErrorTypeMessage();
  });

  test('should delete specific card by last 4 digits successfully', async () => {
    test.setTimeout(60000);
 
    await billingPage.addNewCard(testData, cards.third);
    await billingPage.verifyCardAddedSuccessfully();
    await billingPage.deleteSpecificCard('9424');
    await billingPage.verifyCardDeleted('9424');
  });

  test('should set a card as default successfully', async () => {
    // test.setTimeout(60000);
    // await billingPage.addNewCard(testData, cards.third);
    // await billingPage.verifyCardAddedSuccessfully();
    // await billingPage.setCardAsDefault('9424');
    // await billingPage.verifyCardSetAsDefault('9424');
  });

  test('should add credit by card successfully', async () => {
    test.setTimeout(60000); 
    
    // Use test data for payment
    const paymentData = PAYMENT_TEST_DATA.validCard;

    // Add credit by card using the complete flow
    await billingPage.addCreditByCard(paymentData);

  });

  test.skip('should not allow adding credit in currencies other than USD', async ({ request }) => {
    const creds = require('../fixtures/credential.json');
    const token = await loginAndGetToken(request, creds.valid.email, creds.valid.password); 
  });

  test.skip('should add credit by crypto successfully', async () => {
  });

});