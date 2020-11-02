import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";

import { DefaultLayout } from "../../components/Layouts";
import { getAllPosts, getPostBySlug, Post } from "../../lib/api";
import { markdownToHtml } from "../../lib/markdownToHtml";

type Props = {
  post: Post;
  content: string;
};

const PostPage = ({ post, content }: Props) => {
  return (
    <DefaultLayout>
      <h1 className="text-lg font-bold text-center">{post.title}</h1>
      <div className="max-w-xl m-auto markdown-styles" dangerouslySetInnerHTML={{ __html: content }} />
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
