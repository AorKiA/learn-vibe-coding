export type Role = "user" | "admin";

export type Profile = {
  id: string;
  email: string;
  role: Role;
};

export type Room = {
  id: string;
  name: string;
  capacity: number;
  location: string | null;
  is_active: boolean;
};

export type TimeSlot = {
  id: string;
  label: string;
  start_time: string;
  end_time: string;
  sort_order: number;
};

export type BookingStatus = "active" | "cancelled";

export type Booking = {
  id: string;
  room_id: string;
  slot_id: string;
  booking_date: string;
  user_id: string;
  purpose: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
};

/** A booking joined with its room and slot, as listed on the bookings page. */
export type BookingWithRelations = Booking & {
  rooms: Pick<Room, "id" | "name" | "location"> | null;
  time_slots: Pick<TimeSlot, "id" | "label" | "start_time" | "sort_order"> | null;
};

/** Shape returned by every Server Action, consumed by useActionState. */
export type ActionState = {
  ok: boolean;
  message?: string;
  /** Per-field validation messages, keyed by form field name. */
  fieldErrors?: Record<string, string>;
};

export const IDLE_STATE: ActionState = { ok: false };
