import { defineConfig, devices } from '@playwright/test';

/**
 * Sauce Demo UI tests (Chromium).
 * Run: npm test
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: !!process.env.CI,
    // Sauce Demo exposes stable data-test attributes (not data-testid).
    testIdAttribute: 'data-test',
    screenshot: 'only-on-failure',
    // Video needs Playwright's ffmpeg download; disabled while CDN installs time out.
    video: 'off',
    trace: 'on-first-retry',
    actionTimeout: 10_000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use installed Chrome while Playwright's Chromium download times out.
        channel: 'chrome',
      },
    },
  ],
});
