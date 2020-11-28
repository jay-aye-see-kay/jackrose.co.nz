import React from "react";
import { H2, H3, H4, P } from "../components/Text";

import { BlogPostImage } from "../components/BlogPostImage";
import unified from "unified";
import remarkParse from "remark-parse";
import remark2rehype from "remark-rehype";
import rehype2react from "rehype-react";

export const markdownProcessor = unified()
  .use(remarkParse)
  .use(remark2rehype)
  .use(rehype2react, {
    createElement: React.createElement,
    // @ts-ignore
    components: { img: BlogPostImage, h2: H2, h3: H3, h4: H4, p: P },
  });

export const markdownToReact = (markdown: string) =>
  markdownProcessor.processSync(markdown).result as React.ReactNode;
