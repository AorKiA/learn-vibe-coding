/**
 * Runs every acceptance check and prints one table.
 *
 *   PROD_URL=https://your-app.vercel.app npm run verify
 *   BASE_URL=http://localhost:3000 npm run verify   # local smoke run
 *
 * The three stages answer different questions, which is why all three exist:
 *   secrets  — what is in the repository
 *   rls      — what the database permits, asked as two real users
 *   e2e      — what a person sees in a browser against the deployment
 */
import { spawnSync } from "node:child_process";

const target = process.env.PROD_URL ?? process.env.BASE_URL;
if (!target) {
  console.error(
    "\nSet the target first:\n" +
      "  PROD_URL=https://your-app.vercel.app npm run verify\n" +
      "  BASE_URL=http://localhost:3000 npm run verify\n",
  );
  process.exit(1);
}

const isLocal = /localhost|127\.0\.0\.1/.test(target);

const stages = [
  { name: "Repository secrets", cmd: "node", args: ["tests/checks/secrets.mjs"] },
  { name: "RLS and constraints", cmd: "node", args: ["tests/checks/rls.mjs"] },
  { name: "Browser acceptance", cmd: "npx", args: ["playwright", "test"] },
];

const outcomes = [];
for (const stage of stages) {
  console.log(`\n${"=".repeat(64)}\n${stage.name}\n${"=".repeat(64)}`);
  const res = spawnSync(stage.cmd, stage.args, {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  outcomes.push({ name: stage.name, ok: res.status === 0 });
}

console.log(`\n${"=".repeat(64)}`);
console.log(`Acceptance summary — target: ${target}`);
if (isLocal) {
  console.log(
    "WARNING: this run used localhost. Acceptance Test 11 requires the\n" +
      "         production URL, so re-run with PROD_URL before presenting.",
  );
}
console.log("=".repeat(64));
for (const o of outcomes) {
  console.log(`  ${o.ok ? "PASS" : "FAIL"}  ${o.name}`);
}

const failed = outcomes.filter((o) => !o.ok);
console.log(
  `\n${outcomes.length - failed.length}/${outcomes.length} stages passed\n`,
);
process.exit(failed.length === 0 ? 0 : 1);
