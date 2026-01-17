const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    ...tsJestTransformCfg,
  },
  testPathIgnorePatterns: [
      '/node_modules/',
      '/e2e/',           // Ignore Playwright test directory
      '/playwright/',    // Ignore Playwright config/setup
      String.raw`\.spec\.ts$`    // Ignore .spec.ts files (Playwright convention)
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],

  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/e2e/',
    '/__tests__/',
    '/dist/',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test|[_]test).[jt]s?(x)"
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^lucide-react$': require.resolve('lucide-react'),
  },
  // Clear mocks between tests
  clearMocks: true,
  // Restore mocks between tests
  restoreMocks: true,
};