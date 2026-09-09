import { defineConfig, devices } from '@playwright/test';
export default defineConfig({ testDir: './tests/e2e', fullyParallel: false, workers: 1,
  timeout: 60_000, expect: { timeout: 12_000 }, reporter: 'list',
  use: { ...devices['iPhone 13'], browserName: 'chromium', channel: process.env.CI ? undefined : 'chrome',
    baseURL: 'http://127.0.0.1:3000', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'npm run dev -- --host 127.0.0.1', url: 'http://127.0.0.1:3000', reuseExistingServer: false,
    env: { VITE_USE_FIREBASE_EMULATORS: 'true' } },
});
