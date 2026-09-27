# jackrose.co.nz

Personal site: about + contact on `/`, a CV on `/cv`. Astro, static output,
deployed to Cloudflare Pages from Cloudflare Workers Builds (Git integration)
on push to main; `just deploy` is a manual fallback.

## Layout

```
copy/cv.md          CV, the source of truth. Served verbatim at /cv.md
copy/about.md       Homepage about text
src/lib/cv.ts       Parses cv.md into sections -> jobs -> roles
src/components/cv/  Job and Contact components
src/pages/          /, /cv, /404, plus endpoints: cv.md, llms.txt,
                    sitemap.xml, robots.txt
src/site.ts         Name, tagline, location (things not in cv.md)
src/styles/global.css  All styles, including print
public/_headers     Cloudflare headers (Content-Type for /cv.md)
scripts/shot.mjs    Screenshot helper (see below)
```

## Commands

```
just dev            dev server with live reload, http://localhost:4321
just build          astro check + build to dist/
just check          astro check (types)
just shot /cv       screenshot the running dev server -> .shots/
just deploy         manual fallback; push to main auto-deploys via Cloudflare
```

## cv.md conventions

The parser reads the markdown's *shape*, never adds content. Keep to these
patterns and the page lays itself out:

- `# CV - Name`: the name.
- `## Heading`: a section, CSS class `cv-<slug>`. `Contact` and `Summary`
  get special placement at the top; any other section renders generically,
  so new sections need no code.
- `### Mon YYYY - Mon YYYY|Present - Title @ Company (Note)`: a job. Dates
  go in the left column. Bare years work too (`### 2008 - 2012 - Degree @
  University`), which is how Education entries are written.
- `**Role - Team (Mon YYYY - Mon YYYY)**` then a list: a **roomy** role
  (used for recent, detailed jobs).
- `**Role (Mon YYYY - Mon YYYY)** one line of text`: a **compact** role
  (used for older jobs). Either way, roles in one job hang off a red spine
  so long tenures read as one block.
- `- **Label**: value` in Contact: emails become `mailto:`, domains become
  `https://` links.

Headings that don't match a pattern degrade to plain text rather than
breaking the build.

## Viewing pages from the agent sandbox

The sandbox denies mach-register, so Chromium can only run with
`--single-process --disable-features=Compositing` (worked out in
`../bookslikeyou`, doc-5). `scripts/shot.mjs` wraps that with playwright-core
and the cached headless shell in `~/Library/Caches/ms-playwright`.

```
just dev &                    # in the background
just shot /cv                 # full page, 1280 wide
just shot --mobile /cv        # 390 wide, 2x
just shot --viewport /        # above the fold only
just shot --print /cv         # PDF + print-media PNG, reports page count
just shot --el=.cv-contact /cv  # one element at 2x
```

Output goes to `.shots/`, not `/tmp`: the sandbox's `/tmp` isn't the one
other tools read from. The file-read tool also caches by path and can lag
behind sandbox writes, so shots get a timestamp in their name; if a read
says ENOENT, wait ~10s and retry. `rm -rf .shots` whenever.

Also sandbox-related: Astro telemetry is disabled (`ASTRO_TELEMETRY_DISABLED`
in the justfile and `.envrc`) because it can't write its config, and
`wrangler pages dev` doesn't run inside the sandbox, so check `_headers`
after a deploy with `curl -sI https://jackrose.co.nz/cv.md`.
