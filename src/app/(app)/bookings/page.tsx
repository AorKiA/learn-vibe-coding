import Link from "next/link";
import { getCurrentProfile } from "@/lib/supabase/server";
import { formatThaiDate, getBookings } from "@/lib/data";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  SuccessBanner,
} from "@/components/ui";
import { BookingActions } from "@/components/booking-actions";

export default async function BookingsPage({
  searchParams,
}: PageProps<"/bookings">) {
  const params = await searchParams;
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === "admin";

  // Admins see every booking; everyone else only their own.
  const bookings = await getBookings({
    userId: isAdmin ? undefined : profile?.id,
    includeCancelled: true,
  });

  const notice =
    params.created !== undefined
      ? "จองห้องเรียบร้อยแล้ว"
      : params.updated !== undefined
        ? "แก้ไขการจองเรียบร้อยแล้ว"
        : null;

  return (
    <div className="space-y-u4">
      <div className="flex flex-wrap items-center justify-between gap-u2">
        <div>
          <h1 className="text-h1 font-semibold">
            {isAdmin ? "การจองทั้งหมด" : "การจองของฉัน"}
          </h1>
          {isAdmin && (
            <p className="text-ink-muted mt-u1 text-small">
              คุณเป็นผู้ดูแลระบบ จึงเห็นและจัดการการจองของทุกคน
            </p>
          )}
        </div>
        <Link href="/bookings/new">
          <Button>จองห้องใหม่</Button>
        </Link>
      </div>

      {notice && <SuccessBanner>{notice}</SuccessBanner>}

      {bookings.length === 0 ? (
        <EmptyState
          title="ยังไม่มีการจอง"
          description="เลือกห้องและรอบเวลาที่ว่างเพื่อสร้างการจองแรกของคุณ"
          action={
            <Link href="/rooms">
              <Button>ดูห้องที่ว่าง</Button>
            </Link>
          }
        />
      ) : (
        <ul className="space-y-u2" data-testid="booking-list">
          {bookings.map((booking) => {
            const canManage =
              booking.user_id === profile?.id || Boolean(isAdmin);

            return (
              <li key={booking.id}>
                <Card className="flex flex-wrap items-start justify-between gap-u2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-u2">
                      <span className="font-medium">
                        {booking.rooms?.name ?? "ห้องที่ถูกลบไปแล้ว"}
                      </span>
                      <Badge tone={booking.status === "active" ? "free" : "neutral"}>
                        {booking.status === "active" ? "ใช้งานอยู่" : "ยกเลิกแล้ว"}
                      </Badge>
                    </div>

                    <p className="text-ink-muted mt-u1 text-small">
                      {formatThaiDate(booking.booking_date)} ·{" "}
                      {booking.time_slots?.label ?? "-"}
                      {booking.rooms?.location && ` · ${booking.rooms.location}`}
                    </p>

                    <p className="mt-u1 text-small break-words">
                      วัตถุประสงค์: {booking.purpose}
                    </p>
                  </div>

                  <BookingActions
                    id={booking.id}
                    status={booking.status}
                    canManage={canManage}
                  />
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
