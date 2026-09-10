"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { mapDbError, PERMISSION_DENIED } from "@/lib/errors";
import { roomSchema, toFieldErrors } from "@/lib/validation";
import type { ActionState } from "@/lib/types";

/**
 * Admin-only room management. Note there is no `if (role === 'admin')` guard in
 * this file: the RLS policy `rooms_admin_write` is the check, and a non-admin
 * write comes back as zero rows. Doing it that way means the rule cannot drift
 * between the UI and the database.
 */

function fields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    capacity: String(formData.get("capacity") ?? ""),
    location: String(formData.get("location") ?? ""),
    is_active: formData.get("is_active") === "on",
  };
}

export async function createRoom(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = roomSchema.safeParse(fields(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .insert(parsed.data)
    .select("id");

  if (error) return { ok: false, message: mapDbError(error) };
  if (!data || data.length === 0) {
    return { ok: false, message: "คุณไม่มีสิทธิ์เพิ่มห้อง (เฉพาะผู้ดูแลระบบ)" };
  }

  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  return { ok: true, message: `เพิ่มห้อง "${parsed.data.name}" เรียบร้อยแล้ว` };
}

export async function updateRoom(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "ไม่พบห้องที่ต้องการแก้ไข" };

  const parsed = roomSchema.safeParse(fields(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .update(parsed.data)
    .eq("id", id)
    .select("id");

  if (error) return { ok: false, message: mapDbError(error) };
  if (!data || data.length === 0) {
    return { ok: false, message: PERMISSION_DENIED };
  }

  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  return { ok: true, message: "บันทึกการแก้ไขห้องเรียบร้อยแล้ว" };
}

/**
 * Deactivate rather than delete. bookings.room_id is ON DELETE RESTRICT, so a
 * room with history cannot be removed — and should not be, or past bookings
 * would lose their room name.
 */
export async function toggleRoomActive(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  const nextActive = formData.get("next_active") === "true";
  if (!id) return { ok: false, message: "ไม่พบห้องที่ต้องการเปลี่ยนสถานะ" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rooms")
    .update({ is_active: nextActive })
    .eq("id", id)
    .select("id");

  if (error) return { ok: false, message: mapDbError(error) };
  if (!data || data.length === 0) {
    return { ok: false, message: PERMISSION_DENIED };
  }

  revalidatePath("/admin/rooms");
  revalidatePath("/rooms");
  return {
    ok: true,
    message: nextActive ? "เปิดใช้งานห้องแล้ว" : "ปิดใช้งานห้องแล้ว",
  };
}
