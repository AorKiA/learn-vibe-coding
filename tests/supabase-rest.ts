import { supabaseEnv } from "./env";

/**
 * A deliberately tiny Supabase REST client used by the checkers.
 *
 * It signs in as a real user and sends that user's access token — the same
 * thing the browser does. Nothing here uses a service_role key, which is why
 * these tests prove RLS rather than bypassing it.
 */
export type Session = { accessToken: string; userId: string; email: string };

export async function signUpViaApi(
  email: string,
  password: string,
): Promise<Session> {
  const { url, key } = supabaseEnv();
  const res = await fetch(`${url}/auth/v1/signup`, {
    method: "POST",
    headers: { apikey: key, "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`signup failed: ${JSON.stringify(body)}`);
  if (!body.access_token) {
    throw new Error(
      "signup returned no session — is 'Confirm email' still enabled in " +
        "Supabase → Authentication → Providers → Email?",
    );
  }
  return { accessToken: body.access_token, userId: body.user.id, email };
}

export async function signInViaApi(
  email: string,
  password: string,
): Promise<Session> {
  const { url, key } = supabaseEnv();
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`signin failed: ${JSON.stringify(body)}`);
  return { accessToken: body.access_token, userId: body.user.id, email };
}

type RestResult<T> = { status: number; body: T; error: { code?: string; message?: string } | null };

export async function rest<T = unknown>(
  session: Session | null,
  path: string,
  init: RequestInit & { prefer?: string } = {},
): Promise<RestResult<T>> {
  const { url, key } = supabaseEnv();
  const headers: Record<string, string> = {
    apikey: key,
    "content-type": "application/json",
    Prefer: init.prefer ?? "return=representation",
  };
  if (session) headers.Authorization = `Bearer ${session.accessToken}`;

  const res = await fetch(`${url}/rest/v1/${path}`, { ...init, headers });
  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  const isError = !res.ok;
  return {
    status: res.status,
    body: parsed as T,
    error: isError ? (parsed as { code?: string; message?: string }) : null,
  };
}
