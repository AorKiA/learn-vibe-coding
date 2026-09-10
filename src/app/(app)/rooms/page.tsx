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
  const freeCount = rooms.length * slots.length - taken.size;

  return (
    <div className="space-y-u4">
      <header className="animate-rise flex flex-wrap items-end justify-between gap-u3">
        <div>
          <h1 className="text-h1 from-primary via-violet to-primary bg-gradient-to-r bg-clip-text font-semibold text-transparent">
            ห้องและช่วงเวลาว่าง
          </h1>
          <p className="text-ink-muted text-small mt-u1 flex flex-wrap items-center gap-u2">
            <span>{formatThaiDate(date)}</span>
            <span className="text-ink-subtle">·</span>
            <span>เลือกช่องที่ว่างเพื่อจอง</span>
            {rooms.length > 0 && slots.length > 0 && (
              <Badge tone={freeCount > 0 ? "free" : "busy"}>
                ว่าง {freeCount} จาก {rooms.length * slots.length} ช่อง
              </Badge>
            )}
          </p>
        </div>
        <DatePicker value={date} min={today} />
      </header>

      {rooms.length === 0 ? (
        <EmptyState
          title="ยังไม่มีห้องในระบบ"
          description="กรุณาติดต่อผู้ดูแลระบบเพื่อเพิ่มห้อง"
        />
      ) : slots.length === 0 ? (
        <EmptyState title="ยังไม่มีรอบเวลาในระบบ" />
      ) : (
        <Card className="animate-rise overflow-x-auto p-0 [animation-delay:80ms]">
          <table className="text-small w-full min-w-3xl border-collapse">
            <caption className="sr-only">
              ตารางสถานะการจองแต่ละห้องในแต่ละรอบเวลา
            </caption>
            <thead>
              <tr className="border-border from-surface-muted to-accent-soft border-b bg-gradient-to-r">
                <th scope="col" className="p-u3 text-left font-semibold">
                  ห้อง
                </th>
                {slots.map((slot) => (
                  <th
                    key={slot.id}
                    scope="col"
                    className="p-u3 text-center font-semibold whitespace-nowrap"
                  >
                    {slot.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="stagger">
              {rooms.map((room) => (
                <tr
                  key={room.id}
                  className="border-border hover:bg-accent-soft/40 border-b transition-colors duration-200 last:border-0"
                >
                  <th scope="row" className="p-u3 text-left font-medium">
                    {room.name}
                    <span className="text-ink-subtle mt-0.5 block text-xs font-normal">
                      {room.location} · {room.capacity} ที่นั่ง
                    </span>
                  </th>

                  {slots.map((slot) => {
                    const booking = taken.get(`${room.id}:${slot.id}`);
                    const mine = booking?.user_id === profile?.id;
                    const cellId = `${room.id}-${slot.id}`;

                    if (!booking) {
                      return (
                        <td key={slot.id} className="p-u2 text-center">
                          <Link
                            href={`/bookings/new?room=${room.id}&slot=${slot.id}&date=${date}`}
                            data-testid={`free-${cellId}`}
                            className="border-border-strong text-ink-muted hover:from-primary hover:to-violet hover:shadow-glow inline-block rounded-pill border px-u2 py-[5px] text-xs font-medium transition-all duration-200 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-br hover:text-white"
                          >
                            ว่าง · จอง
                          </Link>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={slot.id}
                        className="p-u2 text-center"
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
