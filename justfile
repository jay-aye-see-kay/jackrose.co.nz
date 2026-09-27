export ASTRO_TELEMETRY_DISABLED := "1"

# List recipes
default:
    @just --list

# Install node dependencies
install:
    npm install

# Dev server with live reload on http://localhost:4321
dev:
    npx astro dev

# Build the site into dist/
build:
    npx astro build

# Type-check .astro and .ts files
check:
    npx astro check

# Serve the built dist/ locally (what Cloudflare will serve, minus _headers)
preview: build
    npx astro preview

# Build then deploy dist/ to Cloudflare Pages (manual fallback; CI on push to
# main does this automatically)
deploy: build
    wrangler pages deploy

# Screenshot a page of the running dev server: just shot [--mobile] [--print] /cv
shot *args:
    node scripts/shot.mjs {{args}}
