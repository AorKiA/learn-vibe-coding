/**
 * The three proofs a browser cannot give.
 *
 * Clicking around only shows that buttons are hidden. This script talks to
 * Supabase's REST API directly, as two real signed-in users, and checks what
 * the database actually permits. It never uses a service_role key — that is the
 * whole point: if RLS were wrong, these calls would succeed.
 *
 * Run: node tests/checks/rls.mjs
 */
import { existsSync, readFileSync } from "node:fs";

// ---------------------------------------------------------------- env

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i > 0 && !process.env[t.slice(0, i)]) {
      process.env[t.slice(0, i)] = t.slice(i + 1);
    }
  }
}

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!URL_ || !KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY");
  process.exit(1);
}

// ---------------------------------------------------------------- helpers

const results = [];
function record(id, name, passed, detail) {
  results.push({ id, name, passed, detail });
  const mark = passed ? "PASS" : "FAIL";
  console.log(`  ${mark}  ${id} ${name}${detail ? ` — ${detail}` : ""}`);
}

const PASSWORD = "AcceptanceTest123!";
const stamp = () =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

async function signUp(tag) {
  const email = `rls-${tag}-${stamp()}@example.com`;
  const res = await fetch(`${URL_}/auth/v1/signup`, {
    method: "POST",
    headers: { apikey: KEY, "content-type": "application/json" },
    body: JSON.stringify({ email, password: PASSWORD }),
  });
  const body = await res.json();
  if (!body.access_token) {
    throw new Error(
      `signup produced no session for ${email}. ` +
        `Is "Confirm email" still on in Supabase → Authentication → Providers → Email? ` +
        `Response: ${JSON.stringify(body).slice(0, 200)}`,
    );
  }
  return { email, token: body.access_token, id: body.user.id };
}

async function rest(user, path, init = {}) {
  const headers = {
    apikey: KEY,
    "content-type": "application/json",
    Prefer: init.prefer ?? "return=representation",
  };
  if (user) headers.Authorization = `Bearer ${user.token}`;
  const res = await fetch(`${URL_}/rest/v1/${path}`, { ...init, headers });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: res.status, body };
}

function futureDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// ---------------------------------------------------------------- checks

console.log(`\nRLS and constraint checks against ${URL_}\n`);

const A = await signUp("a");
const B = await signUp("b");

const { body: rooms } = await rest(A, "rooms?select=id&is_active=eq.true&limit=2");
const { body: slots } = await rest(A, "time_slots?select=id&order=sort_order&limit=2");
if (!Array.isArray(rooms) || rooms.length === 0 || !Array.isArray(slots) || slots.length === 0) {
  console.error("No rooms or time_slots readable — run the migrations first.");
  process.exit(1);
}

// --- AT#6 -------------------------------------------------------------------

const date6 = futureDate(21);
const { status: createStatus, body: created } = await rest(A, "bookings", {
  method: "POST",
  body: JSON.stringify({
    room_id: rooms[0].id,
    slot_id: slots[0].id,
    booking_date: date6,
    purpose: "owned by user A",
    user_id: A.id,
  }),
});
if (createStatus !== 201 || !created?.[0]?.id) {
  console.error(`user A could not create a booking: ${createStatus} ${JSON.stringify(created)}`);
  process.exit(1);
}
const bookingId = created[0].id;

const bUpdate = await rest(
  B,
  `bookings?id=eq.${bookingId}`,
  { method: "PATCH", body: JSON.stringify({ purpose: "hacked by user B" }) },
);
const bUpdatedRows = Array.isArray(bUpdate.body) ? bUpdate.body.length : -1;
record(
  "AT#6a",
  "user B cannot UPDATE user A's booking",
  bUpdatedRows === 0,
  `${bUpdatedRows} rows updated (expected 0)`,
);

const bDelete = await rest(B, `bookings?id=eq.${bookingId}`, { method: "DELETE" });
const bDeletedRows = Array.isArray(bDelete.body) ? bDelete.body.length : -1;
record(
  "AT#6b",
  "user B cannot DELETE user A's booking",
  bDeletedRows === 0,
  `${bDeletedRows} rows deleted (expected 0)`,
);

