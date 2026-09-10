import Link from "next/link";
import { getCurrentProfile } from "@/lib/supabase/server";
import {
  formatThaiDate,
  getBookingsOnDate,
  getRooms,
  getTimeSlots,
  todayISO,
} from "@/lib/data";
import { Badge, Card, EmptyState, Stat } from "@/components/ui";
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
  const total = rooms.length * slots.length;
  const seats = rooms.reduce((sum, room) => sum + room.capacity, 0);

  return (
    <div className="space-y-u5 settle">
      <header className="flex flex-wrap items-end justify-between gap-u4">
        <div className="rule-brass">
          <p className="text-brass-ink mb-u1 text-[11px] font-semibold tracking-[0.18em] uppercase">
            {formatThaiDate(date)}
          </p>
          <h1 className="text-h1 max-w-lg font-medium">ห้องและช่วงเวลาว่าง</h1>
          <p className="text-ink-muted text-small mt-u2 max-w-md">
            เลือกช่องที่ว่างเพื่อจอง ระบบจะกันรอบที่ถูกจองแล้วให้อัตโนมัติ
          </p>
        </div>
        <DatePicker value={date} min={today} />
      </header>

      {rooms.length > 0 && slots.length > 0 && (
        // The "3 beds · 2 baths · 180 sqm" device, doing honest work.
        <Card className="flex flex-wrap items-center gap-u6 py-u4">
          <Stat label="ช่องที่ว่าง" value={total - taken.size} />
          <Stat label="ถูกจองแล้ว" value={taken.size} />
          <Stat label="ห้องทั้งหมด" value={rooms.length} />
          <Stat label="ที่นั่งรวม" value={seats} />
        </Card>
      )}

      {rooms.length === 0 ? (
        <EmptyState
          title="ยังไม่มีห้องในระบบ"
          description="กรุณาติดต่อผู้ดูแลระบบเพื่อเพิ่มห้อง"
        />
      ) : slots.length === 0 ? (
        <EmptyState title="ยังไม่มีรอบเวลาในระบบ" />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="text-small w-full min-w-3xl border-collapse">
            <caption className="sr-only">
              ตารางสถานะการจองแต่ละห้องในแต่ละรอบเวลา
            </caption>
            <thead>
              <tr className="border-border border-b">
                <th
                  scope="col"
                  className="text-ink-subtle p-u3 text-left text-[11px] font-semibold tracking-[0.14em] uppercase"
                >
                  ห้อง
                </th>
                {slots.map((slot) => (
                  <th
                    key={slot.id}
                    scope="col"
                    className="text-ink-subtle p-u3 text-center text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap uppercase"
                  >
                    {slot.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr
                  key={room.id}
                  className="border-border/70 hover:bg-surface/60 border-b transition-colors duration-300 last:border-0"
                >
                  <th scope="row" className="p-u3 text-left">
                    <span className="font-heading text-ink block text-base font-medium">
                      {room.name}
                    </span>
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
                            className="border-border-strong text-ink-muted hover:border-primary hover:bg-primary hover:text-primary-ink inline-block rounded-pill border px-u3 py-[5px] text-[11px] font-medium tracking-wide transition-all duration-300 ease-[var(--ease-calm)]"
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
