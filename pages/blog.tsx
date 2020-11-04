import Head from "next/head";
import { GetStaticProps } from "next";

import { DefaultLayout } from "../components/Layouts";
import { BlogListItem } from "../components/BlogListItem";
import { getAllPosts, Post } from "../lib/content";

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
        <div className="page-content">
          <h1 className="page-title">Blog posts</h1>
          <ul className="mt-4">
            {allPosts.map((post, i, arr) => (
              <>
                <BlogListItem key={post.slug} post={post} />
                {i !== arr.length - 1 && <div className="text-center">~</div>}
              </>
            ))}
          </ul>
        </div>
      </DefaultLayout>
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
