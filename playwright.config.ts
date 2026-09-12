import { defineConfig, devices } from "@playwright/test";

// Dedicated port so a dev server from another project on :3000 is never reused by mistake.
const PORT = 3100;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "e2e",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL },
  projects: [
    {
      // Primary target device: tablet in landscape (see CLAUDE.md).
      name: "tablet-landscape",
      use: { ...devices["iPad (gen 11) landscape"], browserName: "chromium" },
    },
  ],
  webServer: {
    command: `pnpm dev --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
