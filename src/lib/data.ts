import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { BookingWithRelations, Room, TimeSlot } from "@/lib/types";

/**
 * Read-side data access. Every function here runs in a Server Component with
 * the caller's own session, so RLS decides what comes back — these helpers
 * never widen access, they only shape the query.
 */

export async function getRooms(includeInactive = false): Promise<Room[]> {
  const supabase = await createClient();
  let query = supabase
    .from("rooms")
    .select("id, name, capacity, location, is_active")
    .order("name");

  if (!includeInactive) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getTimeSlots(): Promise<TimeSlot[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("time_slots")
    .select("id, label, start_time, end_time, sort_order")
    .order("sort_order");

  if (error) throw error;
  return data ?? [];
}

/** Every active booking on one date — this is what makes busy slots visible. */
export async function getBookingsOnDate(
  date: string,
): Promise<BookingWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `id, room_id, slot_id, booking_date, user_id, purpose, status,
       created_at, updated_at,
       rooms ( id, name, location ),
       time_slots ( id, label, start_time, sort_order )`,
    )
    .eq("booking_date", date)
    .eq("status", "active");

  if (error) throw error;
  return (data ?? []) as unknown as BookingWithRelations[];
}

/**
 * Bookings to list on the dashboard. Admins see everything; everyone else sees
 * their own. The `userId` filter is a query convenience — RLS is what makes it
 * safe, since a user who removed the filter would still only be able to modify
 * their own rows.
 */
export async function getBookings(opts: {
  userId?: string;
  includeCancelled?: boolean;
}): Promise<BookingWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("bookings")
    .select(
      `id, room_id, slot_id, booking_date, user_id, purpose, status,
       created_at, updated_at,
       rooms ( id, name, location ),
       time_slots ( id, label, start_time, sort_order )`,
    )
    .order("booking_date", { ascending: false });

  if (opts.userId) query = query.eq("user_id", opts.userId);
  if (!opts.includeCancelled) query = query.eq("status", "active");

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as BookingWithRelations[];
}

export async function getBookingById(
  id: string,
): Promise<BookingWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `id, room_id, slot_id, booking_date, user_id, purpose, status,
       created_at, updated_at,
       rooms ( id, name, location ),
       time_slots ( id, label, start_time, sort_order )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return (data as unknown as BookingWithRelations) ?? null;
}

/** Local YYYY-MM-DD, matching what <input type="date"> submits. */
export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatThaiDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
  ];
  return `${d} ${months[m - 1]} ${y + 543}`;
}
