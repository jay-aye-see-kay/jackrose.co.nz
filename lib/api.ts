import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import html from "remark-html";
import remark from "remark";

export const markdownToHtml = async (markdown: string) => {
  const result = await remark().use(html).process(markdown);
  return result.toString();
};

const blogPostsDirectory = join(process.cwd(), "content/blog");
const contentDirectory = join(process.cwd(), "content");

export const getPostSlugs = () => {
  return fs.readdirSync(blogPostsDirectory);
};

// TODO shape validation
export type Post = {
  slug: string;
  title: string;
  created: string;
  updated?: string;
  content: string;
};

export const getPostBySlug = (slug: string) => {
  const realSlug = slug.replace(/\.md$/, ""); // TODO move the .md stripping to getPostSlugs
  const fullPath = join(blogPostsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const post: Post = {
    slug: realSlug,
    title: data.title as string,
    created: (data.created as Date).toJSON(),
    content,
  };

  if (data.updated) {
    post.updated = (data.updated as Date).toJSON();
  }

  return post;
};

export const getAllPosts = () => {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.created > post2.created ? -1 : 1));
  return posts;
};

export const getMarkdownContent = async (filename: string) => {
  const fullPath = join(contentDirectory, `${filename}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const parsed = matter(fileContents);
  const content = await markdownToHtml(parsed.content);

  return {
    meta: parsed.data,
    content,
  };
};
