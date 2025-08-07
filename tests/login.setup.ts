import { Page } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ENDPOINTS } from "../constants/endpoints";
import { expect, test as setup } from "@playwright/test";

// Load credentials and login

setup("login", async ({ page }: { page: Page }) => {
    const loginPage = new LoginPage(page);
    const creds = require('../fixtures/credential.json');
    await loginPage.visit();
    await loginPage.login(creds.valid.email, creds.valid.password);
    await loginPage.isLoggedIn(creds.valid.username);
    await expect(page).toHaveURL(new RegExp(ENDPOINTS.SERVERLESS));
    await page.context().storageState({ path: '.auth/login.json' });
}) 