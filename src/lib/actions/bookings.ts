"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapDbError, PERMISSION_DENIED } from "@/lib/errors";
import { bookingSchema, toFieldErrors } from "@/lib/validation";
import type { ActionState } from "@/lib/types";

const NOT_SIGNED_IN = "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่";

function fields(formData: FormData) {
  return {
    room_id: String(formData.get("room_id") ?? ""),
    slot_id: String(formData.get("slot_id") ?? ""),
    booking_date: String(formData.get("booking_date") ?? ""),
    purpose: String(formData.get("purpose") ?? ""),
  };
}

export async function createBooking(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = bookingSchema.safeParse(fields(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: NOT_SIGNED_IN };

  // user_id comes from the verified session, never from the form. The column
  // default and the RLS insert policy both re-assert this at the DB.
  const { error } = await supabase
    .from("bookings")
    .insert({ ...parsed.data, user_id: user.id })
    .select("id")
    .single();

  if (error) return { ok: false, message: mapDbError(error) };

  revalidatePath("/bookings");
  revalidatePath("/rooms");
  redirect("/bookings?created=1");
}

export async function updateBooking(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "ไม่พบรายการที่ต้องการแก้ไข" };

  const parsed = bookingSchema.safeParse(fields(formData));
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: NOT_SIGNED_IN };

  const { data, error } = await supabase
    .from("bookings")
    .update(parsed.data)
    .eq("id", id)
    .eq("status", "active")
    .select("id");

  if (error) return { ok: false, message: mapDbError(error) };

  // RLS does not raise on a rejected UPDATE — it filters the row out and the
  // statement reports success with zero rows. Without this check, editing
  // someone else's booking would look like it worked.
  if (!data || data.length === 0) {
    return { ok: false, message: PERMISSION_DENIED };
  }

  revalidatePath("/bookings");
  revalidatePath("/rooms");
  redirect("/bookings?updated=1");
}

export async function cancelBooking(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "ไม่พบรายการที่ต้องการยกเลิก" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: NOT_SIGNED_IN };

  // Soft cancel. The unique index is partial on status = 'active', so the slot
  // becomes bookable again the moment this row flips to 'cancelled' — which is
  // exactly the "cancel before rebooking" rule.
  const { data, error } = await supabase
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", id)
    .select("id");

  if (error) return { ok: false, message: mapDbError(error) };
  if (!data || data.length === 0) {
    return { ok: false, message: PERMISSION_DENIED };
  }

  revalidatePath("/bookings");
  revalidatePath("/rooms");
  return { ok: true, message: "ยกเลิกการจองเรียบร้อยแล้ว" };
}

/** Permanent removal, offered only for already-cancelled rows. */
export async function deleteBooking(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "ไม่พบรายการที่ต้องการลบ" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: NOT_SIGNED_IN };

  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) return { ok: false, message: mapDbError(error) };
  if (!data || data.length === 0) {
    return { ok: false, message: PERMISSION_DENIED };
  }

  revalidatePath("/bookings");
  revalidatePath("/rooms");
  return { ok: true, message: "ลบรายการเรียบร้อยแล้ว" };
}
