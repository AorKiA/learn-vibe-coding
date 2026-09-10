import { expect, test } from "@playwright/test";
import { PASSWORD, signIn, signOut, signUp, uniqueEmail } from "./helpers";

test("AT#1 — sign up, sign out, and sign back in with email/password", async ({
  page,
}) => {
  const email = uniqueEmail("auth");

  await signUp(page, email);
  await expect(page.getByText(email)).toBeVisible();

  await signOut(page);
  await expect(page).toHaveURL(/\/login/);

  await signIn(page, email);
  await expect(page.getByText(email)).toBeVisible();
});

test("AT#2 — a signed-out visitor is sent to the login page", async ({ page }) => {
  for (const path of ["/bookings", "/rooms", "/bookings/new", "/admin/rooms"]) {
    await page.goto(path);
    await expect(page, `${path} should redirect`).toHaveURL(/\/login/);
    await expect(page.getByRole("button", { name: "เข้าสู่ระบบ" })).toBeVisible();
  }
});

test("AT#2 — the login page returns the visitor to where they were headed", async ({
  page,
}) => {
  await page.goto("/rooms");
  await expect(page).toHaveURL(/next=%2Frooms/);

  const email = uniqueEmail("next");
  await page.goto("/signup");
  await page.getByLabel("อีเมล").fill(email);
  await page.getByLabel("รหัสผ่าน").fill(PASSWORD);
  await page.getByRole("button", { name: "สมัครสมาชิก" }).click();
  await page.waitForURL("**/bookings");

  await signOut(page);
  await page.goto("/rooms");
  await page.getByLabel("อีเมล").fill(email);
  await page.getByLabel("รหัสผ่าน").fill(PASSWORD);
  await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
  await expect(page).toHaveURL(/\/rooms/);
});

test("AT#12 — the auth callback route redirects instead of dead-ending", async ({
  page,
}) => {
  // A callback without a code must land the visitor on login with a readable
  // message, not on a blank page or a stack trace.
  await page.goto("/auth/callback");
  await expect(page).toHaveURL(/\/login/);
  // getByRole("alert") would also match Next.js's route announcer, so target
  // the banner directly.
  await expect(page.getByTestId("error-banner")).toContainText("ลิงก์ยืนยัน");
});
