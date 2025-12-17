import {expect, test} from "@playwright/test";

const EMAIL_PLACEHOLDER = "your@email.com";
const PASSWORD_PLACEHOLDER = "••••••••";
//const ERROR_SELECTOR = ".text-error";
const LOGIN_BUTTON_NAME = "Login";
//const HEADER_TEXT = "AlgoRhythm";
//const FOOTER_PROMPT = "Don’t have an account?";
//const SIGNUP_TEXT = "Sign up";

test.beforeEach(async ({ page }) => {
    await page.goto("/login");
});

test.describe("Login E2E", () => {

    test("successful login with real backend", async ({ page }) => {

        const emailInput = page.getByPlaceholder(EMAIL_PLACEHOLDER);
        await expect(emailInput).toBeVisible({ timeout: 10000 });

        await emailInput.fill("john.doe@algorhythm.dev");
        await page.getByPlaceholder(PASSWORD_PLACEHOLDER).fill("Student123!");

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
    });
});