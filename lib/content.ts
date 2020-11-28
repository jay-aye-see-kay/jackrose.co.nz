import fs from "fs";
import path from "path";
import matter from "gray-matter";

import unified from "unified";
import remarkParse from "remark-parse";
import remark2rehype from "remark-rehype";
import rehype2react from "rehype-react";

import { Post, decodePostMeta } from "./codecs";

// TMP
import React from "react";
import { BlogPostImage } from "../components/BlogPostImage";

const blogPostsDirectoryRelative = "content/blog";
const blogPostsDirectory = path.join(process.cwd(), blogPostsDirectoryRelative);
const contentDirectory = path.join(process.cwd(), "content");

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remark2rehype)
  .use(rehype2react, {
    createElement: React.createElement,
    // @ts-ignore
    components: { img: BlogPostImage },
  });

export const markdownToHtml = (markdown: string) =>
  markdownProcessor.processSync(markdown);

export const getPostSlugs = () => {
  return fs.readdirSync(blogPostsDirectory);
};

export const getPostBySlug = (filename: string): Post => {
  const slug = filename.replace(/\.md$/, "");
  const { meta, content, markdown } = readMarkdownFile(
    filename,
    blogPostsDirectory
  );

  if (meta.created instanceof Date) {
    meta.created = meta.created.toJSON();
  }
  if (meta.updated instanceof Date) {
    meta.updated = meta.updated.toJSON();
  }

  const postMeta = decodePostMeta(meta);

  return {
    ...postMeta,
    content: content.toString(),
    markdown,
    slug,
    path: path.join(blogPostsDirectoryRelative, `${filename}.md`),
  };
};

export const getAllPosts = () => {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.created > post2.created ? -1 : 1));
  return posts;
};

/**
 * Read markdown file from disk and return it's front matter separated
 */
export const readMarkdownFile = (filename: string, dir = contentDirectory) => {
  if (!filename.includes(".")) {
    filename += ".md";
  }
  const fullPath = path.join(dir, filename);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const parsed = matter(fileContents);
  const content = markdownToHtml(parsed.content);

  return {
    meta: parsed.data,
    content,
    markdown: parsed.content,
  };
};
