import { expect, test } from "@playwright/test";
import { PASSWORD, signUp, uniqueEmail } from "./helpers";
import { rest, signUpViaApi } from "../supabase-rest";

test("AT#3 — the room list matches Supabase, so it cannot be a hard-coded array", async ({
  page,
}) => {
  await signUp(page, uniqueEmail("rooms"));
  await page.goto("/rooms");
  await expect(page.getByRole("table")).toBeVisible();

  const rendered = (
    await page.getByRole("row").locator("th[scope=row]").allInnerTexts()
  ).map((t) => t.split("\n")[0].trim());
  expect(rendered.length).toBeGreaterThan(0);

  // Ask the database the same question, as a real signed-in user, and require
  // the two lists to agree. A literal array in the source would drift from this.
  const session = await signUpViaApi(uniqueEmail("rooms-api"), PASSWORD);
  const { body } = await rest<{ name: string }[]>(
    session,
    "rooms?select=name&is_active=eq.true&order=name",
  );
  const fromDb = body.map((r) => r.name);

  expect(fromDb.length).toBeGreaterThan(0);
  expect(rendered.sort()).toEqual(fromDb.sort());

  // The slot columns come from the time_slots table too.
  const { body: slots } = await rest<{ label: string }[]>(
    session,
    "time_slots?select=label&order=sort_order",
  );
  const headers = await page.getByRole("columnheader").allInnerTexts();
  for (const slot of slots) {
    expect(headers).toContain(slot.label);
  }
});
