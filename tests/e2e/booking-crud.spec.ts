import { expect, test } from "@playwright/test";
import { signUp, uniqueEmail, unusedDate } from "./helpers";

test("AT#4/#5 — create, persist across a refresh, edit, then cancel", async ({
  page,
}) => {
  await signUp(page, uniqueEmail("crud"));

  const date = unusedDate();
  const purpose = `อ่านหนังสือสอบ ${Date.now()}`;

  await page.goto("/bookings/new");
  await page.getByLabel("ห้อง").selectOption({ index: 1 });
  await page.getByLabel("รอบเวลา").selectOption({ index: 1 });
  await page.getByLabel("วันที่").fill(date);
  await page.getByLabel("วัตถุประสงค์การใช้งาน").fill(purpose);
  await page.getByRole("button", { name: "ยืนยันการจอง" }).click();

  await page.waitForURL("**/bookings**");
  await expect(page.getByText(purpose)).toBeVisible();

  // AT#4 — still there after a full reload, which rules out client-only state.
  await page.reload();
  await expect(page.getByText(purpose)).toBeVisible();

  // AT#5 — edit
  const edited = `${purpose} แก้ไขแล้ว`;
  await page.getByRole("link", { name: "แก้ไข" }).first().click();
  await page.waitForURL("**/edit");
  await page.getByLabel("วัตถุประสงค์การใช้งาน").fill(edited);
  await page.getByRole("button", { name: "บันทึกการแก้ไข" }).click();

  await page.waitForURL("**/bookings**");
  await expect(page.getByText(edited)).toBeVisible();
  await page.reload();
  await expect(page.getByText(edited)).toBeVisible();

  // AT#5 — cancel
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "ยกเลิก" }).first().click();
  await expect(page.getByText("ยกเลิกแล้ว").first()).toBeVisible();
});

test("AT#7/#9 — a duplicate room/date/slot is refused in plain Thai", async ({
  page,
}) => {
  await signUp(page, uniqueEmail("dup"));

  const date = unusedDate();
  await page.goto("/bookings/new");
  await page.getByLabel("ห้อง").selectOption({ index: 1 });
  await page.getByLabel("รอบเวลา").selectOption({ index: 1 });
  await page.getByLabel("วันที่").fill(date);
  await page.getByLabel("วัตถุประสงค์การใช้งาน").fill("การจองแรก");
  await page.getByRole("button", { name: "ยืนยันการจอง" }).click();
  await page.waitForURL("**/bookings**");

  // Same room, same date, same slot — the database must refuse it.
  await page.goto("/bookings/new");
  await page.getByLabel("ห้อง").selectOption({ index: 1 });
  await page.getByLabel("รอบเวลา").selectOption({ index: 1 });
  await page.getByLabel("วันที่").fill(date);
  await page.getByLabel("วัตถุประสงค์การใช้งาน").fill("การจองซ้ำ");
  await page.getByRole("button", { name: "ยืนยันการจอง" }).click();

  // AT#9 — the raw Postgres message must never reach the screen.
  const alert = page.getByTestId("error-banner");
  await expect(alert).toBeVisible();
  await expect(alert).toContainText("ถูกจองไปแล้ว");
  await expect(alert).not.toContainText("duplicate key");
  await expect(alert).not.toContainText("23505");
});

test("AT#6 — user B cannot reach the edit form for user A's booking", async ({
  browser,
}) => {
  const date = unusedDate();
  const purpose = `booking owned by A ${Date.now()}`;

  const contextA = await browser.newContext();
  const pageA = await contextA.newPage();
  await signUp(pageA, uniqueEmail("owner"));
  await pageA.goto("/bookings/new");
  await pageA.getByLabel("ห้อง").selectOption({ index: 1 });
  await pageA.getByLabel("รอบเวลา").selectOption({ index: 2 });
  await pageA.getByLabel("วันที่").fill(date);
  await pageA.getByLabel("วัตถุประสงค์การใช้งาน").fill(purpose);
  await pageA.getByRole("button", { name: "ยืนยันการจอง" }).click();
  await pageA.waitForURL("**/bookings**");
  // Assert the setup worked, so a later failure blames the right thing.
  await expect(pageA.getByText(purpose)).toBeVisible();
  const editHref = await pageA
    .getByRole("link", { name: "แก้ไข" })
    .first()
    .getAttribute("href");
  await contextA.close();

  const contextB = await browser.newContext();
  const pageB = await contextB.newPage();
  await signUp(pageB, uniqueEmail("other"));

  // B's own list must not contain A's booking.
  await pageB.goto("/bookings");
  await expect(pageB.getByText(purpose)).toHaveCount(0);

  // Reaching A's edit URL directly must refuse rather than render a form.
  await pageB.goto(editHref!);
  await expect(pageB.getByTestId("error-banner")).toContainText("ไม่มีสิทธิ์");
  await expect(
    pageB.getByRole("button", { name: "บันทึกการแก้ไข" }),
  ).toHaveCount(0);

  // The slot still reads as busy to B — requirement 4.
  await pageB.goto(`/rooms?date=${date}`);
  await expect(pageB.getByText("ไม่ว่าง").first()).toBeVisible();
  await contextB.close();
});
