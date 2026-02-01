import { test, expect } from "@playwright/test";

const EMAIL_PLACEHOLDER = "your@email.com";
const PASSWORD_PLACEHOLDER = "••••••••";
const ERROR_SELECTOR = ".text-error";
const LOGIN_BUTTON_NAME = "Login";
const HEADER_TEXT = "AlgoRhythm";
const FOOTER_PROMPT = "Don't have an account?";
const SIGNUP_TEXT = "Sign up";

test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder(EMAIL_PLACEHOLDER).waitFor({ state: "visible" });
    await page.getByPlaceholder(PASSWORD_PLACEHOLDER).waitFor({ state: "visible" });
});

test.describe("Login component - adapted tests", () => {
    test("renders login form correctly", async ({ page }) => {
        await expect(page.getByRole("heading", { name: HEADER_TEXT })).toBeVisible();

        await expect(page.locator('label', { hasText: "Email" })).toBeVisible();
        await expect(page.locator('label', { hasText: "Password" })).toBeVisible();

        await expect(page.getByPlaceholder(EMAIL_PLACEHOLDER)).toBeVisible();
        await expect(page.getByPlaceholder(PASSWORD_PLACEHOLDER)).toBeVisible();

        const loginBtn = page.getByRole("button", { name: LOGIN_BUTTON_NAME });
        await expect(loginBtn).toBeVisible();

        await expect(page.getByText(FOOTER_PROMPT)).toBeVisible();
        await expect(page.getByText(SIGNUP_TEXT)).toBeVisible();

        await expect(
            page.getByText("Your place to learn algorithms and data structures")
        ).toBeVisible();
    });
    test("should disable the button during loading (mocked slow API)", async ({ page }) => {
        await page.route("**/api/Authentication/login", async (route) => {
            await new Promise((r) => setTimeout(r, 2000));
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ token: "fake-jwt-token", user: { id: 1, email: "test@example.com" } }),
            });
        });

        await page.getByPlaceholder(EMAIL_PLACEHOLDER).fill("test@example.com");
        await page.getByPlaceholder(PASSWORD_PLACEHOLDER).fill("password123");

        const loginBtn = page.getByRole("button", { name: LOGIN_BUTTON_NAME });

        const [response] = await Promise.all([
            page.waitForResponse("**/api/Authentication/login"),
            loginBtn.click(),
        ]);

        await page.waitForFunction(() => {
            const btn = document.querySelector('button[type="submit"]');
            return btn?.hasAttribute('disabled');
        });

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

        const loginBtn = page.getByRole("button", { name: LOGIN_BUTTON_NAME });
        await loginBtn.click();

        await expect(loginBtn).not.toBeDisabled({ timeout: 5000 });

        await expect(page.locator(ERROR_SELECTOR))
            .toHaveText("Invalid credentials");

        await expect(page).toHaveURL(/\/login$/);
    });



    // test("successful login stores localStorage and navigates to home", async ({ page }) => {
    //     await page.route("**/api/Authentication/login", async (route) => {
    //         await route.fulfill({
    //             status: 200,
    //             contentType: "application/json",
    //             body: JSON.stringify({
    //                 token: "fake-jwt-token",
    //                 user: { id: 1, email: "success@user.com" },
    //             }),
    //         });
    //     });

    //     await page.getByPlaceholder(EMAIL_PLACEHOLDER).fill("success@user.com");
    //     await page.getByPlaceholder(PASSWORD_PLACEHOLDER).fill("correctpassword");

    //     const loginBtn = page.getByRole("button", { name: LOGIN_BUTTON_NAME });
    //     await loginBtn.click();

    //     await page.waitForURL("**/", { timeout: 5000 });

    //     const isAuth = await page.evaluate(() =>
    //         localStorage.getItem("isAuthenticated")
    //     );
    //     expect(isAuth).toBe("true");
    // });

    test("clicking Sign up triggers navigation to /register", async ({ page }) => {
        await page.getByText(SIGNUP_TEXT).click();
        await expect(page).toHaveURL(/\/register$/);
    });

    test("input types are correct", async ({ page }) => {
        await expect(page.getByPlaceholder(EMAIL_PLACEHOLDER)).toHaveAttribute("type", "email");
        await expect(page.getByPlaceholder(PASSWORD_PLACEHOLDER)).toHaveAttribute("type", "password");
    });
});
