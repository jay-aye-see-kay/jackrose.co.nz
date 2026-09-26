#!/bin/sh
# Build jackrose.co.nz into _site/
# Two static pages, authored by hand in src/. No site generator.
set -e
cd "$(dirname "$0")"

rm -rf _site
mkdir -p _site/cv

cp src/about.html _site/index.html
cp src/cv.html _site/cv/index.html
cp src/styles.css _site/styles.css

echo "Built _site/"
