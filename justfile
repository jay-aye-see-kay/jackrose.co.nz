# Build the site into _site/
build:
    ./build.sh

# Build then deploy _site/ to Cloudflare Pages
deploy: build
    wrangler pages deploy

# Serve the site locally with live reload
serve:
    python3 -m http.server 8000 --directory _site
