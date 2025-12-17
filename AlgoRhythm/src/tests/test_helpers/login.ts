import { type Page, expect } from '@playwright/test';

export const login = async (page: Page, email = "john.doe@algorhythm.dev", password = "Student123!") => {
    if (page.url() !== "/login") {
        await page.goto("/login");
    }


    const EMAIL_PLACEHOLDER = "your@email.com";
    const PASSWORD_PLACEHOLDER = "••••••••";
    const LOGIN_BUTTON_NAME = "Login";

    const emailInput = page.getByPlaceholder(EMAIL_PLACEHOLDER);
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    await emailInput.fill(email);
    await page.getByPlaceholder(PASSWORD_PLACEHOLDER).fill(password);

    const loginBtn = page.getByRole("button", { name: LOGIN_BUTTON_NAME });

    await Promise.all([
        page.waitForResponse(resp => resp.url().includes('/api/Authentication/login') && resp.status() === 200),
        loginBtn.click(),
    ]);

    await page.waitForURL("**/", { timeout: 10000 });

    await expect(async () => {
        const isAuth = await page.evaluate(() => localStorage.getItem("isAuthenticated"));
        expect(isAuth).toBe("true");
    }).toPass();
};