const stillThere = await rest(A, `bookings?id=eq.${bookingId}&select=purpose`);
record(
  "AT#6c",
  "user A's booking is untouched afterwards",
  stillThere.body?.[0]?.purpose === "owned by user A",
  `purpose is "${stillThere.body?.[0]?.purpose}"`,
);

const aUpdate = await rest(
  A,
  `bookings?id=eq.${bookingId}`,
  { method: "PATCH", body: JSON.stringify({ purpose: "edited by the owner" }) },
);
record(
  "AT#5",
  "user A can UPDATE their own booking",
  Array.isArray(aUpdate.body) && aUpdate.body.length === 1,
  `${aUpdate.body?.length} row updated`,
);

// The user_id in the request body must never be believed.
const forged = await rest(B, "bookings", {
  method: "POST",
  body: JSON.stringify({
    room_id: rooms[0].id,
    slot_id: slots[1].id,
    booking_date: futureDate(22),
    purpose: "B forging A as the owner",
    user_id: A.id,
  }),
});
record(
  "AT#6d",
  "user B cannot insert a row owned by user A",
  forged.status === 403 || forged.status === 401,
  `HTTP ${forged.status} (${forged.body?.code ?? "no code"})`,
);

// --- AT#7 -------------------------------------------------------------------

const date7 = futureDate(23);
const payload = {
  room_id: rooms[0].id,
  slot_id: slots[0].id,
  booking_date: date7,
  purpose: "concurrent write",
  user_id: A.id,
};

// Fired together on purpose: a check-then-insert in application code would let
// both through. Only a database constraint can decide this correctly.
const [first, second] = await Promise.all([
  rest(A, "bookings", { method: "POST", body: JSON.stringify(payload) }),
  rest(A, "bookings", { method: "POST", body: JSON.stringify(payload) }),
]);

const statuses = [first.status, second.status].sort();
const codes = [first.body?.code, second.body?.code].filter(Boolean);
record(
  "AT#7",
  "concurrent duplicate room/date/slot is rejected by the database",
  statuses[0] === 201 && statuses[1] === 409 && codes.includes("23505"),
  `statuses ${statuses.join(" + ")}, error code ${codes.join(",") || "none"}`,
);

// Cancelling must free the slot again — the index is partial on status.
const winner = first.status === 201 ? first : second;
await rest(A, `bookings?id=eq.${winner.body[0].id}`, {
  method: "PATCH",
  body: JSON.stringify({ status: "cancelled" }),
});
const rebook = await rest(A, "bookings", {
  method: "POST",
  body: JSON.stringify({ ...payload, purpose: "rebooked after cancelling" }),
});
record(
  "AT#7b",
  "the same slot is bookable again once cancelled",
  rebook.status === 201,
  `HTTP ${rebook.status}`,
);

// --- anonymous access -------------------------------------------------------

const anonRooms = await rest(null, "rooms?select=id");
const anonBookings = await rest(null, "bookings?select=id");
record(
  "RLS",
  "signed-out callers read nothing",
  (anonRooms.body?.length ?? 0) === 0 && (anonBookings.body?.length ?? 0) === 0,
  `rooms ${anonRooms.body?.length ?? "err"}, bookings ${anonBookings.body?.length ?? "err"}`,
);

// --- role escalation --------------------------------------------------------

const escalate = await rest(B, `profiles?id=eq.${B.id}`, {
  method: "PATCH",
  body: JSON.stringify({ role: "admin" }),
});
record(
  "RLS",
  "a user cannot promote themselves to admin",
  escalate.status >= 400 || (Array.isArray(escalate.body) && escalate.body.length === 0),
  `HTTP ${escalate.status} (${escalate.body?.code ?? "no rows"})`,
);

// ---------------------------------------------------------------- summary

const failed = results.filter((r) => !r.passed);
console.log(
  `\n${results.length - failed.length}/${results.length} checks passed\n`,
);
process.exit(failed.length === 0 ? 0 : 1);
