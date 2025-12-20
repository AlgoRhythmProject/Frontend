import { test, expect } from "@playwright/test";

// --- Stałe tekstowe (zgodne z propsami w Register.tsx) ---
const FIRST_NAME_LABEL = "First Name";
const LAST_NAME_LABEL = "Last Name";
const EMAIL_LABEL = "Email";
const PASSWORD_LABEL = "Password";
const CONFIRM_PASSWORD_LABEL = "Confirm Password";

const HEADER_TITLE = "Create Account";
const HEADER_SUBTITLE = "Start learning algorithms today";
const REGISTER_BTN_NAME = "Register";
const LOGIN_LINK_TEXT = "Log in";
const FOOTER_TEXT = "Your place to learn algorithms and data structures";

// Selektor klasy Tailwind użytej w komponencie (text-error)
const ERROR_SELECTOR = ".text-error";

test.beforeEach(async ({ page }) => {
    await page.goto("/register");
});

test.describe("Register Component Tests", () => {

    // --- Test 1: Renderowanie UI ---
    test("should render registration form with all elements correctly", async ({ page }) => {
        // Nagłówek i podtytuł
        await expect(page.getByRole("heading", { name: HEADER_TITLE })).toBeVisible();
        await expect(page.getByText(HEADER_SUBTITLE)).toBeVisible();

        // Pola formularza
        await expect(page.locator('label', { hasText: FIRST_NAME_LABEL})).toBeVisible();
        await expect(page.locator('label', { hasText: LAST_NAME_LABEL })).toBeVisible();
        await expect(page.locator('label', { hasText: EMAIL_LABEL })).toBeVisible();
        await expect(page.locator('label', { hasText: PASSWORD_LABEL, hasNotText : CONFIRM_PASSWORD_LABEL })).toBeVisible();
        await expect(page.locator('label', { hasText: CONFIRM_PASSWORD_LABEL })).toBeVisible();

        // Przycisk i stopka
        await expect(page.getByRole("button", { name: REGISTER_BTN_NAME })).toBeVisible();
        await expect(page.getByText("Already have an account?")).toBeVisible();
        await expect(page.getByRole("button", { name: LOGIN_LINK_TEXT })).toBeVisible();

        await expect(page.getByText(FOOTER_TEXT)).toBeVisible();
    });


    // --- Test 2: Walidacja Haseł (Niezgodność) ---
    test("should show error when passwords do not match", async ({ page }) => {
        // Znajdź label, potem najbliższy input
        await page.locator('label:has-text("Last Name")').locator('..').locator('input').fill("Doe");
        await page.locator('label:has-text("First Name")').locator('..').locator('input').fill("Doe");
        await page.locator('input[type="password"]').first().fill("password123");
        await page.locator('input[type="password"]').nth(1).fill("password321");
        await page.locator('label:has-text("Email")').locator('..').locator('input').fill("test@example.com");
        await page.getByRole("button", { name: REGISTER_BTN_NAME }).click();

        // Sprawdzamy komunikat błędu
        const errorMsg = page.locator(ERROR_SELECTOR);
        await expect(errorMsg).toBeVisible();
        await expect(errorMsg).toHaveText("Passwords do not match");
    });

    // --- Test 3: Stan ładowania (Loading State) ---
    test("should disable button during API call", async ({ page }) => {
        // Mockujemy API z opóźnieniem, żeby zdążyć sprawdzić stan disabled
        await page.route("**/api/Authentication/register", async (route) => {
            await new Promise(r => setTimeout(r, 2000)); // 2s opóźnienia
            await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
        });

        // Wypełniamy formularz poprawnymi danymi
        await page.locator('label:has-text("Last Name")').locator('..').locator('input').fill("Doe");
        await page.locator('label:has-text("First Name")').locator('..').locator('input').fill("Doe");
        await page.locator('input[type="password"]').first().fill("password123");
        await page.locator('input[type="password"]').nth(1).fill("password123");
        await page.locator('label:has-text("Email")').locator('..').locator('input').fill("test@example.com");

        const btn = page.getByRole("button", { name: REGISTER_BTN_NAME });

        await btn.click();

        await expect(btn).toBeDisabled({timeout: 2000});
    });

    // --- Test 4: Obsługa błędu API (Generic Error) ---
    test("should show generic error message on API failure", async ({ page }) => {
        // Mockujemy błąd 500
        await page.route("**/api/authentication/register", async (route) => {
            await route.fulfill({
                status: 500,
                contentType: "application/json",
                body: JSON.stringify({ message: "Internal Error" }),
            });
        });

        await page.locator('label:has-text("Last Name")').locator('..').locator('input').fill("Doe");
        await page.locator('label:has-text("First Name")').locator('..').locator('input').fill("Doe");
        await page.locator('input[type="password"]').first().fill("password123");
        await page.locator('input[type="password"]').nth(1).fill("password123");
        await page.locator('label:has-text("Email")').locator('..').locator('input').fill("test@example.com");
        await page.getByRole("button", { name: REGISTER_BTN_NAME }).click();

        await page.getByRole("button", { name: REGISTER_BTN_NAME }).click();

        // Oczekujemy komunikatu zdefiniowanego w bloku catch/else komponentu
        const errorMsg = page.locator(ERROR_SELECTOR);
        await expect(errorMsg).toBeVisible();
        await expect(errorMsg).toHaveText("Registration failed. Please try again.");
    });

    // --- Test 5: Sukces i Przekierowanie (Happy Path) ---
    test("should register successfully and redirect to verify-email page", async ({ page }) => {
        const testEmail = "test@example.com";

        // Mockujemy sukces (zwracamy obiekt, aby warunek `if (response)` był true)
        await page.route("**/api/Authentication/register", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ id: 123, email: testEmail }),
            });
        });

        // Wypełniamy pełny formularz
        await page.locator('label:has-text("Last Name")').locator('..').locator('input').fill("Doe");
        await page.locator('label:has-text("First Name")').locator('..').locator('input').fill("Doe");
        await page.locator('input[type="password"]').first().fill("someStr0!ngPassword");
        await page.locator('input[type="password"]').nth(1).fill("someStr0!ngPassword");
        await page.locator('label:has-text("Email")').locator('..').locator('input').fill(testEmail);
        await page.getByRole("button", { name: REGISTER_BTN_NAME }).click();

        await expect(page).toHaveURL(/\/verify-email\?email=/, { timeout: 5000 });    });
});