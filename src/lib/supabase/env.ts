/**
 * Both values are public by design: the anon key only grants what RLS allows.
 * Read them through here so a missing variable fails loudly at the first call
 * instead of surfacing as a confusing "Invalid URL" from supabase-js.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local ` +
        `and fill it in from Supabase → Project Settings → API.`,
    );
  }
  return value;
}

export const SUPABASE_URL = () => required("NEXT_PUBLIC_SUPABASE_URL");
export const SUPABASE_ANON_KEY = () => required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
