import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import html from "remark-html";
import remark from "remark";

import { Post, decodePostMeta } from "./codecs";

const blogPostsDirectory = join(process.cwd(), "content/blog");
const contentDirectory = join(process.cwd(), "content");

export const markdownToHtml = (markdown: string) =>
  remark().use(html).processSync(markdown).toString();

export const getPostSlugs = () => {
  return fs.readdirSync(blogPostsDirectory);
};

export const getPostBySlug = (filename: string): Post => {
  const slug = filename.replace(/\.md$/, "");
  const { meta, content } = readMarkdownFile(filename, blogPostsDirectory);

  if (meta.created instanceof Date) {
    meta.created = meta.created.toJSON();
  }
  if (meta.updated instanceof Date) {
    meta.updated = meta.updated.toJSON();
  }

  const postMeta = decodePostMeta(meta);

  return {
    ...postMeta,
    content,
    slug,
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
  const fullPath = join(dir, filename);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const parsed = matter(fileContents);
  const content = markdownToHtml(parsed.content);

  return {
    meta: parsed.data,
    content,
  };
};
