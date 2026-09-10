import { getRooms, getTimeSlots, todayISO } from "@/lib/data";
import { createBooking } from "@/lib/actions/bookings";
import { BookingForm } from "@/components/booking-form";

export default async function NewBookingPage({
  searchParams,
}: PageProps<"/bookings/new">) {
  const params = await searchParams;
  const [rooms, slots] = await Promise.all([getRooms(), getTimeSlots()]);
  const today = todayISO();

  const pick = (key: string) =>
    typeof params[key] === "string" ? (params[key] as string) : undefined;

  return (
    <div className="space-y-u2">
      <h1 className="text-xl font-semibold">จองห้อง</h1>
      <BookingForm
        action={createBooking}
        rooms={rooms}
        slots={slots}
        today={today}
        defaults={{
          room_id: pick("room"),
          slot_id: pick("slot"),
          booking_date: pick("date") ?? today,
        }}
        submitLabel="ยืนยันการจอง"
      />
    </div>
  );
}
