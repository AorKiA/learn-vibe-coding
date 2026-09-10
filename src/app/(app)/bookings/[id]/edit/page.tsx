import { notFound, redirect } from "next/navigation";
import { getBookingById, getRooms, getTimeSlots, todayISO } from "@/lib/data";
import { getCurrentProfile } from "@/lib/supabase/server";
import { updateBooking } from "@/lib/actions/bookings";
import { BookingForm } from "@/components/booking-form";
import { ErrorBanner } from "@/components/ui";

export default async function EditBookingPage({
  params,
}: PageProps<"/bookings/[id]/edit">) {
  const { id } = await params;

  const [profile, booking, rooms, slots] = await Promise.all([
    getCurrentProfile(),
    getBookingById(id),
    getRooms(),
    getTimeSlots(),
  ]);

  if (!profile) redirect("/login");
  if (!booking) notFound();

  // Everyone can read every booking (that is how busy slots are visible), so
  // ownership has to be checked here too — otherwise a stranger's booking would
  // load into an editable form. The Server Action and RLS both re-check it.
  const canEdit = booking.user_id === profile.id || profile.role === "admin";
  if (!canEdit) {
    return (
      <div className="space-y-u5 settle">
        <h1 className="text-h1 font-medium">แก้ไขการจอง</h1>
        <ErrorBanner>
          คุณไม่มีสิทธิ์แก้ไขรายการนี้ เพราะไม่ใช่การจองของคุณ
        </ErrorBanner>
      </div>
    );
  }

  return (
    <div className="space-y-u4">
      <h1 className="text-h1 font-medium">แก้ไขการจอง</h1>
      <BookingForm
        action={updateBooking}
        rooms={rooms}
        slots={slots}
        today={todayISO()}
        defaults={{
          id: booking.id,
          room_id: booking.room_id,
          slot_id: booking.slot_id,
          booking_date: booking.booking_date,
          purpose: booking.purpose,
        }}
        submitLabel="บันทึกการแก้ไข"
      />
    </div>
  );
}
