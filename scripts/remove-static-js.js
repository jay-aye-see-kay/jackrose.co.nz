const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const glob = require("glob");

/**
 * This script will remove all js files and references to them in html files
 */

const BUILD_DIR = "./out";

const jsBuildFiles = glob.sync(`${BUILD_DIR}/**/*.js`);
const htmlBuildFiles = glob.sync(`${BUILD_DIR}/**/*.html`);

/**
 * Rewrite a html file, removing all script tags
 */
const removeJsFromHtml = (filename) => {
  const originalHtml = fs.readFileSync(filename, "utf8");
  const $ = cheerio.load(originalHtml);
  $("script").remove();
  $("link[as=script]").remove();
  fs.writeFileSync(filename, $.root().html());
};

htmlBuildFiles.forEach((filename) => {
  removeJsFromHtml(filename);
});

jsBuildFiles.forEach((filename) => {
  fs.unlinkSync(filename);
});

// Quickfix: move all foo.html files to foo/index.html so s3 can serve them
htmlBuildFiles.forEach((filePath) => {
  // leave index.html files alone
  if (filePath.endsWith("index.html")) return;

  const newDir = filePath.replace(/\.html$/, "");
  const newFilePath = path.join(newDir, "index.html");

  fs.mkdirSync(newDir, { recursive: true });
  fs.renameSync(filePath, newFilePath);
});
