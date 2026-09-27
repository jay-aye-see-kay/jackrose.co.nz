// Screenshot a page of the local site, from inside the agent sandbox.
//
//   node scripts/shot.mjs [--mobile] [--print] [--viewport] /some/path
//   (normally `just shot /cv`)
//
// Expects `just dev` (or `just preview`) running; BASE overrides the URL.
// Writes a full-page PNG (or PDF with --print) to /tmp and prints the path.
//
// The browser flags aren't optional: the sandbox denies mach-register, so
// Chromium can't spawn renderer processes. --single-process avoids that, and
// then --disable-features=Compositing avoids a software-compositor hang.
// (Worked out in ../bookslikeyou, doc-5.)

import { glob } from "node:fs/promises";
import { chromium } from "playwright-core";

const BASE = process.env.BASE ?? "http://localhost:4321";

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const path = args.find((a) => !a.startsWith("--")) ?? "/";
if (!path.startsWith("/")) {
  console.error("usage: just shot [--mobile] [--print] [--viewport] /path");
  process.exit(2);
}

async function findShell() {
  const pattern =
    process.env.HOME +
    "/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell";
  for await (const p of glob(pattern)) return p;
  console.error("shot: run `npx playwright-core install chromium --only-shell`");
  process.exit(1);
}

const browser = await chromium.launch({
  headless: true,
  executablePath: await findShell(),
  args: ["--single-process", "--no-sandbox", "--disable-features=Compositing"],
});

try {
  const mobile = flags.has("--mobile");
  const ctx = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 },
    deviceScaleFactor: mobile ? 2 : 1,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(200);

  const slug = path.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-") || "root";
  const suffix = mobile ? "-mobile" : "";
  if (flags.has("--print")) {
    const out = `/tmp/shot-${slug}.pdf`;
    await page.pdf({ path: out, format: "A4", printBackground: true });
    console.log(out);
  } else {
    const out = `/tmp/shot-${slug}${suffix}.png`;
    await page.screenshot({ path: out, fullPage: !flags.has("--viewport") });
    console.log(out);
  }
} finally {
  await browser.close();
}
