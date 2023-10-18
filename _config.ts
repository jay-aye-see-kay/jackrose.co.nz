import lume from "lume/mod.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import date from "lume/plugins/date.ts";
import markdownTaskLists from "npm:markdown-it-task-lists";
import postcss from "lume/plugins/postcss.ts";

const site = lume({ src: "./src" });

site.hooks.addMarkdownItPlugin(markdownTaskLists);

site.use(codeHighlight());
site.use(date());
site.use(postcss());

site.remoteFile(
  "github.min.css",
  "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/styles/github.min.css"
);
site.copy("github.min.css");

export default site;
