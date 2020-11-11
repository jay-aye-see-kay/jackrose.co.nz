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
