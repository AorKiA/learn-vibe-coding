import { z } from "zod";

/**
 * Server-side validation (Acceptance Test 8). The browser's `required`
 * attributes are UX; these schemas run inside Server Actions, which are
 * reachable by direct POST and therefore must validate independently.
 */

/**
 * Order matters. An empty select fails both checks, and toFieldErrors keeps the
 * first issue per field — so "please choose" has to be declared before the
 * format check, or the user is told the value is malformed when they simply
 * have not picked one.
 */
const requiredUuid = (missing: string) =>
  z.string().min(1, missing).uuid({ message: "ค่าที่เลือกไม่ถูกต้อง" });

export const credentialsSchema = z.object({
  email: z
    .string()
    .min(1, "กรุณากรอกอีเมล")
    .email("รูปแบบอีเมลไม่ถูกต้อง")
    .transform((v) => v.trim().toLowerCase()),
  password: z
    .string()
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
    .max(72, "รหัสผ่านยาวเกินไป"),
});

/** Local date in YYYY-MM-DD, as produced by <input type="date">. */
const todayISO = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const bookingSchema = z.object({
  room_id: requiredUuid("กรุณาเลือกห้อง"),
  slot_id: requiredUuid("กรุณาเลือกรอบเวลา"),
  booking_date: z
    .string()
    .min(1, "กรุณาเลือกวันที่")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "รูปแบบวันที่ไม่ถูกต้อง")
    .refine((v) => v >= todayISO(), "ไม่สามารถจองย้อนหลังได้"),
  purpose: z
    .string()
    .transform((v) => v.trim())
    .pipe(
      z
        .string()
        .min(3, "กรุณากรอกวัตถุประสงค์อย่างน้อย 3 ตัวอักษร")
        .max(500, "วัตถุประสงค์ต้องไม่เกิน 500 ตัวอักษร"),
    ),
});

export const roomSchema = z.object({
  name: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(1, "กรุณากรอกชื่อห้อง").max(100, "ชื่อห้องยาวเกินไป")),
  capacity: z.coerce
    .number({ message: "ความจุต้องเป็นตัวเลข" })
    .int("ความจุต้องเป็นจำนวนเต็ม")
    .min(1, "ความจุต้องมากกว่า 0")
    .max(500, "ความจุต้องไม่เกิน 500"),
  location: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().max(200, "สถานที่ยาวเกินไป"))
    .optional(),
  is_active: z.coerce.boolean().optional().default(true),
});

/** Flattens a ZodError into the `fieldErrors` shape used by ActionState. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
