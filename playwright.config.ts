import { defineConfig } from '@playwright/test';

/** E2E runs against the real production build, using the locally installed Chrome. */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4183',
    channel: 'chrome',
    headless: true,
    launchOptions: { args: ['--no-sandbox'] },
    locale: 'en-US',
    timezoneId: 'UTC',
    trace: 'retain-on-failure',
    screenshot: 'off',
  },
  webServer: {
    command:
      'node ./node_modules/vite/bin/vite.js build && node ./node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4183 --strictPort',
    url: 'http://127.0.0.1:4183',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
