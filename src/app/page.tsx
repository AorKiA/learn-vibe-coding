import { redirect } from "next/navigation";

/**
 * There is no marketing page. proxy.ts already sent signed-out visitors to
 * /login before this renders, so anyone reaching here has a session.
 */
export default function Home() {
  redirect("/bookings");
}
