import Link from "next/link";
import { getCurrentProfile } from "@/lib/supabase/server";
import {
  formatThaiDate,
  getBookingsOnDate,
  getRooms,
  getTimeSlots,
  todayISO,
} from "@/lib/data";
import { Badge, Card, EmptyState } from "@/components/ui";
import { DatePicker } from "@/components/date-picker";

export default async function RoomsPage({ searchParams }: PageProps<"/rooms">) {
  const params = await searchParams;
  const today = todayISO();
  const raw = typeof params.date === "string" ? params.date : "";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(raw) && raw >= today ? raw : today;

  // Rooms and slots come from Supabase, never from a literal in this file.
  const [profile, rooms, slots, bookings] = await Promise.all([
    getCurrentProfile(),
    getRooms(),
    getTimeSlots(),
    getBookingsOnDate(date),
  ]);

  // room_id + slot_id -> the booking occupying it
  const taken = new Map(bookings.map((b) => [`${b.room_id}:${b.slot_id}`, b]));

  return (
    <div className="space-y-u2">
      <div className="flex flex-wrap items-end justify-between gap-u1">
        <div>
          <h1 className="text-xl font-semibold">ห้องและช่วงเวลาว่าง</h1>
          <p className="text-ink-muted mt-1 text-sm">
            {formatThaiDate(date)} — เลือกช่องที่ว่างเพื่อจอง
          </p>
        </div>
        <DatePicker value={date} min={today} />
      </div>

      {rooms.length === 0 ? (
        <EmptyState
          title="ยังไม่มีห้องในระบบ"
          description="กรุณาติดต่อผู้ดูแลระบบเพื่อเพิ่มห้อง"
        />
      ) : slots.length === 0 ? (
        <EmptyState title="ยังไม่มีรอบเวลาในระบบ" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-3xl border-collapse text-sm">
            <caption className="sr-only">
              ตารางสถานะการจองแต่ละห้องในแต่ละรอบเวลา
            </caption>
            <thead>
              <tr className="border-border border-b">
                <th scope="col" className="p-u1 text-left font-medium">
                  ห้อง
                </th>
                {slots.map((slot) => (
                  <th
                    key={slot.id}
                    scope="col"
                    className="p-u1 text-center font-medium whitespace-nowrap"
                  >
                    {slot.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-border border-b last:border-0">
                  <th scope="row" className="p-u1 text-left font-medium">
                    {room.name}
                    <span className="text-ink-muted block text-xs font-normal">
                      {room.location} · {room.capacity} ที่นั่ง
                    </span>
                  </th>

                  {slots.map((slot) => {
                    const booking = taken.get(`${room.id}:${slot.id}`);
                    const mine = booking?.user_id === profile?.id;
                    const cellId = `${room.id}-${slot.id}`;

                    if (!booking) {
                      return (
                        <td key={slot.id} className="p-u1 text-center">
                          <Link
                            href={`/bookings/new?room=${room.id}&slot=${slot.id}&date=${date}`}
                            data-testid={`free-${cellId}`}
                            className="text-primary-dark inline-block rounded-subtle border border-primary/40 px-2 py-1 text-xs hover:bg-primary/10"
                          >
                            ว่าง · จอง
                          </Link>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={slot.id}
                        className="p-u1 text-center"
                        data-testid={`busy-${cellId}`}
                      >
                        <Badge tone={mine ? "mine" : "busy"}>
                          {mine ? "การจองของคุณ" : "ไม่ว่าง"}
                        </Badge>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
