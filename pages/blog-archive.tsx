import Head from "next/head";
import { GetStaticProps } from "next";

import { DefaultLayout } from "../components/Layouts";
import { BlogList } from "../components/BlogList";
import { getAllPosts, Post } from "../lib/content";

type Props = {
  posts: Post[];
};

const Posts = ({ posts }: Props) => {
  return (
    <>
      <Head>
        <title>Archived Posts</title>
      </Head>
      <DefaultLayout>
        <div className="page-content">
          <h1 className="page-title">Blog posts</h1>
          <BlogList
            posts={posts}
            lastLink={{ label: "« Back to posts", href: "/blog" }}
          />
        </div>
      </DefaultLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPosts = getAllPosts();
  const posts = allPosts.filter((post) => post.archived && !post.draft);
  return {
    props: { posts },
  };
};

export default Posts;
