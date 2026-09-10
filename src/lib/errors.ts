/**
 * Turns database and auth failures into Thai sentences a student can act on
 * (Acceptance Test 9). Raw Postgres text like
 * `duplicate key value violates unique constraint "bookings_no_double_booking"`
 * must never reach the screen.
 */

type UnknownDbError = {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
};

const GENERIC = "เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง";

export const PERMISSION_DENIED =
  "คุณไม่มีสิทธิ์แก้ไขหรือลบรายการนี้ เพราะไม่ใช่การจองของคุณ";

export const SLOT_TAKEN =
  "ช่วงเวลานี้ถูกจองไปแล้ว กรุณาเลือกห้องหรือรอบเวลาอื่น";

export function mapDbError(error: UnknownDbError | null | undefined): string {
  if (!error) return GENERIC;

  const raw = `${error.message ?? ""} ${error.details ?? ""}`;

  switch (error.code) {
    case "23505": // unique_violation
      if (raw.includes("bookings_no_double_booking")) return SLOT_TAKEN;
      if (raw.includes("rooms_name_key")) return "มีห้องชื่อนี้อยู่แล้ว";
      if (raw.includes("time_slots")) return "มีรอบเวลานี้อยู่แล้ว";
      return "ข้อมูลนี้ซ้ำกับรายการที่มีอยู่แล้ว";

    case "23503": // foreign_key_violation
      return "ไม่พบห้องหรือรอบเวลาที่เลือก กรุณารีเฟรชหน้าแล้วเลือกใหม่";

    case "23514": // check_violation
      if (raw.includes("purpose")) return "วัตถุประสงค์ต้องมีความยาว 3-500 ตัวอักษร";
      if (raw.includes("capacity")) return "ความจุห้องต้องมากกว่า 0";
      return "ข้อมูลที่กรอกไม่ผ่านเงื่อนไขของระบบ";

    case "42501": // insufficient_privilege — raised by prevent_role_escalation
      return "คุณไม่มีสิทธิ์ดำเนินการนี้";

    case "P0001": // raise_exception from our own triggers
      if (raw.includes("booking_date_in_past"))
        return "ไม่สามารถจองย้อนหลังได้ กรุณาเลือกวันที่ตั้งแต่วันนี้เป็นต้นไป";
      if (raw.includes("insufficient_privilege")) return "คุณไม่มีสิทธิ์ดำเนินการนี้";
      return GENERIC;

    case "PGRST301":
    case "PGRST116":
      return PERMISSION_DENIED;
  }

  // RLS rejections on SELECT surface as an empty result, not a code — callers
  // handle that case explicitly rather than relying on this function.
  if (raw.toLowerCase().includes("row-level security")) return PERMISSION_DENIED;
  if (raw.toLowerCase().includes("jwt")) return "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่";

  return GENERIC;
}

/** Supabase Auth errors (sign in / sign up). */
export function mapAuthError(error: { message?: string } | null): string {
  const message = error?.message?.toLowerCase() ?? "";

  if (message.includes("invalid login credentials"))
    return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  if (message.includes("email not confirmed"))
    return "อีเมลนี้ยังไม่ได้ยืนยัน กรุณาตรวจสอบกล่องจดหมายของคุณ";
  if (message.includes("user already registered") || message.includes("already been registered"))
    return "อีเมลนี้ถูกใช้สมัครไปแล้ว กรุณาเข้าสู่ระบบแทน";
  if (message.includes("password should be at least"))
    return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
  if (message.includes("rate limit") || message.includes("too many"))
    return "ลองบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่";
  if (message.includes("unable to validate email") || message.includes("invalid email"))
    return "รูปแบบอีเมลไม่ถูกต้อง";

  return "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง";
}
