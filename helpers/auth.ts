/**
 * Authentication helper functions
 */
import { Page } from '@playwright/test';

export async function loginByApi(page: Page, email: string, password: string) {
  // Mock login API call
  await page.route('**/api/v1/auth/login', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          user: {
            id: 123,
            name: 'Test User',
            email: email,
            username: 'testuser'
          },
          token: 'mock-jwt-token'
        },
        message: 'Login successful',
        status: 'success'
      })
    });
  });

  // Mock user info API call
  await page.route('**/api/v1/user/info', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          id: 123,
          name: 'Test User',
          email: email,
          username: 'testuser'
        },
        message: 'User info retrieved successfully',
        status: 'success'
      })
    });
  });

  // Set cookies to simulate logged in state
  await page.context().addCookies([
    {
      name: 'auth_token',
      value: 'mock-jwt-token',
      domain: 'dev-portal.nebulablock.com',
      path: '/'
    }
  ]);
} 