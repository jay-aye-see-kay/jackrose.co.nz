import lume from "lume/mod.ts";
import postcss from "lume/plugins/postcss.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";

const site = lume({
  src: "./src",
});

site.use(postcss());
site.use(codeHighlight());

site.remoteFile(
  "github.min.css",
  "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/styles/github.min.css"
);
site.copy("github.min.css");

export default site;
