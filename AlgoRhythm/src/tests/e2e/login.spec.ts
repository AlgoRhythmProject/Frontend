import { expect, test } from "@playwright/test";

const EMAIL_PLACEHOLDER = "your@email.com";
const PASSWORD_PLACEHOLDER = "••••••••";
const ERROR_SELECTOR = ".text-error";
const LOGIN_BUTTON_NAME = "Login";

test.beforeEach(async ({ page }) => {
    await page.route("**/accounts.google.com/gsi/client", route => route.abort());
    await page.goto("/login");
});

test("unsuccessful login with invalid credentials", async ({ page }) => {
    const emailInput = page.getByPlaceholder(EMAIL_PLACEHOLDER);
    await expect(emailInput).toBeVisible({ timeout: 10000 });

    await emailInput.fill("john.doe@algorhythm.dev");
    await page.getByPlaceholder(PASSWORD_PLACEHOLDER).fill("SOME_PASSWORD!");

    const loginBtn = page.locator("form").getByRole("button", { name: LOGIN_BUTTON_NAME });
    await loginBtn.click();

    await expect(page.locator(ERROR_SELECTOR))
        .toBeVisible();

    const isAuth = await page.evaluate(() =>
        localStorage.getItem("isAuthenticated")
    );
    expect(isAuth).toBeFalsy();

    await expect(page).toHaveURL(/\/login$/);
});


test("should disable the button during loading (mocked slow API)", async ({ page }) => {
    await page.route("**/api/Authentication/login", async (route) => {
        await new Promise((r) => setTimeout(r, 2000));
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                token: "fake-jwt-token",
                user: { id: 1, email: "test@example.com" }
            }),
        });
    });

    await page.getByPlaceholder(EMAIL_PLACEHOLDER).fill("test@example.com");
    await page.getByPlaceholder(PASSWORD_PLACEHOLDER).fill("password123");

    const loginBtn = page.locator('form').getByRole("button", { name: LOGIN_BUTTON_NAME });
    await loginBtn.click();

    await expect(loginBtn).toBeDisabled();
});

test("should show invalid credentials message on API 401 and keep button enabled", async ({ page }) => {
    await page.route("**/api/Authentication/login", async (route) => {
        await route.fulfill({
            status: 401,
            contentType: "application/json",
            body: JSON.stringify({ message: "Invalid credentials" }),
        });
    });

    await page.getByPlaceholder(EMAIL_PLACEHOLDER).fill("user@fail.com");
    await page.getByPlaceholder(PASSWORD_PLACEHOLDER).fill("wrongpassword");

    const loginBtn = page.locator('form').getByRole("button", { name: LOGIN_BUTTON_NAME });
    await loginBtn.click();

    await expect(loginBtn).not.toBeDisabled({ timeout: 5000 });
    await expect(page.locator(ERROR_SELECTOR))
        .toHaveText("Invalid credentials");
    await expect(page).toHaveURL(/\/login$/);
});
