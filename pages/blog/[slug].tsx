import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";

import { DefaultLayout } from "../../components/Layouts";
import { PostMeta } from "../../components/PostMeta";
import { getAllPosts, getPostBySlug, Post } from "../../lib/api";
import { markdownToHtml } from "../../lib/markdownToHtml";

type Props = {
  post: Post;
  content: string;
};

const PostPage = ({ post, content }: Props) => {
  return (
    <DefaultLayout>
      <div className="max-w-xl px-1 m-auto">
        <h1 className="mt-4 text-2xl">{post.title}</h1>
        <PostMeta post={post} />
        <div
          className="markdown-styles"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </DefaultLayout>
  );
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  if (!(params && typeof params.slug === "string")) {
    throw new Error("invalid slug");
  }
  const post = getPostBySlug(params.slug);
  const content = await markdownToHtml(post.content);
  return {
    props: { post, content },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts();
  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  };
};

export default PostPage;
