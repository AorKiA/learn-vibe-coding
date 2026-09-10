import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * Must be created per request — never hoist this into a module-level singleton,
 * or one user's session would leak into another's request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL(), SUPABASE_ANON_KEY(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot write cookies. Harmless here: proxy.ts
          // refreshes the session on every request, so tokens stay current.
        }
      },
    },
  });
}

/**
 * The single place the app learns who the caller is.
 *
 * Uses getUser(), not getSession(): getSession() reads the cookie without
 * verifying it, so a tampered cookie would be believed. getUser() validates the
 * JWT against Supabase Auth.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Current user plus their application role, or null when signed out. */
export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: profile?.email ?? user.email ?? "",
    role: (profile?.role ?? "user") as "user" | "admin",
  };
}
