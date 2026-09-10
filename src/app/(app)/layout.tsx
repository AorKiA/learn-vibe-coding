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
      {/* Translucent and sticky, so the gradient canvas shows through as the
          page scrolls under it rather than being cut off by a solid bar. */}
      <header className="border-border/70 bg-surface/70 sticky top-0 z-20 border-b backdrop-blur-xl">
        <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-u3 px-u4 py-u3">
          <Link href="/rooms" className="group mr-u2 flex items-center gap-u2">
            <span className="from-primary to-violet shadow-glow flex h-8 w-8 items-center justify-center rounded-pill bg-gradient-to-br text-sm font-bold text-white transition-transform duration-300 group-hover:scale-110">
              จ
            </span>
            <span className="font-heading text-h3 font-semibold">
              จองห้องอ่านหนังสือ
            </span>
          </Link>

          <NavLink href="/rooms">ห้องและช่วงเวลาว่าง</NavLink>
          <NavLink href="/bookings">การจองของฉัน</NavLink>
          {isAdmin && <NavLink href="/admin/rooms">จัดการห้อง</NavLink>}

          <div className="ml-auto flex items-center gap-u2">
            <span className="text-ink-muted hidden text-xs sm:inline">
              {profile.email}
            </span>
            {isAdmin && <Badge tone="mine">admin</Badge>}
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-ink-muted hover:text-danger text-small rounded-pill px-u2 py-1 transition-colors"
              >
                ออกจากระบบ
              </button>
            </form>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-u4 py-u5">{children}</main>
    </div>
  );
}

/** A nav link with an accent underline that grows in on hover. */
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-ink-muted hover:text-ink text-small group relative py-1 transition-colors"
    >
      {children}
      <span className="from-primary to-violet absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-pill bg-gradient-to-r transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:scale-x-100" />
    </Link>
  );
}
