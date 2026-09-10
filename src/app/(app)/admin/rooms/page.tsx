import { getCurrentProfile } from "@/lib/supabase/server";
import { getRooms } from "@/lib/data";
import { Badge, Card, EmptyState, ErrorBanner } from "@/components/ui";
import { NewRoomForm, RoomToggle } from "@/components/room-admin";

export default async function AdminRoomsPage() {
  const profile = await getCurrentProfile();

  // A non-admin reaching this URL sees a refusal instead of the form. Even if
  // they bypassed this page and posted to the Server Action directly, the RLS
  // policy rooms_admin_write would still reject the write.
  if (profile?.role !== "admin") {
    return (
      <div className="space-y-u4">
        <h1 className="text-h1 font-semibold">จัดการห้อง</h1>
        <ErrorBanner>หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</ErrorBanner>
      </div>
    );
  }

  const rooms = await getRooms(true);

  return (
    <div className="space-y-u4">
      <h1 className="text-h1 font-semibold">จัดการห้อง</h1>

      <NewRoomForm />

      <section className="space-y-u2">
        <h2 className="font-medium">ห้องทั้งหมด ({rooms.length})</h2>

        {rooms.length === 0 ? (
          <EmptyState title="ยังไม่มีห้องในระบบ" />
        ) : (
          <ul className="space-y-u2">
            {rooms.map((room) => (
              <li key={room.id}>
                <Card className="flex flex-wrap items-center justify-between gap-u2">
                  <div>
                    <div className="flex items-center gap-u2">
                      <span className="font-medium">{room.name}</span>
                      <Badge tone={room.is_active ? "free" : "neutral"}>
                        {room.is_active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                      </Badge>
                    </div>
                    <p className="text-ink-muted mt-u1 text-small">
                      {room.location ?? "ไม่ระบุสถานที่"} · {room.capacity} ที่นั่ง
                    </p>
                  </div>
                  <RoomToggle room={room} />
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
