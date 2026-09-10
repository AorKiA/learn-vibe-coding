import { defineConfig, devices } from "@playwright/test";
import { loadEnv } from "./tests/env";

loadEnv();

/**
 * Points at whatever BASE_URL says — the Vercel URL for the real acceptance
 * run, localhost only when explicitly asked. There is deliberately no
 * `webServer` block: Acceptance Test 11 requires the suite to exercise a
 * deployment, so the config must never quietly start a local server.
 */
const baseURL = process.env.PROD_URL ?? process.env.BASE_URL;

if (!baseURL) {
  throw new Error(
    "Set PROD_URL to the deployment under test, e.g.\n" +
      "  PROD_URL=https://your-app.vercel.app npm run verify\n" +
      "To check locally first, use BASE_URL=http://localhost:3000",
  );
}

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false, // the suite shares booking rows; serial keeps it honest
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 45_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
