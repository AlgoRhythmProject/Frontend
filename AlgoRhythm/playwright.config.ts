import { defineConfig, devices } from '@playwright/test';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Playwright E2E Test Configuration
 * Separate from Jest unit tests
 */

const isE2E = process.env.TEST_MODE === 'E2E';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKEND_DIR = process.env.BACKEND_PATH || path.resolve(__dirname, '../../Backend/AlgoRhythm');

export default defineConfig({
    //globalTeardown: './playwright-global-teardown.ts',

    timeout: process.env.CI ? 60 * 1000 : 30 * 1000,
    expect: {
        timeout: process.env.CI ? 10 * 1000 : 5 * 1000,
    },

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
        baseURL: 'http://localhost:5173',

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
            testDir: './src/tests/ui',
            name: 'UI',
            use: {
                ...devices['Desktop Chrome'],
                baseURL: 'http://localhost:5173'
            },
        },
        {
            testDir: './src/tests/e2e',
            name: 'E2E',
            use: {
                ...devices['Desktop Chrome'],
            }
        }
    ],

    // Run local dev server before starting the tests
    webServer: [isE2E ?
        {
            command: `cd ${BACKEND_DIR} && docker compose -f docker-compose.dev.yml up`,
            url: 'http://localhost:5173',
            reuseExistingServer: !process.env.CI,
            stdout: 'pipe',
            timeout: 300_000,
        } :
        {
            command: 'npm run dev',
            url: 'http://localhost:5173',
            reuseExistingServer: !process.env.CI,
        }],
});