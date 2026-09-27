// Screenshot a page of the local site, from inside the agent sandbox.
//
//   node scripts/shot.mjs [--mobile] [--print] [--viewport] [--el=SELECTOR] /some/path
//   (normally `just shot /cv`)
//
// Expects `just dev` (or `just preview`) running; BASE overrides the URL.
// Writes a full-page PNG (or PDF with --print) to .shots/ (gitignored;
// /tmp inside the sandbox is not the /tmp other tools see) and prints the path.
//
// The browser flags aren't optional: the sandbox denies mach-register, so
// Chromium can't spawn renderer processes. --single-process avoids that, and
// then --disable-features=Compositing avoids a software-compositor hang.
// (Worked out in ../bookslikeyou, doc-5.)

import { glob, mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const BASE = process.env.BASE ?? "http://localhost:4321";

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const el = args.find((a) => a.startsWith("--el="))?.slice(5);
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

await mkdir(".shots", { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: await findShell(),
  args: ["--single-process", "--no-sandbox", "--disable-features=Compositing"],
});

try {
  const mobile = flags.has("--mobile");
  const ctx = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 900 },
    deviceScaleFactor: mobile || el ? 2 : 1,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(200);

  const slug = path.replace(/^\/+|\/+$/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-") || "root";
  // Unique names: the agent's file-read tool caches by path and lags behind
  // sandbox writes, so reusing a name can show a stale image.
  const stamp = new Date().toTimeString().slice(0, 8).replaceAll(":", "");
  const suffix = (mobile ? "-mobile" : "") + "-" + stamp;
  if (flags.has("--print")) {
    // A PDF as the browser would print it, plus a PNG of print media at
    // A4 width so it can be eyeballed. Prints the PDF's page count too.
    const out = `.shots/shot-${slug}-${stamp}.pdf`;
    const pdf = await page.pdf({ path: out, format: "A4", preferCSSPageSize: true });
    const pages = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    await page.emulateMedia({ media: "print" });
    await page.setViewportSize({ width: 794, height: 1123 });
    const png = `.shots/shot-${slug}-print-${stamp}.png`;
    await page.screenshot({ path: png, fullPage: true });
    console.log(`${out} (${pages} pages)\n${png}`);
  } else if (el) {
    // one element, at 2x, for checking details
    const out = `.shots/shot-${slug}-el${suffix}.png`;
    await page.locator(el).first().screenshot({ path: out, scale: "device" });
    console.log(out);
  } else {
    const out = `.shots/shot-${slug}${suffix}.png`;
    await page.screenshot({ path: out, fullPage: !flags.has("--viewport") });
    console.log(out);
  }
} finally {
  await browser.close();
}
