/**
 * AT#10 — no secret or service-role key anywhere in the repository.
 *
 * Checks the working tree, the committed files, and the whole git history,
 * because deleting a leaked key in a later commit does not unleak it.
 *
 * The patterns deliberately match secret *values*, not mentions of them: a
 * comment in .env.example warning "never put SUPABASE_SERVICE_ROLE_KEY here"
 * is documentation, and a scanner that fails on it teaches people to delete
 * the warning rather than the secret.
 *
 * Run: node tests/checks/secrets.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i > 0 && !process.env[t.slice(0, i)]) {
      process.env[t.slice(0, i)] = t.slice(i + 1);
    }
  }
}

const results = [];
function record(name, passed, detail) {
  results.push({ name, passed, detail });
  console.log(`  ${passed ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

function git(args) {
  try {
    return execFileSync("git", args, { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  } catch (err) {
    // git grep exits 1 when it finds nothing, which is the outcome we want.
    if (err.status === 1) return "";
    throw err;
  }
}

console.log("\nSecret scan\n");

const patterns = [
  // A key actually assigned a value, rather than named in prose.
  "(SERVICE_ROLE|SERVICE_KEY|SECRET_KEY|SUPABASE_SECRET)[A-Z_]*[[:space:]]*[=:][[:space:]]*[\"']?[A-Za-z0-9._-]{12,}",
  // Modern Supabase secret key format.
  "sb_secret_[A-Za-z0-9_-]{10,}",
  "-----BEGIN [A-Z ]*PRIVATE KEY-----",
];

const EXCLUDES = [":(exclude)tests/checks/secrets.mjs"];

const trackedHits = git(["grep", "-nIE", patterns.join("|"), "--", ".", ...EXCLUDES]).trim();
record(
  "no secret values in tracked files",
  trackedHits === "",
  trackedHits ? trackedHits.split("\n").slice(0, 3).join(" | ") : "clean",
);

// `git grep` has no --all: it needs explicit revisions, so enumerate them.
const revisions = git(["rev-list", "--all"]).trim().split("\n").filter(Boolean);
const historyHits = revisions.length
  ? git(["grep", "-nIE", patterns.join("|"), ...revisions, "--", ".", ...EXCLUDES]).trim()
  : "";
record(
  "no secret values anywhere in git history",
  historyHits === "",
  historyHits ? historyHits.split("\n").slice(0, 3).join(" | ") : `clean across ${revisions.length} commits`,
);

/**
 * A Supabase JWT is safe or not depending on its payload, not its shape: an
 * anon key and a service_role key look identical from the outside. Decode any
 * committed JWT and read the role claim.
 */
const jwtHits = git(["grep", "-hoIE", "eyJ[A-Za-z0-9_-]{10,}\\.eyJ[A-Za-z0-9_-]{10,}", "--", ".", ...EXCLUDES])
  .split("\n")
  .map((s) => s.trim())
  .filter(Boolean);

const serviceRoleTokens = jwtHits.filter((token) => {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64url").toString("utf8"),
    );
    return payload.role === "service_role";
  } catch {
    return false;
  }
});
record(
  "no service_role JWT is committed",
  serviceRoleTokens.length === 0,
  jwtHits.length
    ? `${jwtHits.length} JWT-shaped string(s) found, ${serviceRoleTokens.length} with role=service_role`
    : "no JWTs in the repository",
);

// An env file must never have been committed, even once.
const envInHistory = git(["log", "--all", "--pretty=format:", "--name-only", "--diff-filter=A"])
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => /^\.env($|\.)/.test(l) && l !== ".env.example");
record(
  ".env files were never committed",
  envInHistory.length === 0,
  envInHistory.length ? envInHistory.join(", ") : "only .env.example is tracked",
);

const gitignore = existsSync(".gitignore") ? readFileSync(".gitignore", "utf8") : "";
record(
  ".gitignore covers env files",
  /\.env\*/.test(gitignore) || /^\.env$/m.test(gitignore),
  gitignore.includes(".env") ? "matched" : "no .env rule found",
);

// The client bundle is public. Only the publishable/anon key belongs there.
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
let publicKeyOk = publicKey === "" || publicKey.startsWith("sb_publishable_");
let publicKeyDetail = publicKey
  ? `${publicKey.slice(0, 18)}...`
  : "not set in this shell";
if (publicKey.startsWith("eyJ")) {
  try {
    const payload = JSON.parse(
      Buffer.from(publicKey.split(".")[1], "base64url").toString("utf8"),
    );
    publicKeyOk = payload.role === "anon";
    publicKeyDetail = `legacy JWT with role=${payload.role}`;
  } catch {
    publicKeyOk = false;
    publicKeyDetail = "unparseable JWT";
  }
}
record("the browser key is publishable, not a secret key", publicKeyOk, publicKeyDetail);

const failed = results.filter((r) => !r.passed);
console.log(`\n${results.length - failed.length}/${results.length} checks passed\n`);
process.exit(failed.length === 0 ? 0 : 1);
