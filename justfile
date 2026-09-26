# Build the Lume site into _site/
build:
    deno task build

# Build then deploy _site/ to Cloudflare Pages
deploy: build
    wrangler pages deploy

# Serve the site locally with live reload
serve:
    deno task serve
