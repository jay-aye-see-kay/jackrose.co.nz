import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";

import { DefaultLayout } from "../components/Layouts";
import { getAllPosts, Post } from "../lib/api";

type Props = {
  allPosts: Post[];
};

const Posts = ({ allPosts }: Props) => {
  return (
    <>
      <Head>
        <title>Posts</title>
      </Head>
      <DefaultLayout>
        <ul>
          {allPosts.map((post) => (
            <li key={post.slug}>
              <Link href={`post/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </DefaultLayout>
      ;
    </>
  );
};

export default Posts;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPosts = getAllPosts();

  return {
    props: { allPosts },
  };
};
