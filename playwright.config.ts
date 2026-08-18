import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    // v2 (VitePress) specs, served by the VitePress preview server.
    {
      name: 'v2-chromium',
      testIgnore: '**/v3/**',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4173/v2/',
      },
    },
    // v3 (Astro) specs, served like production: the whole public/ directory
    // behind a static file server.
    {
      name: 'v3-chromium',
      testMatch: '**/v3/**',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4180/v3/',
      },
    },
  ],
  webServer: [
    {
      command: 'npx vitepress preview site --port 4173',
      port: 4173,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npx http-server public -p 4180',
      port: 4180,
      reuseExistingServer: !process.env.CI,
    },
  ],
})
