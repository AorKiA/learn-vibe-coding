import { expect, test } from "@playwright/test";
import { signUp, uniqueEmail } from "./helpers";

test("AT#8 — an incomplete signup form is rejected field by field", async ({
  page,
}) => {
  await page.goto("/signup");
  await page.getByRole("button", { name: "สมัครสมาชิก" }).click();

  await expect(page.getByText("กรุณากรอกอีเมล")).toBeVisible();
  await expect(page.getByText("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")).toBeVisible();
  await expect(page).toHaveURL(/\/signup/);
});

test("AT#8 — an incomplete booking form is rejected field by field", async ({
  page,
}) => {
  await signUp(page, uniqueEmail("validate"));
  await page.goto("/bookings/new");
  await page.getByRole("button", { name: "ยืนยันการจอง" }).click();

  await expect(page.getByText("กรุณาเลือกห้อง")).toBeVisible();
  await expect(page.getByText("กรุณาเลือกรอบเวลา")).toBeVisible();
  await expect(
    page.getByText("กรุณากรอกวัตถุประสงค์อย่างน้อย 3 ตัวอักษร"),
  ).toBeVisible();
});

test("AT#9 — a wrong password produces a readable message, not a raw error", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("อีเมล").fill("nobody-here@example.com");
  await page.getByLabel("รหัสผ่าน").fill("wrong-password-123");
  await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();

  const alert = page.getByTestId("error-banner");
  await expect(alert).toContainText("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  await expect(alert).not.toContainText("Invalid login credentials");
});

test("Requirement 9 — the bookings page shows an empty state, not a blank page", async ({
  page,
}) => {
  await signUp(page, uniqueEmail("empty"));
  await expect(page.getByTestId("empty-state")).toBeVisible();
  await expect(page.getByText("ยังไม่มีการจอง")).toBeVisible();
});
