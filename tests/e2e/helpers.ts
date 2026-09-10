import type { Page } from "@playwright/test";

/**
 * Each run creates its own accounts so the suite can be run repeatedly against
 * the same deployment without colliding on the unique room/date/slot index.
 */
export function uniqueEmail(tag: string): string {
  const stamp = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  return `at-${tag}-${stamp}@example.com`;
}

export const PASSWORD = "AcceptanceTest123!";

export function futureDate(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * A date this run is unlikely to share with any previous one.
 *
 * A fixed offset looks fine on the first run and then fails on the second: the
 * unique index the suite is here to prove would reject the booking, and the
 * test would report that as a broken feature rather than as leftover data.
 */
export function unusedDate(): string {
  return futureDate(30 + Math.floor(Math.random() * 360));
}

export async function signUp(page: Page, email: string) {
  await page.goto("/signup");
  await page.getByLabel("อีเมล").fill(email);
  await page.getByLabel("รหัสผ่าน").fill(PASSWORD);
  await page.getByRole("button", { name: "สมัครสมาชิก" }).click();
  await page.waitForURL("**/bookings", { timeout: 30_000 });
}

export async function signIn(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("อีเมล").fill(email);
  await page.getByLabel("รหัสผ่าน").fill(PASSWORD);
  await page.getByRole("button", { name: "เข้าสู่ระบบ" }).click();
  await page.waitForURL("**/bookings", { timeout: 30_000 });
}

export async function signOut(page: Page) {
  await page.getByRole("button", { name: "ออกจากระบบ" }).click();
  await page.waitForURL("**/login", { timeout: 30_000 });
}

/** Fills the booking form and submits it. Returns nothing; caller asserts. */
export async function fillBooking(
  page: Page,
  opts: { roomLabel?: string; slotLabel?: string; date: string; purpose: string },
) {
  if (opts.roomLabel) {
    await page.getByLabel("ห้อง").selectOption({ label: opts.roomLabel });
  }
  if (opts.slotLabel) {
    await page.getByLabel("รอบเวลา").selectOption({ label: opts.slotLabel });
  }
  await page.getByLabel("วันที่").fill(opts.date);
  await page.getByLabel("วัตถุประสงค์การใช้งาน").fill(opts.purpose);
}
