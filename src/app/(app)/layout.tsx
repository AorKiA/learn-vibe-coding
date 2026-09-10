import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/supabase/server";
import { Badge } from "@/components/ui";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const profile = await getCurrentProfile();

  // proxy.ts already redirected signed-out visitors. This is the second check,
  // close to the data, in case the proxy matcher ever misses a path.
  if (!profile) redirect("/login");

  const isAdmin = profile.role === "admin";

  return (
    <div className="min-h-screen">
      <header className="bg-surface border-border border-b">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-u1 px-u2 py-u1">
          <Link href="/rooms" className="font-heading mr-u1 text-base font-semibold">
            จองห้องอ่านหนังสือ
          </Link>

          <Link href="/rooms" className="text-ink-muted hover:text-primary-dark text-sm">
            ห้องและช่วงเวลาว่าง
          </Link>
          <Link href="/bookings" className="text-ink-muted hover:text-primary-dark text-sm">
            การจองของฉัน
          </Link>
          {isAdmin && (
            <Link
              href="/admin/rooms"
              className="text-ink-muted hover:text-primary-dark text-sm"
            >
              จัดการห้อง
            </Link>
          )}

          <div className="ml-auto flex items-center gap-u1">
            <span className="text-ink-muted hidden text-xs sm:inline">
              {profile.email}
            </span>
            {isAdmin && <Badge tone="mine">admin</Badge>}
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-ink-muted hover:text-danger text-sm"
              >
                ออกจากระบบ
              </button>
            </form>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-u2 py-u2">{children}</main>
    </div>
  );
}
