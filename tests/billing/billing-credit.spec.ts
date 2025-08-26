import { test, expect} from '@playwright/test';
import { BillingPage } from '../../pages/BillingPage';
import { ENDPOINTS } from '../../constants/endpoints';
import { loginAndGetToken } from '../../utils/auth';
import { PAYMENT_TEST_DATA } from '../../utils/testData';

test.describe('Billing Page, Add credit by card', () => {
  let billingPage: BillingPage;
  const testData = {
    address: {
      fullName: 'Ellie nguyen',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'HCM',
      postalCode: '90000'
    },
    cards: {
      first: '378282246310005',
      second: '5200828282828210',
      third: '6011000990139424'
    },
    cardDetails: {
      expirationDate: '0327',
      securityCode: '111'
    }
  }

  test.beforeEach(async ({ page }) => {
    billingPage = new BillingPage(page);

    await billingPage.navigateTo();
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.BILLING));
  });
  test.afterEach(async ({ context, page }) => {
    try {
      const token = await page.evaluate(() => 
        localStorage.getItem('nebulablock_newlook_token')
      );
    
      console.log('=== DEBUG AUTH ===');
      console.log('JWT Token:', token ? token.substring(0, 50) + '...' : 'No token found');
      console.log('==================');
      
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
      console.log('Response headers:', getPaymentMethods.headers());
      
      // Debug response body
      const responseText = await getPaymentMethods.text();
      console.log('=== RESPONSE BODY ===');
      console.log('Response body (first 500 chars):', responseText.substring(0, 500));
      console.log('Response body length:', responseText.length);
      console.log('=====================');
      
      // const paymentMethods = await getPaymentMethods.json();
      console.log('Payment methods:', getPaymentMethods);
      
      // Parse response JSON once and store it
      const paymentJson = await getPaymentMethods.json();
      console.log('Payment methods:', paymentJson);
      
      // Check if response is successful and has data
      if (getPaymentMethods.status() !== 200 || !paymentJson.data) {
        console.log('API call failed or no data returned. Status:', getPaymentMethods.status());
        console.log('Response:', paymentJson);
        return; // Exit early if API failed
      }
      
      // Find cards with last4 digits that need to be deleted
      const cardsToDelete = paymentJson.data.filter((card: any) => 
        card.last4 === '9424' || card.last4 === '0005'
      );
      
      console.log('Cards to delete:', cardsToDelete);
      
      // Delete each found card using stripe_id
      for (const card of cardsToDelete) {
        console.log(card.stripe_id);
        const deleteResponse = await context.request.post('https://dev-portal-api.nebulablock.com/api/v1/payment/delete', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            payment_method_id: card.stripe_id
          }
        });
        console.log(card.stripe_id);
        console.log(`Deleted card ${card.last4}, status:`, deleteResponse.status());
      }
    } catch (error) {
      console.log('Error in afterEach:', error);
      console.log('This might be due to authentication or API endpoint issues');
    }
  });

  // test.afterEach(async ({ context }) => {
  //   try {
  //     // context.request sẽ tự động có authentication state từ .auth/login.json
  //     const getPaymentMethods = await context.request.get('/api/v1/payment/payment-methods');
      
  //     console.log('=== DEBUG REQUEST ===');
  //     console.log('Response status:', getPaymentMethods.status());
  //     console.log('Response headers:', getPaymentMethods.headers());
  //     console.log('=====================');
      
  //     // Check if response is JSON before parsing
  //     const contentType = getPaymentMethods.headers()['content-type'];
  //     if (!contentType || !contentType.includes('application/json')) {
  //       console.log('Response is not JSON. Content-Type:', contentType);
  //       const responseText = await getPaymentMethods.text();
  //       console.log('Response body (first 200 chars):', responseText.substring(0, 200));
  //       return;
  //     }
  
  //     const paymentJson = await getPaymentMethods.json();
  //     console.log('Payment methods:', paymentJson);
  
  //     // Find cards with last4 digits that need to be deleted
  //     const cardsToDelete = paymentJson.data.filter((card: any) =>
  //       card.last4 === '9424' || card.last4 === '0005'
  //     );
  
  //     console.log('Cards to delete:', cardsToDelete);
  
  //     // Delete each found card using stripe_id
  //     for (const card of cardsToDelete) {
  //       const deleteResponse = await context.request.post('/api/v1/payment/delete', {
  //         params: { payment_method_id: card.stripe_id },
  //       });
  //       console.log(`Deleted card ${card.last4}, status:`, deleteResponse.status());
  //     }
  //   } catch (error) {
  //     console.log('Error in afterEach:', error);
  //     console.log('This might be due to authentication or API endpoint issues');
  //   }
  // });
  
  // test.afterEach(async ({ context }) => {
  //   try {
  //     // Gọi API lấy payment methods
  //     const res = await context.request.get(
  //       'https://dev-portal-api.nebulablock.com/api/v1/payment/payment-methods'
  //     );
  
  //     console.log('Response status:', res.status());
  
  //     if (res.status() !== 200) {
  //       console.log('❌ API call failed. Status:', res.status());
  //       console.log('Response text:', await res.text());
  //       return;
  //     }
  
  //     // Parse JSON
  //     const paymentJson = await res.json();
  //     console.log('Payment methods JSON:', paymentJson);
  
  //     if (!paymentJson?.data || !Array.isArray(paymentJson.data)) {
  //       console.log('⚠️ No data array in response');
  //       return;
  //     }
  
  //     // Chọn các card cần xoá theo last4
  //     const cardsToDelete = paymentJson.data.filter(
  //       (card: any) => card.last4 === '9424' || card.last4 === '0005'
  //     );
  
  //     console.log('Cards to delete:', cardsToDelete);
  
  //     // Xoá từng card bằng stripe_id
  //     for (const card of cardsToDelete) {
  //       const delRes = await context.request.post(
  //         'https://dev-portal-api.nebulablock.com/api/v1/payment/delete',
  //         {
  //           params: { payment_method_id: card.stripe_id },
  //         }
  //       );
  //       console.log(
  //         `🗑️ Deleted card ${card.last4}, status: ${delRes.status()}`
  //       );
  //     }
  //   } catch (err) {
  //     console.log('Error in afterEach:', err);
  //     console.log(
  //       '👉 Có thể do auth token hết hạn hoặc API endpoint bị lỗi.'
  //     );
  //   }
  // });


  test('should add payment method successfully', async () => {
    test.setTimeout(120000);
    
    // Use the reusable function to add a new card
    await billingPage.addNewCard({
      fullName: testData.address.fullName,
      addressLine1: testData.address.addressLine1,
      addressLine2: testData.address.addressLine2,
      city: testData.address.city,
      postalCode: testData.address.postalCode,
      cardNumber: testData.cards.first,
      expirationDate: testData.cardDetails.expirationDate,
      securityCode: testData.cardDetails.securityCode
    });
    
    // Card is automatically verified and popup is closed in addNewCard method
  });

  test('should not allow adding duplicate card', async () => {
    test.setTimeout(120000);
    
    // Use the reusable function to add a duplicate card
    await billingPage.addNewCard({
      fullName: testData.address.fullName,
      addressLine1: testData.address.addressLine1,
      addressLine2: testData.address.addressLine2,
      city: testData.address.city,
      postalCode: testData.address.postalCode,
      cardNumber: testData.cards.second,
      expirationDate: testData.cardDetails.expirationDate,
      securityCode: testData.cardDetails.securityCode
    });
    
    // Verify the card was not added successfully
    await billingPage.verifyCardErrorMessage();
  });


  test('should delete specific card by last 4 digits successfully', async () => {
    test.setTimeout(60000);
    await billingPage.addNewCard({
      fullName: testData.address.fullName,
      addressLine1: testData.address.addressLine1,
      addressLine2: testData.address.addressLine2,
      city: testData.address.city,
      postalCode: testData.address.postalCode,
      cardNumber: testData.cards.third,
      expirationDate: testData.cardDetails.expirationDate,
      securityCode: testData.cardDetails.securityCode
    });
    // Card is automatically verified and popup is closed in addNewCard metho
    // Delete the card ending with 0005
    await billingPage.deleteSpecificCard('9424');
    
    // Verify the card was deleted successfully
    await billingPage.verifyCardDeleted('9424');
  });



  test('should add credit by card successfully', async () => {
    test.setTimeout(120000); // 2 minutes timeout for payment processing
    
    // Use test data for payment
    const paymentData = PAYMENT_TEST_DATA.validCard;

    // Add credit by card using the complete flow
    await billingPage.addCreditByCard(paymentData);

  });



  test.skip('should not allow adding credit in currencies other than USD', async ({ request }) => {
    const creds = require('../fixtures/credential.json');
    const token = await loginAndGetToken(request, creds.valid.email, creds.valid.password); 

    // await billingPage.clickAddCredits();
    // await billingPage.selectCurrency('EUR');
    // await expect(page.locator('text=Please select a valid currency')).toBeVisible();
  });

  test.skip('should add credit by crypto successfully', async () => {

  });


});