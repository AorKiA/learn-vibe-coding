import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Where Supabase sends the user back after email confirmation or a magic link
 * (Acceptance Test 12).
 *
 * The redirect target is built from this request's own origin — not from a
 * hard-coded localhost — so the same code works locally and on Vercel. Both
 * origins must still be listed under Supabase → Authentication → Redirect URLs.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const target = next?.startsWith("/") && !next.startsWith("//") ? next : "/bookings";

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("ลิงก์ยืนยันไม่ถูกต้องหรือหมดอายุแล้ว")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent("ยืนยันตัวตนไม่สำเร็จ กรุณาเข้าสู่ระบบอีกครั้ง")}`,
    );
  }

  return NextResponse.redirect(`${origin}${target}`);
}
