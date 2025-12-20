import {test, expect} from "@playwright/test";
import {login} from "@/tests/test_helpers/login.ts";

test.describe("Correct tasks flow", () => {
    test("login then open task", async ({ page }) => {
        await test.step("login", async () => {
            await login(page, "alice@algorhythm.dev");
        });

        await test.step("go to task", async () => {
            await page.goto("/tasks");
            await expect(page.locator('text=Loading tasks & courses...')).not.toBeVisible();
            const taskLink = page.getByRole('link', { name: /Sum of two numbers/i });
            await taskLink.click();
            await expect(page).toHaveURL(/\/tasks\/\w+/);        });

        await test.step("fill the code", async () => {
            const editor = page.locator('.monaco-editor').first();
            await editor.click();
            await page.keyboard.press('Control+A');
            await page.keyboard.press('Backspace');

            const myCode = 'public class Solution { public int TwoSum(int a, int b) { return a + b; } }';
            await page.keyboard.insertText(myCode);
        });

        await test.step("should run code and display passing results", async () => {
            const runButton = page.getByRole('button', { name: /Run Code/i });
            await runButton.click();
            await expect(page.getByText(/Running\.\.\./i)).toBeVisible();
            const resultsHeader = page.locator('h3', { hasText: /Results/i });
            await expect(resultsHeader).toBeVisible({ timeout: 20000 });
            const firstTestResult = page.locator('div').filter({ hasText: /Test 1/i }).first();
            await expect(firstTestResult).toContainText('Accepted');
            const error = firstTestResult.locator('svg.text-success').first();
            await expect(error).toBeVisible();
        });
    });
});

test.describe("Incorrect tasks flow", () => {
    test("login then open task", async ({ page }) => {
        await test.step("login", async () => {
            await login(page, "alice@algorhythm.dev");
        });

        await test.step("go to task", async () => {
            await page.goto("/tasks");
            await expect(page.locator('text=Loading tasks & courses...')).not.toBeVisible();
            const taskLink = page.getByRole('link', { name: /Sum of two numbers/i });
            await taskLink.click();
            await expect(page).toHaveURL(/\/tasks\/\w+/);        });

        await test.step("fill the code", async () => {
            const editor = page.locator('.monaco-editor').first();
            await editor.click();
            await page.keyboard.press('Control+A');
            await page.keyboard.press('Backspace');

            const myCode = 'public class Solution { public int TwoSum(int a, int b) { return a - b; } }';
            await page.keyboard.insertText(myCode);
        });

        await test.step("should run code and display test errors", async () => {
            const runButton = page.getByRole('button', { name: /Run Code/i });
            await runButton.click();
            await expect(page.getByText(/Running\.\.\./i)).toBeVisible();
            const resultsHeader = page.locator('h3', { hasText: /Results/i });
            await expect(resultsHeader).toBeVisible({ timeout: 20000 });
            const firstTestResult = page.locator('div').filter({ hasText: /Test 1/i }).first();
            await expect(firstTestResult).toContainText('Rejected');
            const successIcon = firstTestResult.locator('svg.text-error').first();
            await expect(successIcon).toBeVisible();
        });
    });
});

test.describe("Parse error tasks flow", () => {
    test("login then open task", async ({ page }) => {
        await test.step("login", async () => {
            await login(page, "alice@algorhythm.dev");
        });

        await test.step("go to task", async () => {
            await page.goto("/tasks");
            await expect(page.locator('text=Loading tasks & courses...')).not.toBeVisible();
            const taskLink = page.getByRole('link', { name: /Sum of two numbers/i });
            await taskLink.click();
            await expect(page).toHaveURL(/\/tasks\/\w+/);        });

        await test.step("fill the code", async () => {
            const editor = page.locator('.monaco-editor').first();
            await editor.click();
            await page.keyboard.press('Control+A');
            await page.keyboard.press('Backspace');

            const myCode = 'public class Solution { public int TwoSum(int a, int b) { return a - b } }';
            await page.keyboard.insertText(myCode);
        });

        await test.step("should run code and display test errors", async () => {
            const runButton = page.getByRole('button', { name: /Run Code/i });
            await runButton.click();
            await expect(page.getByText(/Running\.\.\./i)).toBeVisible();
            const resultsHeader = page.locator('h3', { hasText: /Results/i });
            await expect(resultsHeader).toBeVisible({ timeout: 20000 });
            const firstTestResult = page.locator('div').filter({ hasText: /Test 1/i }).first();
            await expect(firstTestResult).toContainText('Error');
            const errorIcon = firstTestResult.locator('svg.text-error').first();
            await expect(errorIcon).toBeVisible();
        });
    });
});