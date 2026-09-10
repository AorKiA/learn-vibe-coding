import { existsSync, readFileSync } from "node:fs";

/**
 * Loads .env.local for the test process. Next.js does this for the app, but the
 * Playwright runner and the plain-node checkers are separate processes.
 */
export function loadEnv() {
  if (existsSync(".env.local")) {
    for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const i = trimmed.indexOf("=");
      if (i === -1) continue;
      const key = trimmed.slice(0, i);
      if (!process.env[key]) process.env[key] = trimmed.slice(i + 1);
    }
  }
}

export function supabaseEnv() {
  loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set " +
        "(they live in .env.local, or pass them in the environment).",
    );
  }
  return { url, key };
}
