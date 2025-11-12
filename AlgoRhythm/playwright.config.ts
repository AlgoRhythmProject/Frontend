import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E Test Configuration
 * Separate from Jest unit tests
 */
export default defineConfig({
    // Test directory - separate from Jest tests
    testDir: './src/tests/e2e',

    // Test file patterns - use .spec.ts for Playwright
    testMatch: '**/*.spec.ts',

    // Ignore Jest test files
    testIgnore: [
        '**/node_modules/**',
        '**/src/**/__tests__/**',
        '**/*.test.ts',
        '**/*.test.tsx',
    ],

    // Run tests in parallel
    fullyParallel: true,

    // Fail the build on CI if you accidentally left test.only
    forbidOnly: !!process.env.CI,

    // Retry on CI only
    retries: process.env.CI ? 2 : 0,

    // Opt out of parallel tests on CI
    workers: process.env.CI ? 1 : undefined,

    // Reporter
    reporter: [
        ['html', { outputFolder: 'playwright-report' }],
        ['json', { outputFile: 'playwright-report/results.json' }],
        ['list']
    ],

    // Shared settings for all projects
    use: {
        // Base URL for your application
        baseURL: 'http://localhost:5173', // Adjust to your dev server port

        // Collect trace when retrying the failed test
        trace: 'on-first-retry',

        // Screenshot on failure
        screenshot: 'only-on-failure',

        // Video on failure
        video: 'retain-on-failure',
    },

    // Configure projects for major browsers
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },

        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },

        // Mobile viewports
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],

    // Run your local dev server before starting the tests
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5173',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});