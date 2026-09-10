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
      {/* Frosted and sticky: the lit canvas keeps moving underneath it. */}
      <header className="glass-strong sticky top-0 z-20 rounded-none border-x-0 border-t-0">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-u4 px-u4 py-u3">
          <Link href="/rooms" className="group flex items-center gap-u2">
            <span className="border-brass/50 text-brass-ink flex h-9 w-9 items-center justify-center rounded-pill border font-heading text-sm transition-colors duration-500 group-hover:border-brass group-hover:bg-brass-soft">
              จ
            </span>
            <span className="font-heading text-h3 leading-none font-medium">
              จองห้องอ่านหนังสือ
            </span>
          </Link>

          <NavLink href="/rooms">ห้องและช่วงเวลาว่าง</NavLink>
          <NavLink href="/bookings">การจองของฉัน</NavLink>
          {isAdmin && <NavLink href="/admin/rooms">จัดการห้อง</NavLink>}

          <div className="ml-auto flex items-center gap-u2">
            <span className="text-ink-subtle hidden text-xs sm:inline">
              {profile.email}
            </span>
            {isAdmin && <Badge tone="mine">admin</Badge>}
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-ink-muted hover:text-danger text-small transition-colors duration-300"
              >
                ออกจากระบบ
              </button>
            </form>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-u4 py-u5">{children}</main>

      <footer className="border-border/60 mx-auto mt-u6 max-w-5xl border-t px-u4 py-u4">
        <p className="text-ink-subtle text-[11px] tracking-[0.14em] uppercase">
          หอสมุดกลาง · ระบบจองห้องอ่านหนังสือ
        </p>
      </footer>
    </div>
  );
}

/** A nav link with a brass rule that draws itself in on hover. */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-ink-muted hover:text-ink text-small group relative py-1 transition-colors duration-300"
    >
      {children}
      <span className="bg-brass absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-calm)] group-hover:scale-x-100" />
    </Link>
  );
}
