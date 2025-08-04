// tests/api/auth.ts
import { APIRequestContext, Page } from '@playwright/test';

const BASE_URL = 'https://dev-portal-api.nebulablock.com';

export async function loginAndGetToken(request: APIRequestContext, username: string, password: string): Promise<string> {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const res = await request.post(`${BASE_URL}/api/v1/login`, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json, text/plain, */*',
    },
    data: formData.toString(),
  });

  if (res.status() !== 200) throw new Error('Login failed');
  const body = await res.json();
  return body.data.jwtToken;
}

export async function loginByApiAndSetLocalStorage(page: Page, token: string) {
  await page.goto('/');
  await page.evaluate((token) => {
    localStorage.setItem('nebulablock_newlook_token', token);
  }, token);
}
