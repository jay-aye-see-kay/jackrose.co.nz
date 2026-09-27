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

# Type-checks and builds the site into dist/
build:
    npx astro check && npx astro build

# Type-check .astro and .ts files
check:
    npx astro check

# Serve the built dist/ locally (what Cloudflare will serve, minus _headers)
preview: build
    npx astro preview

# Build (incl. astro check) into dist/, then deploy to Cloudflare Pages
# (also happens automatically via Cloudflare Workers Builds on push to main)
deploy: build
    wrangler pages deploy

# Screenshot a page of the running dev server: just shot [--mobile] [--print] /cv
shot *args:
    node scripts/shot.mjs {{args}}
