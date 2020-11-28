import React from "react";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";

import { DefaultLayout } from "../../components/Layouts";
import { PostMeta } from "../../components/PostMeta";
import { getAllPosts, getPostBySlug } from "../../lib/content";
import { Post } from "../../lib/codecs";
import { LinkToPostSource } from "../../components/LinkToPostSource";
import { markdownToReact } from "../../lib/parseMarkdown";

type Props = {
  post: Post;
};

const PostPage = ({ post }: Props) => {
  console.log('markdownToReact(post.markdown)', markdownToReact(post.markdown));
  return (
    <DefaultLayout>
      <PostMeta post={post} />
      <div className="markdown-content">{markdownToReact(post.markdown)}</div>
      <LinkToPostSource post={post} />
      <div className="mb-8 text-center page-content">
        {!post.archived ? (
          <Link href="/blog">« Back to posts</Link>
        ) : (
          <Link href="/blog-archive">« Back to archived posts</Link>
        )}
      </div>
    </DefaultLayout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (!(params && typeof params.slug === "string")) {
    throw new Error("invalid slug");
  }
  const post = getPostBySlug(params.slug);
  return {
    props: { post },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  let posts = getAllPosts();

  // Don't build draft posts in prod
  if (process.env.NODE_ENV === "production") {
    posts = posts.filter((post) => !post.draft);
  }

  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  };
};

export default PostPage;
